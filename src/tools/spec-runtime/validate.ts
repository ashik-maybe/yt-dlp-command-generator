import type { Recipe } from '../../core/types.ts'
import type { RuntimeFinding, RuntimeSpec } from './types.ts'

/** Build a set of known flag names including aliases. */
export function knownFlags(spec: RuntimeSpec): Set<string> {
  const known = new Set<string>()
  for (const opt of spec.options) {
    known.add(opt.flag)
    if (opt.alias) known.add(opt.alias)
  }
  for (const entry of spec.deprecated) {
    // Deprecated entries may be plain flags or "flag replacement..."
    const token = entry.trim().split(/\s+/)[0]?.replace(/^-+/, '')
    if (token) known.add(token)
  }
  return known
}

/** Validate a recipe against a runtime spec and report unknown flags. */
export function validateAgainstRuntime(spec: RuntimeSpec, recipe: Recipe): RuntimeFinding[] {
  const known = knownFlags(spec)
  const findings: RuntimeFinding[] = []

  for (const arg of recipe.args) {
    if (!arg.flag) continue
    if (known.has(arg.flag)) continue
    findings.push({
      severity: 'error',
      code: 'UNKNOWN_FLAG',
      message: `Unknown flag: --${arg.flag}`,
      location: `recipe:${recipe.id}`,
      fix: `Remove --${arg.flag} or use a flag supported by yt-dlp ${spec.version}.`,
    })
  }

  return findings
}
