import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'ink-testing-library'
import { App } from '../../src/tui/app.tsx'
import { OutcomeScreen } from '../../src/tui/screens/OutcomeScreen.tsx'
import { ResultScreen } from '../../src/tui/screens/ResultScreen.tsx'

const CANNED_HELP = `Usage: yt-dlp [OPTIONS] URL [URL...]

General Options:
    -h, --help                      Print this help text and exit
    --version                       Print program version and exit
`

const dirs: string[] = []

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'yt-dlp-ux-'))
  dirs.push(dir)
  return dir
}

function makeFakeBinary(version = '2026.11.23'): string {
  const dir = makeTempDir()
  const file = join(dir, 'yt-dlp')
  const script = `#!/bin/sh
if [ "$1" = "--version" ]; then
  echo "${version}"
  exit 0
fi
if [ "$1" = "--help" ]; then
  cat <<'HELP'
${CANNED_HELP}
HELP
  exit 0
fi
echo "ok"
exit 0
`
  writeFileSync(file, script)
  chmodSync(file, 0o755)
  return file
}

function tick(ms = 80): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForText(
  lastFrame: () => string | undefined,
  text: string,
  timeoutMs = 3000,
): Promise<string> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const frame = lastFrame() ?? ''
    if (frame.includes(text)) return frame
    await tick(40)
  }
  return lastFrame() ?? ''
}

afterEach(() => {
  while (dirs.length > 0) {
    const dir = dirs.pop()
    if (dir) rmSync(dir, { recursive: true, force: true })
  }
})

describe('tui ux polish', () => {
  it('help overlay opens with ?', async () => {
    const bin = makeFakeBinary()
    const { lastFrame, stdin } = render(<App binary={bin} />)
    await waitForText(lastFrame, 'step 1 of 3')

    stdin.write('?')
    await tick()
    const frame = lastFrame() ?? ''
    expect(frame.toLowerCase()).toContain('help')
    expect(frame).toContain('?')
    expect(frame).toContain('Esc')

    stdin.write('\u001B')
    await tick()
    const closed = lastFrame() ?? ''
    expect(closed.toLowerCase()).not.toContain('close help')
  })

  it('step indicator shows step 1 of 3', async () => {
    const bin = makeFakeBinary()
    const { lastFrame } = render(<App binary={bin} />)
    const frame = await waitForText(lastFrame, 'step 1 of 3')
    expect(frame).toContain('step 1 of 3')
  })

  it('active outcome has a visible marker', () => {
    const { lastFrame } = render(
      <OutcomeScreen
        outcomes={[
          { id: 'a', name: 'Alpha' },
          { id: 'b', name: 'Beta' },
        ]}
        selectedId="a"
        onSelect={() => {}}
      />,
    )

    const frame = lastFrame() ?? ''
    expect(frame).toContain('> 1.')
  })

  it('progress bar shows percent', () => {
    const { lastFrame } = render(
      <ResultScreen
        command="yt-dlp https://example.com"
        findings={[]}
        version="2026.11.23"
        running
        progressPercent={42}
        progressSpeed="1.2MiB/s"
        rawLog=""
        verification={null}
      />,
    )

    const frame = lastFrame() ?? ''
    expect(frame).toMatch(/\[[#-]+\]\s*42%/)
  })

  it('narrow terminal hides the raw log', async () => {
    const bin = makeFakeBinary()
    const instance = render(<App binary={bin} />)
    Object.defineProperty(instance.stdout, 'columns', {
      get: () => 40,
      configurable: true,
    })

    await waitForText(instance.lastFrame, '[Outcome]')
    instance.stdin.write('\r')
    await waitForText(instance.lastFrame, '[Options]')
    instance.stdin.write('\r')
    const frame = await waitForText(instance.lastFrame, '[Result]')

    expect(frame).not.toContain('Raw log:')
  })

  it('all key hints stay ASCII', async () => {
    const bin = makeFakeBinary()
    const { lastFrame } = render(<App binary={bin} />)
    await waitForText(lastFrame, 'step 1 of 3')
    const frame = lastFrame() ?? ''
    const hintLines = frame.split('\n').filter((line) => line.includes(':') && line.includes('|'))
    for (const line of hintLines) {
      expect([...line].every((char) => char.codePointAt(0)! <= 0x7f)).toBe(true)
    }
    expect([...frame].some((char) => char.codePointAt(0)! <= 0x7f)).toBe(true)
  })
})
