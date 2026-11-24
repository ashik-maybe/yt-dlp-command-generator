import type { Finding, Plan, Severity, ToolSpec } from '../types.ts'
import rules from '../../data/rules.json'

/** One data-driven validation rule. See src/data/rules.json. */
interface Rule {
  /** Finding code returned when the rule fires. */
  code: string
  /** Severity of the finding. */
  severity: Severity
  /** Human readable message. */
  message: string
  /** Suggested fix. */
  fix: string
  /** Finding fires when none of these flags is in the plan. */
  requireAny?: string[]
  /** Finding fires when any of these flags is in the plan. */
  forbidAny?: string[]
  /** Rule only applies when any of these flags is in the plan. */
  appliesWhen?: string[]
  /** Rule only applies when a plan value contains one of these substrings. */
  urls?: string[]
  /** Finding fires when a value of one of these flags lacks valueMustContain. */
  valueFlags?: string[]
  /** Substrings that must appear in the plan value. */
  valueMustContain?: string[]
  /** Finding fires when both of these flags are in the plan. */
  conflictPair?: [string, string]
  /** Finding fires when a value of this flag does not match the regex. */
  valueMatches?: { flag: string; pattern: string }
}

function planFlags(plan: Plan): string[] {
  return plan.args.flatMap((arg) => (arg.flag === null ? [] : [arg.flag]))
}

function planValues(plan: Plan): string[] {
  const values: string[] = []
  for (const arg of plan.args) {
    if (arg.value !== undefined) values.push(arg.value)
    for (const value of arg.values ?? []) values.push(value)
  }
  return values
}

export function validate(plan: Plan, spec: ToolSpec): Finding[] {
  const flags = planFlags(plan)
  const hasFlag = (name: string): boolean => flags.includes(name)
  const findings: Finding[] = []

  for (const arg of plan.args) {
    if (arg.flag !== null && !spec.options.some((option) => option.flag === arg.flag)) {
      findings.push({
        severity: 'error',
        code: 'UNKNOWN_FLAG',
        message: `Flag --${arg.flag} is not in the spec`,
      })
    }
  }

  for (const rule of rules as Rule[]) {
    const appliesWhen = rule.appliesWhen
    if (appliesWhen && !appliesWhen.some(hasFlag)) continue

    const urls = rule.urls
    if (urls) {
      const matched = planValues(plan).some((value) =>
        urls.some((needle) => value.toLowerCase().includes(needle.toLowerCase())),
      )
      if (!matched) continue
    }

    const requires = rule.requireAny
    if (requires && !requires.some(hasFlag)) {
      findings.push({
        severity: rule.severity,
        code: rule.code,
        message: rule.message,
        fix: rule.fix,
      })
    }

    const forbids = rule.forbidAny
    if (forbids && forbids.some(hasFlag)) {
      findings.push({
        severity: rule.severity,
        code: rule.code,
        message: rule.message,
        fix: rule.fix,
      })
    }

    const pair = rule.conflictPair
    if (pair && pair.every(hasFlag)) {
      findings.push({
        severity: rule.severity,
        code: rule.code,
        message: rule.message,
        fix: rule.fix,
      })
    }

    const valueMatch = rule.valueMatches
    if (valueMatch) {
      const regex = new RegExp(valueMatch.pattern)
      const bad = plan.args.some((arg) => {
        if (arg.flag !== valueMatch.flag) return false
        const values = [arg.value, ...(arg.values ?? [])].filter(
          (value): value is string => value !== undefined,
        )
        return values.some((value) => !regex.test(value))
      })
      if (bad) {
        findings.push({
          severity: rule.severity,
          code: rule.code,
          message: rule.message,
          fix: rule.fix,
        })
      }
    }

    const valueFlags = rule.valueFlags
    const valueMustContain = rule.valueMustContain
    if (valueFlags && valueMustContain) {
      const bad = plan.args.some((arg) => {
        if (arg.flag === null || !valueFlags.includes(arg.flag)) return false
        const values = [arg.value, ...(arg.values ?? [])].filter(
          (value): value is string => value !== undefined,
        )
        return !values.some((value) =>
          valueMustContain.some((must) => value.toLowerCase().includes(must.toLowerCase())),
        )
      })
      if (bad) {
        findings.push({
          severity: rule.severity,
          code: rule.code,
          message: rule.message,
          fix: rule.fix,
        })
      }
    }
  }

  return findings
}
