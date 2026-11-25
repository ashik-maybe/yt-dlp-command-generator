// @vitest-environment node
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
    'exec',
    'yes',
    'load-info-json',
    'download-sections',
    'force-keyframes-at-cuts',
    'match-filters',
    'concurrent-fragments',
  ].map((flag) => ({ flag })),
  deprecated: [],
}

function findings(args: Arg[]) {
  return validate(planWith(args), spec)
}

function codes(args: Arg[]): string[] {
  return findings(args).map((finding) => finding.code)
}

describe('high-value validation rules', () => {
  it('warns when exec is used without yes', () => {
    const result = findings([{ flag: 'exec', value: 'echo done' }])
    expect(result).toContainEqual(
      expect.objectContaining({ severity: 'warning', code: 'EXEC_WITHOUT_YES' }),
    )
  })

  it('does not warn when exec is used with yes', () => {
    expect(codes([{ flag: 'exec', value: 'echo done' }, { flag: 'yes' }])).not.toContain(
      'EXEC_WITHOUT_YES',
    )
  })

  it('warns when load-info-json is used with a URL', () => {
    const result = findings([
      { flag: 'load-info-json', value: 'info.json' },
      { flag: null, value: 'https://example.com/video' },
    ])
    expect(result).toContainEqual(
      expect.objectContaining({ severity: 'warning', code: 'LOAD_INFO_JSON_WITH_URL' }),
    )
  })

  it('does not warn when load-info-json is used without a URL', () => {
    expect(codes([{ flag: 'load-info-json', value: 'info.json' }])).not.toContain(
      'LOAD_INFO_JSON_WITH_URL',
    )
  })

  it('gives info when download-sections is used without force-keyframes-at-cuts', () => {
    const result = findings([{ flag: 'download-sections', value: '*00:10:00-00:20:00' }])
    expect(result).toContainEqual(
      expect.objectContaining({
        severity: 'info',
        code: 'DOWNLOAD_SECTIONS_WITHOUT_FORCE_KEYFRAMES',
      }),
    )
  })

  it('does not give info when download-sections is used with force-keyframes-at-cuts', () => {
    expect(
      codes([
        { flag: 'download-sections', value: '*00:10:00-00:20:00' },
        { flag: 'force-keyframes-at-cuts' },
      ]),
    ).not.toContain('DOWNLOAD_SECTIONS_WITHOUT_FORCE_KEYFRAMES')
  })

  it('errors when match-filters has a bad operator', () => {
    const result = findings([{ flag: 'match-filters', value: 'duration === 10' }])
    expect(result).toContainEqual(
      expect.objectContaining({ severity: 'error', code: 'MATCH_FILTER_BAD_OPERATOR' }),
    )
  })

  it('allows a valid match-filters operator', () => {
    expect(codes([{ flag: 'match-filters', value: 'duration > 600' }])).not.toContain(
      'MATCH_FILTER_BAD_OPERATOR',
    )
  })

  it('warns when concurrent-fragments is above 16', () => {
    const result = findings([{ flag: 'concurrent-fragments', value: '17' }])
    expect(result).toContainEqual(
      expect.objectContaining({ severity: 'warning', code: 'CONCURRENT_FRAGMENTS_HIGH' }),
    )
  })

  it('does not warn when concurrent-fragments is 16 or below', () => {
    expect(codes([{ flag: 'concurrent-fragments', value: '16' }])).not.toContain(
      'CONCURRENT_FRAGMENTS_HIGH',
    )
  })
})
