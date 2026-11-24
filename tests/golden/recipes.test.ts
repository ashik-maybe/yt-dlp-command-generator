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
