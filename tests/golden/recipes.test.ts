import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { render } from '../../src/core/render/index.ts'
import { recipes, toPlan } from '../../src/recipes/index.ts'
import type { Recipe, Shell } from '../../src/core/types.ts'

function commandFor(recipe: Recipe, shell: Shell): string {
  const plan = toPlan(recipe, {}, shell)
  return render({ program: plan.tool, args: plan.args, shell: plan.shell }, shell)
}

describe('recipe golden commands', () => {
  describe('best-video', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'best-video')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format 'bestvideo+bestaudio/best'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'best-video')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format 'bestvideo+bestaudio/best'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'best-video')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format "bestvideo+bestaudio/best""`)
    })
  })
  describe('format-1080p', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'format-1080p')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format 'bv[height<=1080]+ba/best'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'format-1080p')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format 'bv[height<=1080]+ba/best'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'format-1080p')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format "bv[height<=1080]+ba/best""`)
    })
  })
  describe('format-4k', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'format-4k')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format 'bv[height<=2160]+ba/best'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'format-4k')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format 'bv[height<=2160]+ba/best'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'format-4k')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format "bv[height<=2160]+ba/best""`)
    })
  })
  describe('audio-mp3', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'audio-mp3')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extract-audio --audio-format 'mp3'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'audio-mp3')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extract-audio --audio-format 'mp3'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'audio-mp3')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extract-audio --audio-format "mp3""`)
    })
  })
  describe('audio-flac', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'audio-flac')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extract-audio --audio-format 'flac'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'audio-flac')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extract-audio --audio-format 'flac'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'audio-flac')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extract-audio --audio-format "flac""`)
    })
  })
  describe('playlist-range', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'playlist-range')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --playlist-items '1:10'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'playlist-range')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --playlist-items '1:10'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'playlist-range')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --playlist-items "1:10""`)
    })
  })
  describe('clip-by-section', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'clip-by-section')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-sections '*10:20'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'clip-by-section')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-sections '*10:20'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'clip-by-section')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-sections "*10:20""`)
    })
  })
  describe('embed-subs', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'embed-subs')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --write-subs --write-auto-subs --sub-langs 'all' --embed-subs"`,
      )
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'embed-subs')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --write-subs --write-auto-subs --sub-langs 'all' --embed-subs"`,
      )
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'embed-subs')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --write-subs --write-auto-subs --sub-langs "all" --embed-subs"`,
      )
    })
  })
  describe('thumbnail', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'thumbnail')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-thumbnail"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'thumbnail')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-thumbnail"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'thumbnail')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-thumbnail"`)
    })
  })
  describe('metadata-chapters', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'metadata-chapters')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-metadata --embed-chapters"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'metadata-chapters')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-metadata --embed-chapters"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'metadata-chapters')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-metadata --embed-chapters"`)
    })
  })
  describe('sponsorblock', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'sponsorblock')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sponsorblock-remove 'sponsor'"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'sponsorblock')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sponsorblock-remove 'sponsor'"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'sponsorblock')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sponsorblock-remove "sponsor""`)
    })
  })
  describe('archive-resume', () => {
    it('posix', () => {
      const recipe = recipes.find((r) => r.id === 'archive-resume')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-archive 'archive.txt' --continue"`)
    })
    it('powershell', () => {
      const recipe = recipes.find((r) => r.id === 'archive-resume')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-archive 'archive.txt' --continue"`)
    })
    it('cmd', () => {
      const recipe = recipes.find((r) => r.id === 'archive-resume')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-archive "archive.txt" --continue"`)
    })
  })
})

const extraRecipes = JSON.parse(
  readFileSync(new URL('../../src/data/recipes-extra.json', import.meta.url), 'utf8'),
) as Recipe[]
const advancedRecipes = JSON.parse(
  readFileSync(new URL('../../src/data/recipes-advanced.json', import.meta.url), 'utf8'),
) as Recipe[]

describe('recipes-extra set', () => {
  describe('cookies', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'cookies')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --cookies '<path>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'cookies')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --cookies '<path>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'cookies')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --cookies "<path>""`)
    })
  })
  describe('cookies-browser', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'cookies-browser')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --cookies-from-browser '<browser>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'cookies-browser')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --cookies-from-browser '<browser>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'cookies-browser')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --cookies-from-browser "<browser>""`)
    })
  })
  describe('batch-file', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'batch-file')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --batch-file '<path>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'batch-file')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --batch-file '<path>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'batch-file')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --batch-file "<path>""`)
    })
  })
  describe('limit-rate', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'limit-rate')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --limit-rate '<rate>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'limit-rate')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --limit-rate '<rate>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'limit-rate')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --limit-rate "<rate>""`)
    })
  })
  describe('retries', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'retries')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --retries '<n>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'retries')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --retries '<n>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'retries')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --retries "<n>""`)
    })
  })
  describe('output-template', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'output-template')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --output '<template>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'output-template')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --output '<template>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'output-template')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --output "<template>""`)
    })
  })
  describe('print-json', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'print-json')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --dump-json"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'print-json')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --dump-json"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'print-json')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --dump-json"`)
    })
  })
  describe('exec', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'exec')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --exec '<cmd>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'exec')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --exec '<cmd>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'exec')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --exec "<cmd>""`)
    })
  })
  describe('js-runtimes', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'js-runtimes')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --js-runtimes '<runtime>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'js-runtimes')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --js-runtimes '<runtime>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'js-runtimes')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --js-runtimes "<runtime>""`)
    })
  })
  describe('extractor-args', () => {
    it('posix', () => {
      const recipe = extraRecipes.find((r) => r.id === 'extractor-args')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extractor-args '<ie_key>:<args>'"`)
    })
    it('powershell', () => {
      const recipe = extraRecipes.find((r) => r.id === 'extractor-args')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extractor-args '<ie_key>:<args>'"`)
    })
    it('cmd', () => {
      const recipe = extraRecipes.find((r) => r.id === 'extractor-args')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --extractor-args "<ie_key>:<args>""`)
    })
  })
})

describe('recipes-advanced set', () => {
  describe('chapters', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'chapters')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-chapters"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'chapters')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-chapters"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'chapters')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-chapters"`)
    })
  })
  describe('thumbnails-embed', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'thumbnails-embed')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-thumbnail"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'thumbnails-embed')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-thumbnail"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'thumbnails-embed')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --embed-thumbnail"`)
    })
  })
  describe('subtitles-only', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'subtitles-only')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --skip-download --write-subs"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'subtitles-only')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --skip-download --write-subs"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'subtitles-only')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --skip-download --write-subs"`)
    })
  })
  describe('playlist-reverse', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'playlist-reverse')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --playlist-reverse"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'playlist-reverse')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --playlist-reverse"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'playlist-reverse')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --playlist-reverse"`)
    })
  })
  describe('archive-skip', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'archive-skip')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-archive 'archive.txt'"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'archive-skip')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-archive 'archive.txt'"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'archive-skip')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --download-archive "archive.txt""`)
    })
  })
  describe('format-sort', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'format-sort')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format-sort 'res,fps'"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'format-sort')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format-sort 'res,fps'"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'format-sort')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --format-sort "res,fps""`)
    })
  })
  describe('sponsorblock-all', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'sponsorblock-all')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --sponsorblock-remove 'sponsor,intro,outro,selfpromo,preview,filler,interaction,music_offtopic,hook'"`,
      )
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'sponsorblock-all')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --sponsorblock-remove 'sponsor,intro,outro,selfpromo,preview,filler,interaction,music_offtopic,hook'"`,
      )
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'sponsorblock-all')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(
        `"yt-dlp --sponsorblock-remove "sponsor,intro,outro,selfpromo,preview,filler,interaction,music_offtopic,hook""`,
      )
    })
  })
  describe('metadata-only', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'metadata-only')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --write-info-json --skip-download"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'metadata-only')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --write-info-json --skip-download"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'metadata-only')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --write-info-json --skip-download"`)
    })
  })
  describe('geo-bypass', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'geo-bypass')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --xff 'default'"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'geo-bypass')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --xff 'default'"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'geo-bypass')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --xff "default""`)
    })
  })
  describe('sleep', () => {
    it('posix', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'sleep')!
      const cmd = commandFor(recipe, 'posix')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sleep-requests '2'"`)
    })
    it('powershell', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'sleep')!
      const cmd = commandFor(recipe, 'powershell')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sleep-requests '2'"`)
    })
    it('cmd', () => {
      const recipe = advancedRecipes.find((r) => r.id === 'sleep')!
      const cmd = commandFor(recipe, 'cmd')
      expect(cmd.length).toBeGreaterThan(0)
      expect(cmd.startsWith('yt-dlp')).toBe(true)
      expect(cmd).not.toContain('undefined')
      expect(cmd).toMatchInlineSnapshot(`"yt-dlp --sleep-requests "2""`)
    })
  })
})
