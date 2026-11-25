import { describe, expect, it, vi } from 'vitest'
import { render } from 'ink-testing-library'
import { OutcomeScreen, OptionsScreen, ResultScreen } from '../../src/tui/screens/index.ts'

const outcomes = [
  { id: 'download', name: 'Download video' },
  { id: 'audio', name: 'Extract audio' },
  { id: 'formats', name: 'List formats' },
] as const

function tick(ms = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('OutcomeScreen', () => {
  it('renders first screen with numbered outcomes', () => {
    const { lastFrame } = render(
      <OutcomeScreen outcomes={outcomes} selectedId="download" onSelect={() => {}} />,
    )

    const frame = lastFrame() ?? ''
    expect(frame).toContain('[Outcome]')
    expect(frame).toContain('1. [*] Download video')
    expect(frame).toContain('2. [ ] Extract audio')
    expect(frame).toContain('3. [ ] List formats')
  })

  it('supports arrow navigation', async () => {
    const { lastFrame, stdin } = render(
      <OutcomeScreen outcomes={outcomes} selectedId="download" onSelect={() => {}} />,
    )

    stdin.write('\u001B[B')
    await tick()
    const frame = lastFrame() ?? ''
    expect(frame).toContain('> 2. [ ] Extract audio')
  })

  it('selects the focused outcome on Enter', async () => {
    const onSelect = vi.fn()
    const { stdin } = render(
      <OutcomeScreen outcomes={outcomes} selectedId="download" onSelect={onSelect} />,
    )

    stdin.write('\u001B[B')
    await tick()
    stdin.write('\r')
    await tick()
    expect(onSelect).toHaveBeenCalledWith('audio')
  })
})

describe('OptionsScreen', () => {
  it('renders quality selector and raw args field', () => {
    const { lastFrame } = render(
      <OptionsScreen
        quality="best"
        shell="posix"
        rawArgs=""
        sourceUrl=""
        onSourceUrl={() => {}}
        onChange={() => {}}
      />,
    )

    const frame = lastFrame() ?? ''
    expect(frame).toContain('[Options]')
    expect(frame).toContain('Quality: best')
    expect(frame).toContain('Raw args:')
    expect(frame).toContain('shell: posix')
  })
})

describe('ResultScreen', () => {
  it('shows command and quiet validation findings', () => {
    const { lastFrame } = render(
      <ResultScreen
        command="yt-dlp -f best https://example.com"
        findings={[{ severity: 'warning', code: 'UNKNOWN_FLAG', message: 'Unknown flag found' }]}
        version="2026.11.23"
        running={false}
      />,
    )

    const frame = lastFrame() ?? ''
    expect(frame).toContain('Version: 2026.11.23')
    expect(frame).toContain('yt-dlp -f best https://example.com')
    expect(frame).toContain('Findings:')
    expect(frame).toContain('[warning] UNKNOWN_FLAG: Unknown flag found')
    expect(frame).toContain('ready')
  })
})
