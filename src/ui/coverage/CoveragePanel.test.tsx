// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { OptionSpec } from '../../core/types.ts'
import { readmeFlags, spec } from '../../spec/index.ts'
import { CoveragePanel } from './CoveragePanel.tsx'

type SpecOption = OptionSpec & { readonly alias?: string }

afterEach(cleanup)

function rowText(label: string): string {
  const row = screen.getAllByRole('row').find((element) => element.textContent?.includes(label))
  return row?.textContent ?? ''
}

describe('CoveragePanel', () => {
  it('shows the spec and recipe counts', () => {
    render(<CoveragePanel />)
    const options = spec.options as readonly SpecOption[]
    const specFlags = new Set(options.map((option) => option.flag))
    const readmeOnly = readmeFlags.filter((flag) => !specFlags.has(flag.flag))
    expect(rowText('Help options')).toContain(String(options.length))
    expect(rowText('Aliases')).toContain(String(options.filter((option) => option.alias).length))
    expect(rowText('Deprecated options')).toContain(String(spec.deprecated.length))
    expect(rowText('README-only flags')).toContain(String(readmeOnly.length))
  })

  it('states that arguments are unverified', () => {
    render(<CoveragePanel />)
    expect(screen.getByText(/raw arguments are unverified/i)).toBeTruthy()
  })
})
