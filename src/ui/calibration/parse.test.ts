import { describe, expect, it } from 'vitest'
import { parseToolOutput } from './parse.ts'

const FORMAT_LIST = [
  '[info] Available formats for TEST_ID:',
  'ID  EXT   RESOLUTION | FPS | VBR (KiB/s) | TBR (KiB/s) |',
  '140 m4a   audio only | --- |  130        |  130        |',
  '137 mp4   1920x1080  |  30 |  900        |  900        |',
  '18  mp4   640x360    |  30 |  200        |  200        |',
].join('\n')

describe('parseToolOutput', () => {
  it('parses format rows from an -F table', () => {
    const result = parseToolOutput(FORMAT_LIST)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.version).toBeNull()
    expect(result.rows).toHaveLength(3)
    expect(result.rows[0]).toEqual({
      formatId: '140',
      ext: 'm4a',
      resolution: 'audio only',
      protocol: null,
    })
    expect(result.rows[1]).toEqual({
      formatId: '137',
      ext: 'mp4',
      resolution: '1920x1080',
      protocol: null,
    })
    expect(result.rows[2]).toEqual({
      formatId: '18',
      ext: 'mp4',
      resolution: '640x360',
      protocol: null,
    })
  })

  it('parses a --version line', () => {
    const result = parseToolOutput('yt-dlp 2026.01.02')
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.version).toBe('2026.01.02')
    expect(result.rows).toEqual([])
  })

  it('returns an error for unrelated text', () => {
    expect(parseToolOutput('hello there').ok).toBe(false)
  })
})
