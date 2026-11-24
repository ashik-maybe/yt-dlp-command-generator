import type { Plan, Recipe } from './types.ts'

/**
 * Build a plan by binding raw user values to a recipe.
 * The renderer quotes values later, for the selected shell.
 */
export function planFromRecipe(recipe: Recipe, values: Record<string, string>): Plan {
  const shell = (values.shell as Plan['shell']) ?? 'posix'
  const args = recipe.args.map((arg) => {
    if (arg.flag === null) return arg
    const value = values[arg.flag]
    if (value === undefined) return arg
    return { ...arg, value }
  })
  return { tool: 'yt-dlp', args, shell, confidence: recipe.confidence }
}
