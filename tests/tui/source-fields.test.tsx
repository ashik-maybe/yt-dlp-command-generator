import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'ink-testing-library'
import { App } from '../../src/tui/app.tsx'
import { OptionsScreen } from '../../src/tui/screens/index.ts'

const CANNED_HELP = `Usage: yt-dlp [OPTIONS] URL [URL...]

General Options:
    -h, --help                      Print this help text and exit
    --version                       Print program version and exit

Download Options:
    -f, --format FORMAT             Video format code
    -o, --output TEMPLATE           Output filename template
`

const dirs: string[] = []

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'yt-dlp-tui-source-'))
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

function tick(ms = 100): Promise<void> {
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
    await tick(50)
  }
  return lastFrame() ?? ''
}

afterEach(() => {
  while (dirs.length > 0) {
    const dir = dirs.pop()
    if (dir) rmSync(dir, { recursive: true, force: true })
  }
})

describe('source url field', () => {
  it('shows a Source URL field on options screen', () => {
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
    expect(frame).toContain('Source URL:')
  })

  it('allows typing a source value', async () => {
    let sourceUrl = ''
    const { lastFrame, stdin } = render(
      <OptionsScreen
        quality="best"
        shell="posix"
        rawArgs=""
        sourceUrl={sourceUrl}
        onSourceUrl={(value) => {
          sourceUrl = value
        }}
        onChange={() => {}}
      />,
    )

    // Focus order: quality -> sourceUrl -> rawArgs (expected)
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('https://example.com')
    await tick(50)

    expect(sourceUrl).toBe('https://example.com')
    // Frame may show controlled value; at least callback got it.
    const frame = lastFrame() ?? ''
    expect(frame).toContain('Source URL:')
  })

  it('passes sourceUrl into binding and emits it as an operand', async () => {
    const bin = makeFakeBinary()
    const { lastFrame, stdin } = render(<App binary={bin} />)
    await waitForText(lastFrame, '[Outcome]')

    stdin.write('\r')
    await waitForText(lastFrame, '[Options]')

    // Move to Source URL field and type.
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('https://example.com/video')
    await tick(100)

    const optionsFrame = lastFrame() ?? ''
    expect(optionsFrame).toContain('Source URL: https://example.com/video')
    expect(optionsFrame).toContain('Raw args:')

    // Go to result.
    stdin.write('\r')
    const frame = await waitForText(lastFrame, '[Result]')
    expect(frame).toContain('https://example.com/video')
  })
})
