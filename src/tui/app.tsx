import { existsSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Box, Text, useApp, useInput, useStdout } from 'ink'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { planFromRecipe, render } from '../core/index.ts'
import type { Arg, Finding, Plan, Recipe } from '../core/types.ts'
import { parseProgressLine } from '../progress/index.ts'
import { recipes } from '../recipes/index.ts'
import { runProcess } from '../runner/index.ts'
import { compileRuntimeSpec, detectBinary, validateAgainstRuntime } from '../tools/index.ts'
import type { RuntimeSpec } from '../tools/index.ts'
import { bindRecipeValues } from './binding.ts'
import { Chrome, HelpOverlay } from './components/index.ts'
import { isNarrow } from './theme.ts'
import { curatedTasks } from './tasks.ts'
import { OutcomeScreen, OptionsScreen, ResultScreen, MoreTasksScreen } from './screens/index.ts'
import {
  OPTIONS_HINTS,
  OPTIONS_HINTS_NARROW,
  OUTCOME_HINTS,
  RESULT_HINTS,
  RESULT_HINTS_NARROW,
  MORE_HINTS,
} from './screens/index.ts'
import type { ResultFinding } from './screens/index.ts'

type Screen = 'outcome' | 'more' | 'options' | 'result'

export interface AppProps {
  /** Enable command execution. */
  runEnabled?: boolean
  /** Skip confirmation before execution. */
  yes?: boolean
  /** Binary name or path for detection. */
  binary?: string
  /** Allow overwriting an existing output file. */
  force?: boolean
  /** Allow unsafe recipes and raw exec/output flags. */
  unsafe?: boolean
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

const LEGACY_HIGH_VALUE_IDS = [
  'list-formats',
  'match-filters',
  'format-sort-small',
  'use-extractors',
  'parse-metadata',
  'split-chapters',
  'force-keyframes-at-cuts',
  'load-info-json',
  'impersonate',
  'concurrent-fragments',
  'throttled-rate',
  'sleep-jitter',
  'template-playlist',
  'template-chapter',
  'stdout-pipe',
  'exec-guarded',
] as const

function legacyHiddenItems() {
  const flat = LEGACY_HIGH_VALUE_IDS.map((id) => {
    const recipe = recipeFromId(id)
    return recipe ? { id: recipe.id, name: recipe.name } : null
  }).filter((item): item is { id: string; name: string } => item !== null)
  return [...flat.slice(7), ...flat.slice(0, 7)]
}

function getOutputValue(args: readonly Arg[]): string | null {
  for (const arg of args) {
    if ((arg.flag === 'o' || arg.flag === 'output') && arg.value) return arg.value
  }
  return null
}

function withInferredOutput(args: Arg[]): Arg[] {
  if (getOutputValue(args) !== null) return args
  const tempPath = join(
    tmpdir(),
    `yt-dlp-tui-${Date.now()}-${Math.random().toString(16).slice(2)}.out`,
  )
  return [...args, { flag: 'output', value: tempPath }]
}

function buildPlan(
  recipe: Recipe,
  quality: string,
  rawArgs: string,
  sourceUrl: string,
): { plan: Plan; bindingFindings: Finding[]; outputPath: string | null } {
  const values: Record<string, string> = { shell: 'posix' }
  if (quality && quality !== 'best') {
    const qualityMap: Record<string, string> = {
      good: 'bv[height<=1080]+ba/best',
      medium: 'bv[height<=720]+ba/best',
      low: 'bv[height<=480]+ba/best',
    }
    const mapped = qualityMap[quality]
    if (mapped) values.format = mapped
  }
  const basePlan = planFromRecipe(recipe, values)
  const bound = bindRecipeValues({ ...recipe, args: basePlan.args }, { ...values, sourceUrl })
  const extra = parseRawArgs(rawArgs)
  const merged = extra.length === 0 ? bound.args : [...bound.args, ...extra]
  const args = withInferredOutput(merged)
  return {
    plan: { ...basePlan, args },
    bindingFindings: bound.findings,
    outputPath: getOutputValue(args),
  }
}

/** Main TUI app. */
export function App({
  runEnabled = false,
  yes = false,
  binary = 'yt-dlp',
  force = false,
  unsafe = false,
}: AppProps) {
  const { exit } = useApp()
  const { stdout } = useStdout()
  const narrow = isNarrow((stdout as unknown as { columns?: number }).columns)
  const [screen, setScreen] = useState<Screen>('outcome')
  const [helpOpen, setHelpOpen] = useState(false)
  const [recipeId, setRecipeId] = useState<string>(curatedTasks[0]?.id ?? '')
  const [quality, setQuality] = useState('best')
  const [rawArgs, setRawArgs] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [advanced, setAdvanced] = useState(false)
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
  const [verification, setVerification] = useState<'verified' | 'failed' | 'blocked' | null>(null)
  const [blockedReason, setBlockedReason] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const ranRef = useRef(false)
  const stdoutBufferRef = useRef('')

  const selectedRecipe = useMemo(() => recipeFromId(recipeId), [recipeId])
  const selectedTaskLabel = useMemo(() => {
    const curated = curatedTasks.find((task) => task.id === recipeId)
    if (curated) return curated.label
    return selectedRecipe?.name ?? recipeId
  }, [recipeId, selectedRecipe])

  const built = useMemo(() => {
    if (!selectedRecipe) return null
    return buildPlan(selectedRecipe, quality, rawArgs, sourceUrl)
  }, [selectedRecipe, quality, rawArgs, sourceUrl])

  const plan = built?.plan ?? null
  const command = useMemo(() => (plan ? planCommand(plan) : ''), [plan])

  const findings: ResultFinding[] = useMemo(() => {
    if (!selectedRecipe) return []
    const bindingFindings: ResultFinding[] = (built?.bindingFindings ?? []).map((f) => ({
      severity: f.severity,
      code: f.code,
      message: f.message,
    }))
    if (!spec) return bindingFindings
    const recipeForValidation: Recipe = {
      ...selectedRecipe,
      args: built?.plan.args ?? selectedRecipe.args,
    }
    const validationFindings = validateAgainstRuntime(spec, recipeForValidation).map((f) => ({
      severity: f.severity,
      code: f.code,
      message: f.message,
    }))
    return [...bindingFindings, ...validationFindings]
  }, [selectedRecipe, spec, built])

  const doRun = useCallback(async () => {
    if (!runEnabled || !plan || running || ranRef.current) return

    if (!unsafe) {
      const recipeIdUnsafe =
        selectedRecipe?.id === 'exec-guarded' || selectedRecipe?.id === 'stdout-pipe'
      const rawExec = /(^|\s)--exec(=|\s|$)/.test(rawArgs)
      const rawOutputDash = /(^|\s)(--output|-o)(\s+|=)-(\s|$)/.test(rawArgs)
      const planExec = plan.args.some((a) => a.flag === 'exec')
      const planOutputDash = plan.args.some(
        (a) => (a.flag === 'output' || a.flag === 'o') && a.value === '-',
      )
      if (recipeIdUnsafe || rawExec || rawOutputDash || planExec || planOutputDash) {
        ranRef.current = true
        setRunStatus('blocked')
        setVerification('blocked')
        setBlockedReason('Blocked: unsafe recipe or flag requires --unsafe.')
        return
      }
    }

    const blockingFindings = findings.filter(
      (f) => f.code === 'UNBOUND_PLACEHOLDER' || f.severity === 'error',
    )
    if (blockingFindings.length > 0) {
      ranRef.current = true
      setRunStatus('blocked')
      setVerification('blocked')
      setBlockedReason('Blocked: resolve blocking findings before running.')
      return
    }

    const outputPath = built?.outputPath ?? null
    if (outputPath && outputPath !== '-' && existsSync(outputPath) && !force) {
      ranRef.current = true
      setRunStatus('blocked')
      setVerification('blocked')
      setBlockedReason('Blocked: output file exists. Use --force to overwrite.')
      return
    }

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
    setVerification(null)
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
      if (result.exitCode === 0) {
        setRunStatus('exit 0')
        if (outputPath && outputPath !== '-') {
          try {
            const ok = existsSync(outputPath) && statSync(outputPath).size > 0
            setVerification(ok ? 'verified' : 'failed')
          } catch {
            setVerification('failed')
          }
        } else {
          setVerification('verified')
        }
      } else {
        setRunStatus(`exit ${result.exitCode ?? 1}`)
        setVerification('failed')
      }
    } catch {
      setRunStatus('failed')
      setVerification('failed')
    } finally {
      setRunning(false)
      abortRef.current = null
    }
  }, [runEnabled, plan, running, binary, findings, built, force, unsafe, selectedRecipe, rawArgs])

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
    if (input === '?') {
      setHelpOpen((open) => !open)
      return
    }
    if (key.escape && helpOpen) {
      setHelpOpen(false)
      return
    }
    if (helpOpen) return
    if (screen === 'outcome' && input === 'm') {
      setScreen('more')
      return
    }
    if (screen === 'options') {
      if (input === 'a' && !key.ctrl && !key.meta) {
        // Let OptionsScreen handle 'a' for text fields; App toggles for quality focus
        // by relying on OptionsScreen onToggleAdvanced. No-op here to avoid double toggle.
      }
      if (key.return) {
        setScreen('result')
        return
      }
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

  const step = screen === 'outcome' || screen === 'more' ? 1 : screen === 'options' ? 2 : 3
  const label =
    screen === 'outcome'
      ? 'Outcome'
      : screen === 'more'
        ? 'More tasks'
        : screen === 'options'
          ? 'Options'
          : 'Result'
  const statusValue =
    screen === 'outcome'
      ? `${curatedTasks.length + 1} options`
      : screen === 'more'
        ? 'search all tasks'
        : screen === 'options'
          ? 'shell: posix'
          : running
            ? 'running'
            : 'ready'

  const hints = helpOpen
    ? [
        { key: '?', action: 'close' },
        { key: 'Esc', action: 'close' },
      ]
    : narrow
      ? screen === 'outcome'
        ? [
            { key: 'Up/Dn', action: 'move' },
            { key: 'Enter', action: 'select' },
            { key: 'm', action: 'more' },
            { key: '?', action: 'help' },
          ]
        : screen === 'more'
          ? [
              { key: 'Up/Dn', action: 'move' },
              { key: 'Type', action: 'filter' },
              { key: 'Enter', action: 'select' },
              { key: 'Esc', action: 'back' },
            ]
          : screen === 'options'
            ? [...OPTIONS_HINTS_NARROW]
            : [...RESULT_HINTS_NARROW]
      : screen === 'outcome'
        ? [...OUTCOME_HINTS, { key: 'm', action: 'more tasks' }]
        : screen === 'more'
          ? [...MORE_HINTS]
          : screen === 'options'
            ? [...OPTIONS_HINTS]
            : [...RESULT_HINTS]

  return (
    <Chrome
      appName="yt-dlp wrapper"
      version={version}
      step={step}
      totalSteps={3}
      label={label}
      value={statusValue}
      hints={hints}
    >
      {helpOpen ? (
        <HelpOverlay />
      ) : screen === 'outcome' ? (
        <OutcomeScreen
          groups={[
            {
              label: 'Common tasks',
              items: curatedTasks.map((t) => ({ id: t.id, name: t.label, hint: t.hint })),
            },
          ]}
          hiddenItems={legacyHiddenItems()}
          selectedId={recipeId}
          onSelect={(id) => {
            setRecipeId(id)
            setScreen('options')
          }}
          onMore={() => setScreen('more')}
          showMore
          embedded
        />
      ) : screen === 'more' ? (
        <MoreTasksScreen
          onSelect={(id) => {
            setRecipeId(id)
            setScreen('options')
          }}
          onBack={() => setScreen('outcome')}
          embedded
        />
      ) : screen === 'options' ? (
        <OptionsScreen
          quality={quality}
          shell={shell}
          rawArgs={rawArgs}
          sourceUrl={sourceUrl}
          onSourceUrl={setSourceUrl}
          advanced={advanced}
          onToggleAdvanced={() => setAdvanced((v) => !v)}
          onChange={(value) => {
            setQuality(value.quality)
            setRawArgs(value.rawArgs)
          }}
          embedded
          narrow={narrow}
        />
      ) : (
        <ResultScreen
          command={command}
          findings={findings}
          version={`${version}${runEnabled ? ` | ${runStatus}` : ''}`}
          taskLabel={selectedTaskLabel}
          running={running}
          progressPercent={runEnabled || runStatus !== 'ready' ? progressPercent : undefined}
          progressSpeed={runEnabled || runStatus !== 'ready' ? progressSpeed : undefined}
          rawLog={runEnabled || runStatus !== 'ready' ? (narrow ? undefined : rawLog) : undefined}
          verification={runEnabled || runStatus !== 'ready' ? verification : undefined}
          blockedReason={runEnabled || runStatus !== 'ready' ? blockedReason : undefined}
          embedded
          narrow={narrow}
        />
      )}
    </Chrome>
  )
}

export default App
