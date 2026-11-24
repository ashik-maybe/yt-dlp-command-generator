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

interface Spec {
  version: string
  pinnedVersion: string
  provenance: { version: string }
  options: Array<{ flag: string }>
}

const specPath = new URL('../../src/spec/options.json', import.meta.url)
const recipesPath = new URL('../../src/data/recipes.json', import.meta.url)
const helpPath = new URL('../../.cache/yt-dlp-help.txt', import.meta.url)

const spec = JSON.parse(readFileSync(specPath, 'utf8')) as Spec
const recipes = JSON.parse(readFileSync(recipesPath, 'utf8')) as Recipe[]
const help = readFileSync(helpPath, 'utf8')

function recipeFlags(recipe: Recipe): string[] {
  return recipe.args
    .map((arg) => arg.flag)
    .filter((flag): flag is string => typeof flag === 'string')
}

describe('spec conformance', () => {
  it('spec provenance version equals 2026.11.23', () => {
    expect(spec.provenance.version).toBe('2026.11.23')
  })

  it('every bare flag in every recipe exists in cached help', () => {
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
})
