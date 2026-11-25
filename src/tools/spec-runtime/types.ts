import type { Finding } from '../../core/types.ts'

/** One option parsed from yt-dlp --help output. */
export interface RuntimeOption {
  /** Flag name without leading dashes. */
  readonly flag: string
  /** Human-readable description. */
  readonly description: string
  /** Help section name. */
  readonly section: string
  /** True when the option takes no value. */
  readonly isBoolean: boolean
  /** Value placeholder, when present. */
  readonly metavar?: string
  /** Alias flag name without leading dashes, when present. */
  readonly alias?: string
}

/** Runtime spec compiled from local yt-dlp help output. */
export interface RuntimeSpec {
  /** Tool name. */
  readonly tool: 'yt-dlp'
  /** Parsed yt-dlp version string. */
  readonly version: string
  /** SHA-256 of the --help output. */
  readonly helpSha256: string
  /** Parsed options in help order. */
  readonly options: readonly RuntimeOption[]
  /** Deprecated flag names or entries. */
  readonly deprecated: readonly string[]
  /** Section names in help order. */
  readonly sections: readonly string[]
}

/** Result of binary detection. */
export type DetectResult =
  | { readonly ok: true; readonly path: string; readonly version: string }
  | { readonly ok: false; readonly error: 'NOT_FOUND'; readonly message: string }

/** Validation finding for runtime spec checks. */
export type RuntimeFinding = Finding
