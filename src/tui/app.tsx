import { Box, Text, useApp, useInput } from 'ink'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { planFromRecipe, render } from '../core/index.ts'
import type { Arg, Plan, Recipe } from '../core/types.ts'
import { parseProgressLine } from '../progress/index.ts'
import { recipes } from '../recipes/index.ts'
import { runProcess } from '../runner/index.ts'
import { compileRuntimeSpec, detectBinary, validateAgainstRuntime } from '../tools/index.ts'
import type { RuntimeSpec } from '../tools/index.ts'
import { OutcomeScreen, OptionsScreen, ResultScreen } from './screens/index.ts'
import type { ResultFinding } from './screens/index.ts'

type Screen = 'outcome' | 'options' | 'result'

export interface AppProps {
  /** Enable command execution. */
  runEnabled?: boolean
  /** Skip confirmation before execution. */
  yes?: boolean
  /** Binary name or path for detection. */
  binary?: string
}

function parseRawArgs(raw: string): Arg[] {
  const tokens = raw.trim().split(/\s+/).filter(Boolean)
  const args: Arg[] = []
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.startsWith('-')) {
      const flag = token.replace(/^-+/, '')
      const next = tokens[i + 1]
      if (next && !next.startsWith('-')) {
        args.push({ flag, value: next })
        i++
      } else {
        args.push({ flag })
      }
    } else {
      args.push({ flag: null, value: token })
    }
  }
  return args
}

function planCommand(plan: Plan): string {
  return render({ program: plan.tool, args: plan.args, shell: plan.shell }, plan.shell)
}

function recipeFromId(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id) as Recipe | undefined
}

const HIGH_VALUE_GROUPS = [
  {
    label: 'Select',
    ids: ['list-formats', 'match-filters', 'format-sort-small', 'use-extractors'],
  },
  {
    label: 'Metadata',
    ids: ['parse-metadata', 'split-chapters', 'force-keyframes-at-cuts', 'load-info-json'],
  },
  {
    label: 'Network',
    ids: ['impersonate', 'concurrent-fragments', 'throttled-rate', 'sleep-jitter'],
  },
  {
    label: 'Output',
    ids: ['template-playlist', 'template-chapter', 'stdout-pipe', 'exec-guarded'],
  },
] as const

function highValueGroups() {
  return HIGH_VALUE_GROUPS.map((group) => ({
    label: group.label,
    items: group.ids
      .map((id) => recipes.find((recipe) => recipe.id === id))
      .filter((recipe): recipe is NonNullable<typeof recipe> => recipe !== undefined)
      .map((recipe) => ({ id: recipe.id, name: recipe.name })),
  }))
}

function buildPlan(recipe: Recipe, quality: string, rawArgs: string): Plan {
  const values: Record<string, string> = { shell: 'posix' }
  // Map quality to format if recipe uses format flag; keep simple.
  if (quality && quality !== 'best') {
    const qualityMap: Record<string, string> = {
      good: 'bv[height<=1080]+ba/best',
      medium: 'bv[height<=720]+ba/best',
      low: 'bv[height<=480]+ba/best',
    }
    const mapped = qualityMap[quality]
    if (mapped) values.format = mapped
  }
  const plan = planFromRecipe(recipe, values)
  const extra = parseRawArgs(rawArgs)
  if (extra.length === 0) return plan
  return { ...plan, args: [...plan.args, ...extra] }
}

/** Main TUI app. */
export function App({ runEnabled = false, yes = false, binary = 'yt-dlp' }: AppProps) {
  const { exit } = useApp()
  const [screen, setScreen] = useState<Screen>('outcome')
  const [recipeId, setRecipeId] = useState<string>(HIGH_VALUE_GROUPS[0]?.ids[0] ?? '')
  const [quality, setQuality] = useState('best')
  const [rawArgs, setRawArgs] = useState('')
  const [shell] = useState<'posix'>('posix')
  const [detection] = useState(() => {
    const detected = detectBinary(binary)
    if (!detected.ok) {
      return { version: 'unknown', spec: null as RuntimeSpec | null, message: detected.message }
    }
    try {
      const compiled = compileRuntimeSpec(detected.path)
      return {
        version: compiled.version,
        spec: compiled as RuntimeSpec | null,
        message: null as string | null,
      }
    } catch {
      return {
        version: detected.version,
        spec: null as RuntimeSpec | null,
        message: 'yt-dlp found but spec could not be compiled.',
      }
    }
  })
  const version = detection.version
  const spec = detection.spec
  const binaryMessage = detection.message
  const [runStatus, setRunStatus] = useState<string>('ready')
  const [running, setRunning] = useState(false)
  const [progressPercent, setProgressPercent] = useState<number | null>(null)
  const [progressSpeed, setProgressSpeed] = useState<string | null>(null)
  const [rawLog, setRawLog] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const ranRef = useRef(false)
  const stdoutBufferRef = useRef('')

  const selectedRecipe = useMemo(() => recipeFromId(recipeId), [recipeId])

  const plan = useMemo(() => {
    if (!selectedRecipe) return null
    return buildPlan(selectedRecipe, quality, rawArgs)
  }, [selectedRecipe, quality, rawArgs])

  const command = useMemo(() => (plan ? planCommand(plan) : ''), [plan])

  const findings: ResultFinding[] = useMemo(() => {
    if (!selectedRecipe || !spec) return []
    // Validate the recipe extended with raw args as a synthetic recipe.
    const extra = parseRawArgs(rawArgs)
    const recipeForValidation: Recipe = {
      ...selectedRecipe,
      args: [...selectedRecipe.args, ...extra],
    }
    return validateAgainstRuntime(spec, recipeForValidation).map((f) => ({
      severity: f.severity,
      code: f.code,
      message: f.message,
    }))
  }, [selectedRecipe, spec, rawArgs])

  const doRun = useCallback(async () => {
    if (!runEnabled || !plan || running || ranRef.current) return
    ranRef.current = true
    const detected = detectBinary(binary)
    if (!detected.ok) {
      setRunStatus('missing binary')
      return
    }
    const controller = new AbortController()
    abortRef.current = controller
    setRunning(true)
    setRunStatus('running')
    setProgressPercent(null)
    setProgressSpeed(null)
    setRawLog('')
    stdoutBufferRef.current = ''
    const argv = [
      detected.path,
      ...plan.args.flatMap((a) => {
        if (a.flag === null) return a.value ? [a.value] : []
        const flag = a.flag.startsWith('-') ? a.flag : `--${a.flag}`
        if (a.values) return a.values.flatMap((v) => [flag, v])
        if (a.value !== undefined) return [flag, a.value]
        return [flag]
      }),
    ]
    const onLine = (line: string) => {
      const update = parseProgressLine(line)
      if (update === null) return
      if (update.percent !== null) setProgressPercent(update.percent)
      if (update.speed !== null) setProgressSpeed(update.speed)
    }
    const onStdout = (chunk: string) => {
      setRawLog((prev) => prev + chunk)
      stdoutBufferRef.current += chunk
      const parts = stdoutBufferRef.current.split(/\r\n|\n|\r/)
      stdoutBufferRef.current = parts.pop() ?? ''
      for (const part of parts) onLine(part)
    }
    const onStderr = (chunk: string) => {
      setRawLog((prev) => prev + chunk)
    }
    try {
      const result = await runProcess(argv, controller.signal, { onStdout, onStderr })
      const tail = stdoutBufferRef.current
      if (tail.length > 0) {
        onLine(tail)
        stdoutBufferRef.current = ''
      }
      setRunStatus(result.exitCode === 0 ? 'exit 0' : `exit ${result.exitCode ?? 1}`)
    } catch {
      setRunStatus('failed')
    } finally {
      setRunning(false)
      abortRef.current = null
    }
  }, [runEnabled, plan, running, binary])

  useEffect(() => {
    if (screen !== 'result') return
    if (!runEnabled) return
    if (!yes) return
    queueMicrotask(() => {
      void doRun()
    })
  }, [screen, runEnabled, yes, doRun])

  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      abortRef.current?.abort()
      exit()
      return
    }
    if (screen === 'options' && key.return) {
      setScreen('result')
      return
    }
    if (screen === 'result') {
      if (input === 'q') {
        abortRef.current?.abort()
        exit()
        return
      }
      if (runEnabled && !yes && input === 'r' && !running && !ranRef.current) {
        void doRun()
      }
    }
  })

  if (binaryMessage) {
    return (
      <Box flexDirection="column">
        <Text>{binaryMessage}</Text>
      </Box>
    )
  }

  if (screen === 'outcome') {
    return (
      <OutcomeScreen
        groups={highValueGroups()}
        selectedId={recipeId}
        onSelect={(id) => {
          setRecipeId(id)
          setScreen('options')
        }}
      />
    )
  }

  if (screen === 'options') {
    return (
      <OptionsScreen
        quality={quality}
        shell={shell}
        rawArgs={rawArgs}
        onChange={(value) => {
          setQuality(value.quality)
          setRawArgs(value.rawArgs)
        }}
      />
    )
  }

  const showRunInfo = runEnabled || runStatus !== 'ready'
  return (
    <ResultScreen
      command={command}
      findings={findings}
      version={`${version}${runEnabled ? ` | ${runStatus}` : ''}`}
      running={running}
      progressPercent={showRunInfo ? progressPercent : undefined}
      progressSpeed={showRunInfo ? progressSpeed : undefined}
      rawLog={showRunInfo ? rawLog : undefined}
    />
  )
}

export default App
