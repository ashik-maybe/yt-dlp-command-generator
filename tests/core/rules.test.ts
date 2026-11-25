import { describe, expect, it } from 'vitest'
import { validate } from '../../src/core/validate/index.ts'
import type { Arg, Plan, ToolSpec } from '../../src/core/types.ts'

function planWith(args: Arg[]): Plan {
  return { tool: 'yt-dlp', args, shell: 'posix', confidence: 'verified' }
}

const spec: ToolSpec = {
  name: 'yt-dlp',
  version: '2026.11.23',
  options: [
    'cookies',
    'cookies-from-browser',
    'continue',
    'no-continue',
    'download-sections',
    'merge-output-format',
    'embed-subs',
    'write-subs',
  ].map((flag) => ({ flag })),
  deprecated: [],
}

function codes(args: Arg[]): string[] {
  return validate(planWith(args), spec).map((finding) => finding.code)
}

describe('validator rules', () => {
  it('allows cookies alone', () => {
    expect(codes([{ flag: 'cookies', value: 'cookies.txt' }])).not.toContain('CONFLICT')
  })

  it('rejects cookies with cookies-from-browser', () => {
    expect(
      codes([
        { flag: 'cookies', value: 'cookies.txt' },
        { flag: 'cookies-from-browser', value: 'chrome' },
      ]),
    ).toContain('CONFLICT')
  })

  it('allows continue alone', () => {
    expect(codes([{ flag: 'continue' }])).not.toContain('CONFLICT')
  })

  it('accepts a real download section value', () => {
    expect(codes([{ flag: 'download-sections', value: '*00:10:00-00:20:00' }])).not.toContain(
      'DOWNLOAD_SECTIONS_INVALID',
    )
  })

  it('rejects a download-sections value without a time range', () => {
    expect(codes([{ flag: 'download-sections', value: '*10:20' }])).toContain(
      'DOWNLOAD_SECTIONS_INVALID',
    )
  })

  it('does not require an unknown merge-output flag', () => {
    expect(codes([{ flag: 'merge-output-format', value: 'mp4' }])).not.toContain('MISSING_REQUIRED')
  })
})
