import { describe, expect, it } from 'vitest'
import { recipes, toPlan } from './index.ts'
import type { Recipe } from '../core/types.ts'
import recipesBase from '../data/recipes.json'
import recipesExtra from '../data/recipes-extra.json'
import recipesAdvanced from '../data/recipes-advanced.json'

const sets = [recipesBase, recipesExtra, recipesAdvanced]

describe('recipes loader', () => {
  it('exposes every recipe id from all three sets', () => {
    const ids = recipes.map((r) => r.id)
    for (const set of sets) {
      for (const recipe of set) {
        expect(ids).toContain(recipe.id)
      }
    }
  })

  it('has no duplicate ids', () => {
    const ids = recipes.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('toPlan keeps user values on matching flags', () => {
    const recipe = recipesBase[0] as Recipe
    const plan = toPlan(recipe, { format: 'vcodec=h264' }, 'posix')
    expect(plan.tool).toBe('yt-dlp')
    expect(plan.shell).toBe('posix')
    expect(plan.confidence).toBe(recipe.confidence)
    expect(plan.args[0]).toMatchObject({ flag: 'format', value: 'vcodec=h264' })
  })
})
