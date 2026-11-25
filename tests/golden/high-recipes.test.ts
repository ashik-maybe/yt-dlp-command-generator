import { describe, expect, it } from 'vitest'
import { render } from '../../src/core/render/index.ts'
import { recipes, toPlan } from '../../src/recipes/index.ts'
import type { Recipe, Shell } from '../../src/core/types.ts'

function commandFor(recipe: Recipe, shell: Shell): string {
  const plan = toPlan(recipe, {}, shell)
  return render({ program: plan.tool, args: plan.args, shell: plan.shell }, shell)
}

const _highRecipeIds = [
  'list-formats',
  'match-filters',
  'format-sort-small',
  'use-extractors',
  'parse-metadata',
  'split-chapters',
  'force-keyframes-at-cuts',
  'load-info-json',
  'impersonate',
  'concurrent-fragments',
  'throttled-rate',
  'sleep-jitter',
  'template-playlist',
  'template-chapter',
  'stdout-pipe',
  'exec-guarded',
] as const

describe('high-value recipe golden commands', () => {
  describe('list-formats', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'list-formats')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --list-formats"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'list-formats')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --list-formats"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'list-formats')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --list-formats"`)
    })
  })

  describe('match-filters', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'match-filters')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --match-filters '!is_live'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'match-filters')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --match-filters '!is_live'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'match-filters')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --match-filters "!is_live""`)
    })
  })

  describe('format-sort-small', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'format-sort-small')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format-sort '+size,+br,+res,+fps'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'format-sort-small')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format-sort '+size,+br,+res,+fps'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'format-sort-small')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format-sort "+size,+br,+res,+fps""`)
    })
  })

  describe('use-extractors', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'use-extractors')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --use-extractors 'youtube'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'use-extractors')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --use-extractors 'youtube'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'use-extractors')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --use-extractors "youtube""`)
    })
  })

  describe('parse-metadata', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'parse-metadata')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --parse-metadata '<FROM>:<TO>'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'parse-metadata')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --parse-metadata '<FROM>:<TO>'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'parse-metadata')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --parse-metadata "<FROM>:<TO>""`)
    })
  })

  describe('split-chapters', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'split-chapters')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --split-chapters --output 'chapter:<TEMPLATE>'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'split-chapters')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --split-chapters --output 'chapter:<TEMPLATE>'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'split-chapters')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --split-chapters --output "chapter:<TEMPLATE>""`)
    })
  })

  describe('force-keyframes-at-cuts', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'force-keyframes-at-cuts')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --force-keyframes-at-cuts --download-sections '*<START>-<END>'"`,
      )
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'force-keyframes-at-cuts')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --force-keyframes-at-cuts --download-sections '*<START>-<END>'"`,
      )
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'force-keyframes-at-cuts')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --force-keyframes-at-cuts --download-sections "*<START>-<END>""`,
      )
    })
  })

  describe('load-info-json', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'load-info-json')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --load-info-json '<FILE>'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'load-info-json')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --load-info-json '<FILE>'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'load-info-json')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --load-info-json "<FILE>""`)
    })
  })

  describe('impersonate', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'impersonate')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --impersonate 'chrome'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'impersonate')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --impersonate 'chrome'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'impersonate')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --impersonate "chrome""`)
    })
  })

  describe('concurrent-fragments', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'concurrent-fragments')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --concurrent-fragments '4'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'concurrent-fragments')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --concurrent-fragments '4'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'concurrent-fragments')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --concurrent-fragments "4""`)
    })
  })

  describe('throttled-rate', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'throttled-rate')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --throttled-rate '100K'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'throttled-rate')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --throttled-rate '100K'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'throttled-rate')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --throttled-rate "100K""`)
    })
  })

  describe('sleep-jitter', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'sleep-jitter')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sleep-interval '10' --max-sleep-interval '20'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'sleep-jitter')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sleep-interval '10' --max-sleep-interval '20'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'sleep-jitter')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sleep-interval "10" --max-sleep-interval "20""`)
    })
  })

  describe('template-playlist', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'template-playlist')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --output '%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s'"`,
      )
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'template-playlist')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --output '%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s'"`,
      )
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'template-playlist')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --output "%(playlist)s/%(playlist_index)s - %(title)s.%(ext)s""`,
      )
    })
  })

  describe('template-chapter', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'template-chapter')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --split-chapters --output 'chapter:%(section_number)02d - %(section_title)s.%(ext)s'"`,
      )
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'template-chapter')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --split-chapters --output 'chapter:%(section_number)02d - %(section_title)s.%(ext)s'"`,
      )
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'template-chapter')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --split-chapters --output "chapter:%(section_number)02d - %(section_title)s.%(ext)s""`,
      )
    })
  })

  describe('stdout-pipe', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'stdout-pipe')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --output '-'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'stdout-pipe')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --output '-'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'stdout-pipe')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --output "-""`)
    })
  })

  describe('exec-guarded', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'exec-guarded')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --exec 'after_move:echo %(filepath)q'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'exec-guarded')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --exec 'after_move:echo %(filepath)q'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'exec-guarded')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --exec "after_move:echo %(filepath)q""`)
    })
  })
})
