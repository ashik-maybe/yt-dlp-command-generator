import type { Arg, Finding, Recipe } from '../core/types.ts'

const PLACEHOLDER_RE = /<[^>]+>/g

/**
 * Replace angle placeholders in recipe args and append a source URL.
 *
 * Returns bound args and findings for unbound placeholders.
 */
export function bindRecipeValues(
  recipe: Recipe,
  values: Record<string, string>,
): { args: Arg[]; findings: Finding[] } {
  const findings: Finding[] = []
  const seen = new Set<string>()

  function bindString(input: string): string {
    return input.replace(PLACEHOLDER_RE, (token) => {
      const key = token.slice(1, -1)
      const replacement = values[key]
      if (replacement !== undefined) return replacement
      if (!seen.has(token)) {
        seen.add(token)
        findings.push({
          severity: 'error',
          code: 'UNBOUND_PLACEHOLDER',
          message: `Unbound placeholder: ${token}`,
        })
      }
      return token
    })
  }

  const args: Arg[] = recipe.args.map((arg) => {
    let next = arg

    if (arg.value !== undefined) {
      const value = bindString(arg.value)
      if (value !== arg.value) next = { ...next, value }
    }

    if (arg.values !== undefined) {
      const boundValues = arg.values.map(bindString)
      if (boundValues.some((value, index) => value !== arg.values![index])) {
        next = { ...next, values: boundValues }
      }
    }

    return next
  })

  const sourceUrl = values.sourceUrl
  if (sourceUrl !== undefined && sourceUrl !== '') {
    const hasSource = args.some((arg) => arg.flag === null && arg.value === sourceUrl)
    if (!hasSource) args.push({ flag: null, value: sourceUrl })
  }

  return { args, findings }
}
