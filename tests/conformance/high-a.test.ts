// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

interface RecipeArg {
  flag?: string | null
  value?: string
  values?: string[]
}

interface Recipe {
  id: string
  args: RecipeArg[]
}

const recipesPath = new URL('../../src/data/recipes-high-a.json', import.meta.url)
const helpPath = new URL('../../.cache/yt-dlp-help.txt', import.meta.url)

const recipes = JSON.parse(readFileSync(recipesPath, 'utf8')) as Recipe[]
const help = readFileSync(helpPath, 'utf8')

function recipeFlags(recipe: Recipe): string[] {
  return recipe.args
    .map((arg) => arg.flag)
    .filter((flag): flag is string => typeof flag === 'string')
}

describe('high-a recipes conformance', () => {
  it('every recipe flag exists in cached help', () => {
    const missing: string[] = []
    for (const recipe of recipes) {
      for (const flag of recipeFlags(recipe)) {
        const token = `--${flag}`
        if (!help.includes(token)) {
          missing.push(`${recipe.id}:${token}`)
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('recipe ids are unique', () => {
    const ids = recipes.map((recipe) => recipe.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
