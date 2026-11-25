import { describe, expect, it, vi } from 'vitest'
import { render } from 'ink-testing-library'
import { OutcomeScreen } from '../../src/tui/screens/OutcomeScreen.tsx'

const groups = [
  {
    label: 'Select',
    items: [
      { id: 'list-formats', name: 'List formats' },
      { id: 'match-filters', name: 'Match filters' },
      { id: 'format-sort-small', name: 'Format sort by size' },
      { id: 'use-extractors', name: 'Use extractors' },
    ],
  },
  {
    label: 'Metadata',
    items: [
      { id: 'parse-metadata', name: 'Parse metadata' },
      { id: 'split-chapters', name: 'Split chapters' },
      { id: 'force-keyframes-at-cuts', name: 'Force keyframes at cuts' },
      { id: 'load-info-json', name: 'Load info JSON' },
    ],
  },
  {
    label: 'Network',
    items: [
      { id: 'impersonate', name: 'Impersonate client' },
      { id: 'concurrent-fragments', name: 'Concurrent fragments' },
      { id: 'throttled-rate', name: 'Throttled rate' },
      { id: 'sleep-jitter', name: 'Sleep jitter' },
    ],
  },
  {
    label: 'Output',
    items: [
      { id: 'template-playlist', name: 'Playlist output template' },
      { id: 'template-chapter', name: 'Chapter output template' },
      { id: 'stdout-pipe', name: 'Stdout pipe' },
      { id: 'exec-guarded', name: 'Guarded exec' },
    ],
  },
] as const

function tick(ms = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('high-value outcome screen', () => {
  it('renders grouped headings', () => {
    const { lastFrame } = render(
      <OutcomeScreen groups={groups} selectedId="list-formats" onSelect={() => {}} />,
    )

    const frame = lastFrame() ?? ''
    expect(frame).toContain('Select')
    expect(frame).toContain('Metadata')
    expect(frame).toContain('Network')
    expect(frame).toContain('Output')
    expect(frame).toContain('16 options')
  })

  it('supports arrow navigation', async () => {
    const { lastFrame, stdin } = render(
      <OutcomeScreen groups={groups} selectedId="list-formats" onSelect={() => {}} />,
    )

    stdin.write('\u001B[B')
    await tick()
    const frame = lastFrame() ?? ''
    expect(frame).toContain('> 2. [ ] Match filters')
  })

  it('selects one high-value recipe', async () => {
    const onSelect = vi.fn()
    const { stdin } = render(
      <OutcomeScreen groups={groups} selectedId="list-formats" onSelect={onSelect} />,
    )

    // eslint-disable-next-line no-await-in-loop
    for (let i = 0; i < 8; i++) {
      stdin.write('\u001B[B')
      // eslint-disable-next-line no-await-in-loop
      await tick()
    }
    stdin.write('\r')
    await tick()
    expect(onSelect).toHaveBeenCalledWith('impersonate')
  })
})
