// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AdvancedDrawer } from './AdvancedDrawer.tsx'

afterEach(cleanup)

describe('AdvancedDrawer', () => {
  it('renders raw-argument snippets', () => {
    render(<AdvancedDrawer open />)

    expect(screen.getByText('Raw arguments are not verified against the spec.')).toBeTruthy()
    expect(screen.getByText('Match filters (regex)')).toBeTruthy()
    expect(screen.getByText('--match-filters "!is_live"')).toBeTruthy()
    expect(screen.getByText('--format-sort "+size,+br,+res,+fps"')).toBeTruthy()
    expect(screen.getByText('--parse-metadata "<FROM>:<TO>"')).toBeTruthy()
    expect(screen.getByText('--extractor-args "<IE_KEY>:<ARGS>"')).toBeTruthy()
    expect(screen.getByText('--exec "<CMD>"')).toBeTruthy()
    expect(screen.getByText('--download-sections "*00:00-01:00"')).toBeTruthy()
    expect(screen.getByText('Exec runs a command. Review it before use.')).toBeTruthy()
  })
})
