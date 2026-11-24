import type { ToolSpec } from '../core/types'
import optionsSpec from './options.json'

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
