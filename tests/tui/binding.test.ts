import { describe, expect, it } from 'vitest'
import type { Recipe } from '../../src/core/types.ts'
import { bindRecipeValues } from '../../src/tui/binding.ts'

function recipe(args: Recipe['args']): Recipe {
  return { id: 'test', name: 'Test', args, confidence: 'verified' }
}

describe('bindRecipeValues', () => {
  it('replaces every placeholder from values', () => {
    const result = bindRecipeValues(
      recipe([
        { flag: 'load-info-json', value: '<FILE>' },
        { flag: 'download-sections', value: '*<START>-<END>' },
      ]),
      { FILE: 'info.json', START: '0', END: '10' },
    )

    expect(result.findings).toEqual([])
    expect(result.args).toEqual([
      { flag: 'load-info-json', value: 'info.json' },
      { flag: 'download-sections', value: '*0-10' },
    ])
  })

  it('returns UNBOUND_PLACEHOLDER for an unbound placeholder', () => {
    const result = bindRecipeValues(recipe([{ flag: 'output', value: '<TEMPLATE>' }]), {})

    expect(result.args).toEqual([{ flag: 'output', value: '<TEMPLATE>' }])
    expect(result.findings).toEqual([
      {
        severity: 'error',
        code: 'UNBOUND_PLACEHOLDER',
        message: 'Unbound placeholder: <TEMPLATE>',
      },
    ])
  })

  it('appends sourceUrl as an operand when provided', () => {
    const result = bindRecipeValues(recipe([{ flag: 'format', value: 'best' }]), {
      sourceUrl: 'https://example.com/video',
    })

    expect(result.findings).toEqual([])
    expect(result.args).toEqual([
      { flag: 'format', value: 'best' },
      { flag: null, value: 'https://example.com/video' },
    ])
  })

  it('does not double-append sourceUrl', () => {
    const result = bindRecipeValues(
      recipe([
        { flag: 'format', value: 'best' },
        { flag: null, value: 'https://example.com/video' },
      ]),
      { sourceUrl: 'https://example.com/video' },
    )

    expect(result.findings).toEqual([])
    expect(result.args).toEqual([
      { flag: 'format', value: 'best' },
      { flag: null, value: 'https://example.com/video' },
    ])
  })
})
