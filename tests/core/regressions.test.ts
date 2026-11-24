import { describe, expect, it } from 'vitest'
import { planFromRecipe } from '../../src/core/plan.ts'
import { quote } from '../../src/core/render/quote.ts'
import { render } from '../../src/core/render/index.ts'
import type { Recipe } from '../../src/core/types.ts'

const recipe: Recipe = {
  id: 'probe',
  name: 'Probe',
  confidence: 'verified',
  args: [
    { flag: 'format', value: 'bv[height<=1080]+ba/b' },
    { flag: 'output', value: 'my clip.mp4' },
  ],
}

describe('command regressions', () => {
  it('writes long flags with two dashes', () => {
    const plan = planFromRecipe(recipe, {})
    const command = render({ program: 'yt-dlp', args: plan.args, shell: 'posix' }, 'posix')
    expect(command).toContain('--format')
    expect(command).toContain('--output')
    expect(command).not.toMatch(/(?:^|\s)format(?:\s|$)/)
  })

  it('quotes each user value once', () => {
    const plan = planFromRecipe(recipe, { output: 'my clip.mp4' })
    const command = render({ program: 'yt-dlp', args: plan.args, shell: 'posix' }, 'posix')
    expect(command).toContain("'my clip.mp4'")
    expect(command).not.toContain("''my")
  })

  it('escapes cmd quotes without adding carets inside double quotes', () => {
    expect(quote('a"b', 'cmd')).toBe('"a""b"')
    expect(quote('a^b', 'cmd')).toBe('"a^b"')
    expect(quote('a&b', 'cmd')).toBe('"a&b"')
  })

  it('refuses newlines in cmd values', () => {
    expect(() => quote('a\nb', 'cmd')).toThrow(/newline/i)
  })
})
