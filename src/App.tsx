import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Finding, Recipe, Shell } from './core/types.ts'
import { planFromRecipe, render, validate } from './core/index.ts'
import { coverageNote, heroStrings, validatorWarnings } from './content/index.ts'
import { recipes } from './recipes/index.ts'
import { spec } from './spec/index.ts'
import { AdvancedDrawer } from './ui/advanced/index.ts'
import { CalibrationPanel } from './ui/calibration/index.ts'
import { HandoffPanel } from './ui/handoff/index.ts'
import { FormatLadder } from './ui/moment/index.ts'
import { OutcomeGrid } from './ui/outcomes/index.ts'
import { Callout, Field } from './ui/primitives/index.ts'
import { CommandReceipt } from './ui/receipt/index.ts'

interface ShareState {
  recipeId: string
  sourceUrl: string
  quality: string
  shell: Shell
  rawArgs: string
  advancedOpen: boolean
}

const DEFAULT_STATE: ShareState = {
  recipeId: recipes[0]?.id ?? 'best-video',
  sourceUrl: '',
  quality: '1080p',
  shell: 'posix',
  rawArgs: '',
  advancedOpen: false,
}

const SHELLS: Shell[] = ['posix', 'powershell', 'cmd']

function isShell(value: string | null): value is Shell {
  return value !== null && SHELLS.includes(value as Shell)
}

export function parseHash(hash: string): ShareState {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const recipeId = params.get('recipeId') ?? DEFAULT_STATE.recipeId
  const sourceUrl = params.get('sourceUrl') ?? DEFAULT_STATE.sourceUrl
  const quality = params.get('quality') ?? DEFAULT_STATE.quality
  const shellValue = params.get('shell')
  const shell = isShell(shellValue) ? shellValue : DEFAULT_STATE.shell
  const rawArgs = params.get('rawArgs') ?? DEFAULT_STATE.rawArgs
  const advancedOpen = params.get('advancedOpen') === '1'
  return { recipeId, sourceUrl, quality, shell, rawArgs, advancedOpen }
}

export function buildHash(state: ShareState): string {
  const params = new URLSearchParams()
  params.set('recipeId', state.recipeId)
  if (state.sourceUrl) params.set('sourceUrl', state.sourceUrl)
  if (state.quality) params.set('quality', state.quality)
  params.set('shell', state.shell)
  if (state.rawArgs) params.set('rawArgs', state.rawArgs)
  if (state.advancedOpen) params.set('advancedOpen', '1')
  return `#${params.toString()}`
}

const OUTCOME_TO_RECIPE: Record<string, string> = {
  outcomeDownloadVideo: 'best-video',
  outcomeExtractAudio: 'audio-mp3',
  outcomeConvertFormat: 'format-1080p',
  outcomeResumeDownload: 'archive-resume',
  outcomeListFormats: 'best-video',
  outcomeCopyCommand: 'best-video',
}

const QUALITY_TO_RECIPE: Record<string, string> = {
  '2160p': 'format-4k',
  '1440p': 'format-1080p',
  '1080p': 'format-1080p',
  '720p': 'best-video',
  '480p': 'best-video',
  audio: 'audio-mp3',
}

function warningText(code: string): string {
  return validatorWarnings.find((item) => item.code === code)?.text ?? code
}

function findingTone(severity: Finding['severity']): 'error' | 'warning' | 'note' {
  if (severity === 'error') return 'error'
  if (severity === 'warning') return 'warning'
  return 'note'
}

function commandSentences(recipeName: string, sourceUrl: string): string[] {
  const first = `This command uses the ${recipeName} recipe.`
  const second = sourceUrl.trim()
    ? 'It targets the URL you provided.'
    : 'Add a URL to target a specific video.'
  return [first, second]
}

const NAV_LINKS = [
  { id: 'builder', label: 'Builder' },
  { id: 'validation', label: 'Validation' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'handoff', label: 'Handoff' },
  { id: 'coverage', label: 'Coverage' },
] as const

const SCREEN_1: CSSProperties = { '--h': 1, height: '100svh' } as CSSProperties
const SCREEN_2: CSSProperties = { '--h': 2, height: '200svh' } as CSSProperties

export default function App() {
  const [state, setState] = useState<ShareState>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATE
    return parseHash(window.location.hash)
  })

  useEffect(() => {
    const next = buildHash(state)
    if (window.location.hash !== next) {
      history.replaceState(null, '', next)
    }
  }, [state])

  useEffect(() => {
    const onHashChange = () => {
      setState(parseHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const next = parseHash(window.location.hash)
      setState((current) => ({
        ...current,
        recipeId: next.recipeId,
        shell: next.shell,
        quality: next.quality,
      }))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const recipe = useMemo(
    () => (recipes.find((item) => item.id === state.recipeId) ?? recipes[0]) as Recipe | undefined,
    [state.recipeId],
  )

  const plan = useMemo(() => {
    if (!recipe) return null
    const base = planFromRecipe(recipe, { shell: state.shell })
    const url = state.sourceUrl.trim()
    if (!url) return base
    return {
      ...base,
      args: [...base.args, { flag: null, value: url }],
    }
  }, [recipe, state.shell, state.sourceUrl])

  const findings = useMemo(() => {
    if (!plan) return []
    return validate(plan, spec)
  }, [plan])

  const command = useMemo(() => {
    if (!plan) return ''
    return render({ program: 'yt-dlp', args: plan.args, shell: plan.shell }, plan.shell)
  }, [plan])

  const heroHeading = heroStrings.find((item) => item.id === 'heroHeading')?.text ?? ''
  const heroSupport = heroStrings.find((item) => item.id === 'heroSupport')?.text ?? ''

  const update = (patch: Partial<ShareState>) => {
    setState((current) => ({ ...current, ...patch }))
  }

  const onOutcomeSelect = (outcomeId: string) => {
    const nextRecipe = OUTCOME_TO_RECIPE[outcomeId]
    if (nextRecipe) update({ recipeId: nextRecipe })
  }

  const onQualityChange = (quality: string) => {
    const nextRecipe = QUALITY_TO_RECIPE[quality]
    update({
      quality,
      ...(nextRecipe ? { recipeId: nextRecipe } : {}),
    })
  }

  const frameStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    borderTop: '1px dotted var(--rule)',
    paddingTop: 'var(--space-4)',
  } as const

  return (
    <main className="app-shell">
      <header className="app-header">
        <nav className="app-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.id} className="app-nav-link" href={`#${link.id}`}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="hero" className="section hero" style={SCREEN_1}>
        <h1 className="hero-heading">{heroHeading}</h1>
        <p className="hero-fact">CHECKED · {spec.version}</p>
      </section>

      <section id="builder" className="section builder" style={SCREEN_2}>
        <p className="hero-body">{heroSupport}</p>
        <Field label="Source URL" htmlFor="source-url" description="Paste a video or playlist URL.">
          <input
            id="source-url"
            className="text-input"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://example.com/video"
            value={state.sourceUrl}
            onChange={(event) => update({ sourceUrl: event.target.value })}
          />
        </Field>
        <FormatLadder value={state.quality} onChange={onQualityChange} />
      </section>

      <section
        id="validation"
        className="section"
        style={SCREEN_1}
        aria-labelledby="validation-heading"
      >
        <div className="section-head">
          <h2 id="validation-heading" className="section-heading">
            Validation
          </h2>
        </div>
        {findings.length > 0 && (
          <div className="stack">
            {findings.map((finding, index) => (
              <Callout
                key={`${finding.code}-${index}`}
                tone={findingTone(finding.severity)}
                title={finding.code}
              >
                {warningText(finding.code)}
              </Callout>
            ))}
          </div>
        )}
      </section>

      <section
        id="outcomes"
        className="section outcomes"
        style={SCREEN_2}
        aria-labelledby="outcomes-heading"
      >
        <div className="app-frame" style={frameStyle}>
          <h2 id="outcomes-heading" className="section-heading">
            Outcome
          </h2>
          <OutcomeGrid onSelect={onOutcomeSelect} />
          {plan && (
            <CommandReceipt
              command={command}
              confidence={plan.confidence}
              version={spec.version}
              sentences={commandSentences(recipe?.name ?? 'Recipe', state.sourceUrl)}
            />
          )}
        </div>
        <CalibrationPanel onParsed={() => {}} />
        <AdvancedDrawer
          open={state.advancedOpen}
          onOpenChange={(open) => update({ advancedOpen: open })}
        />
        {state.rawArgs ? <p className="section-note">Raw args: {state.rawArgs}</p> : null}
      </section>

      <section id="handoff" className="section" style={SCREEN_1} aria-labelledby="handoff-heading">
        <div className="section-head">
          <h2 id="handoff-heading" className="section-heading">
            Handoff
          </h2>
        </div>
        <HandoffPanel />
      </section>

      <section id="coverage" className="section coverage" style={SCREEN_1}>
        <p className="coverage-note">{coverageNote.text}</p>
      </section>

      <footer className="app-footer">
        <p className="close-note">Spec {spec.version}. Generated command stays local.</p>
      </footer>
    </main>
  )
}
