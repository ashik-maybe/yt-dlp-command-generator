import type { Plan, Recipe } from './types.ts'

export function planFromRecipe(recipe: Recipe, values: Record<string, string>): Plan {
  void recipe
  void values
  throw new Error('NotImplemented: planFromRecipe')
}
