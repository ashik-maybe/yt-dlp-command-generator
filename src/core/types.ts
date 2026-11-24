/**
 * Pure types for the yt-dlp command generator IR.
 *
 * This file is pure. It has no runtime code. It is frozen after P1.
 */

/** The shell a command is rendered for. */
export type Shell = 'posix' | 'powershell' | 'cmd'

/** Severity of a finding. */
export type Severity = 'error' | 'warning' | 'info' | 'debug'

/** Confidence of a plan path. */
export type Confidence = 'verified' | 'validated' | 'unverified'

/** One argument of a Command or a Plan. */
export interface Arg {
  /** Flag name without leading dashes. Null for an operand. */
  flag: string | null
  /** Value bound to the flag or operand. */
  value?: string
  /** Alias the recipe selects, when the spec offers one. */
  alias?: string
  /** Doc anchor of the flag, from the spec. */
  anchor?: string
  /** Repeated values for repeatable flags. */
  values?: string[]
}

/** A rendered command. */
export interface Command {
  /** Executable name, for example yt-dlp. */
  program: string
  /** Ordered arguments of the command. */
  args: Arg[]
  /** Shell the command renders for. */
  shell: Shell
}

/** A recipe plus the user values. */
export interface Plan {
  /** Tool name, for example yt-dlp. */
  tool: string
  /** Ordered arguments of the plan. */
  args: Arg[]
  /** Shell the plan targets. */
  shell: Shell
  /** Confidence of the plan path. */
  confidence: Confidence
}

/** A review item. */
export interface Finding {
  /** Severity of the finding. */
  severity: Severity
  /** Stable finding code. See CONTRACT.md. */
  code: string
  /** Human readable message. */
  message: string
  /** File or spec location the finding refers to. */
  location?: string
  /** Suggested fix. */
  fix?: string
}

/** A typed scenario. Maps one user goal to IR arguments. */
export interface Recipe {
  /** Stable recipe id. */
  id: string
  /** User facing name of the recipe. */
  name: string
  /** Ordered arguments of the recipe. */
  args: Arg[]
  /** Confidence of the recipe path. */
  confidence: Confidence
}

/** One option of a tool version. */
export interface OptionSpec {
  /** Flag name without leading dashes. */
  flag: string
  /** Metavar, when the option takes a value. */
  metavar?: string
  /** Accepted values, when the option is a choice. */
  choices?: string[]
  /** Default value, when the spec defines one. */
  default?: string
  /** Doc anchor, when the spec has one. */
  anchor?: string
  /** True when the option is a boolean. */
  isBoolean?: boolean
}

/** The pinned spec of one tool version. */
export interface ToolSpec {
  /** Tool name as in the spec. */
  name: string
  /** Version of the tool the spec was built from. */
  version: string
  /** Pinned version the spec was checked against. */
  pinnedVersion: string
  /** Every documented option of the tool. */
  options: OptionSpec[]
  /** Deprecated flags documented in the spec. */
  deprecated: string[]
  /** Cached help file the spec was built from, when known. */
  helpFile?: string
}

/** One screen of the app. */
export interface Route {
  /** Active screen of the app. */
  screen: 'home' | 'recipes' | 'generate'
  /** Recipe id on the generate screen, when set. */
  recipeId?: string
}
