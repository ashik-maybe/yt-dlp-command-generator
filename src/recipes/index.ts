import type { Plan, Recipe, Shell } from '../core/types.ts'
import recipesBase from '../data/recipes.json'
import recipesExtra from '../data/recipes-extra.json'
import recipesAdvanced from '../data/recipes-advanced.json'

/** Tool name every recipe builds a plan for. */
const TOOL = 'yt-dlp'

/**
 * Substitute user values into a recipe and return the plan.
 *
 * An arg whose flag has a value in `values` gets that value quoted for
 * `shell`; args without a user value pass through unchanged.
 */
export function toPlan(recipe: Recipe, values: Record<string, string>, shell: Shell): Plan {
  const args = recipe.args.map((arg) => {
    if (arg.flag === null) return arg
    const value = values[arg.flag]
    if (value === undefined) return arg
    return { ...arg, value }
  })
  return { tool: TOOL, args, shell, confidence: recipe.confidence }
}

/** Merged recipe list from all sets, deduplicated by id; first entry wins. */
const seen = new Set<string>()
const recipes = [recipesBase, recipesExtra, recipesAdvanced].flat().filter((recipe) => {
  if (seen.has(recipe.id)) return false
  seen.add(recipe.id)
  return true
})

export { recipes }
