import { quote } from './render/quote.ts'
import type { Plan, Recipe } from './types.ts'

/** Build a plan by binding user values to a recipe. */
export function planFromRecipe(recipe: Recipe, values: Record<string, string>): Plan {
  const shell = (values.shell as Plan['shell']) ?? 'posix'
  const args = recipe.args.map((arg) => {
    if (arg.flag === null) return arg
    const value = values[arg.flag]
    if (value === undefined) return arg
    return { ...arg, value: quote(value, shell) }
  })
  return { tool: 'yt-dlp', args, shell, confidence: recipe.confidence }
}
