import type { Finding, Plan, ToolSpec } from '../types.ts'

export function validate(plan: Plan, spec: ToolSpec): Finding[] {
  void plan
  void spec
  throw new Error('NotImplemented: validate')
}
