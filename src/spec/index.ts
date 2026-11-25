import type { ToolSpec } from '../core/types'
import optionsSpec from './options.json'
import readmeFlagsJson from './readme-flags.json'

/** A flag listed in the README, as typed data. */
export interface ReadmeFlag {
  /** The flag name as written, without leading dashes. */
  readonly flag: string
  /** The flag description from the README. */
  readonly description: string
  /** Where the README documents the flag. */
  readonly source: string
  /** Whether the flag appears in the README list. */
  readonly documentedOnly: boolean
}

export const readmeFlags = readmeFlagsJson.flags as unknown as ReadmeFlag[]

export interface SpecProvenance {
  readonly version: string
  readonly sourceUrl: string
  readonly generatedDate: string
  readonly helpSha256: string
}

export interface Spec extends ToolSpec {
  readonly tool: string
  readonly provenance: SpecProvenance
}

export const spec = optionsSpec as unknown as Spec
export const provenance = spec.provenance
