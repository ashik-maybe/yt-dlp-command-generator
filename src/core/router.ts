import type { Shell } from './types.ts'
import { recipes } from '../recipes/index.ts'

/** App state kept in the URL query string. */
export interface ShareState {
  recipeId: string
  sourceUrl: string
  quality: string
  shell: Shell
  rawArgs: string
  advancedOpen: boolean
}

const SHELLS: Shell[] = ['posix', 'powershell', 'cmd']

function isShell(value: string | null): value is Shell {
  return value !== null && SHELLS.includes(value as Shell)
}

export const DEFAULT_STATE: ShareState = {
  recipeId: recipes[0]?.id ?? 'best-video',
  sourceUrl: '',
  quality: '1080p',
  shell: 'posix',
  rawArgs: '',
  advancedOpen: false,
}

/** Prefix that marks the URL as carrying app state. */
export const STATE_PREFIX = '?'

/** Read shareable app state from a URL query string. */
export function parseHash(search: string): ShareState {
  const params = new URLSearchParams(search.replace(/^\?/, ''))
  const shellValue = params.get('shell')
  return {
    recipeId: params.get('recipeId') ?? DEFAULT_STATE.recipeId,
    sourceUrl: params.get('sourceUrl') ?? DEFAULT_STATE.sourceUrl,
    quality: params.get('quality') ?? DEFAULT_STATE.quality,
    shell: isShell(shellValue) ? shellValue : DEFAULT_STATE.shell,
    rawArgs: params.get('rawArgs') ?? DEFAULT_STATE.rawArgs,
    advancedOpen: params.get('advancedOpen') === '1',
  }
}

/** Write shareable app state to a URL query string. */
export function buildHash(state: ShareState): string {
  const params = new URLSearchParams()
  params.set('recipeId', state.recipeId)
  if (state.sourceUrl) params.set('sourceUrl', state.sourceUrl)
  if (state.quality) params.set('quality', state.quality)
  params.set('shell', state.shell)
  if (state.rawArgs) params.set('rawArgs', state.rawArgs)
  if (state.advancedOpen) params.set('advancedOpen', '1')
  return `${STATE_PREFIX}${params.toString()}`
}
