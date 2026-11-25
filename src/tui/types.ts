/**
 * Pure types for the TUI foundation.
 *
 * This file has no runtime code. It has no DOM types.
 */

/** The shell a command is rendered for in the TUI. */
export type ShellType = 'posix'

/** Parsed TUI arguments. */
export interface TuiArgs {
  /** True when --version is present. */
  version: boolean
  /** True when --help is present. */
  help: boolean
  /** True when --run is present. */
  run: boolean
  /** True when --yes is present. */
  yes: boolean
}

/** A plan shown on one TUI screen. */
export interface PlanView {
  /** Command text shown to the user. */
  command: string
  /** True when the plan is ready to run. */
  ready: boolean
}

/** Result of one TUI run. */
export interface RunResult {
  /** Exit code of the run. */
  code: number
  /** Text printed by the run. */
  output: string
}
