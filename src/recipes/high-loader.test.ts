import { describe, expect, it } from 'vitest'
import { recipes } from './index.ts'
import recipesBase from '../data/recipes.json'
import recipesExtra from '../data/recipes-extra.json'
import recipesAdvanced from '../data/recipes-advanced.json'
import recipesHighA from '../data/recipes-high-a.json'
import recipesHighB from '../data/recipes-high-b.json'
import recipesHighC from '../data/recipes-high-c.json'
import recipesHighD from '../data/recipes-high-d.json'

const sets = [
  recipesBase,
  recipesExtra,
  recipesAdvanced,
  recipesHighA,
  recipesHighB,
  recipesHighC,
  recipesHighD,
]

describe('high recipe loader', () => {
  it('merges all recipe sets with deduplication by id', () => {
    const seen = new Set<string>()
    let expected = 0
    for (const set of sets) {
      for (const recipe of set) {
        if (seen.has(recipe.id)) continue
        seen.add(recipe.id)
        expected += 1
      }
    }
    expect(recipes.length).toBe(expected)
  })

  it('has no duplicate ids', () => {
    const ids = recipes.map((recipe) => recipe.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
