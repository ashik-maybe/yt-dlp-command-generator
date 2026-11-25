import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'ink-testing-library'
import { App } from '../../src/tui/app.tsx'

const CANNED_HELP = `Usage: yt-dlp [OPTIONS] URL [URL...]

General Options:
    -h, --help                      Print this help text and exit
    --version                       Print program version and exit
    --list-formats                  List available formats

Download Options:
    -f, --format FORMAT             Video format code
    -o, --output TEMPLATE           Output filename template
    --exec CMD                      Execute a command
`

const dirs: string[] = []

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'yt-dlp-unsafe-'))
  dirs.push(dir)
  return dir
}

function makeFakeBinary(scriptBody = 'echo ok\nexit 0', version = '2026.11.23'): string {
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
${scriptBody}
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
  timeoutMs = 4000,
): Promise<string> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const frame = lastFrame() ?? ''
    if (frame.includes(text)) return frame
    await tick(50)
  }
  return lastFrame() ?? ''
}

async function navigateToResult(
  lastFrame: () => string | undefined,
  stdin: { write: (data: string) => void },
  downPresses = 0,
): Promise<void> {
  await waitForText(lastFrame, '[Outcome]')
  for (let i = 0; i < downPresses; i++) {
    stdin.write('\u001B[B')
    await tick(40)
  }
  stdin.write('\r')
  await waitForText(lastFrame, '[Options]')
  stdin.write('\r')
  await waitForText(lastFrame, '[Result]')
}

afterEach(() => {
  while (dirs.length > 0) {
    const dir = dirs.pop()
    if (dir) rmSync(dir, { recursive: true, force: true })
  }
})

describe('unsafe guards', () => {
  it('exec-guarded requires --unsafe', async () => {
    // exec-guarded is at flat index 15 in HIGH_VALUE_GROUPS
    const bin = makeFakeBinary()
    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes />)
    await navigateToResult(lastFrame, stdin, 15)

    const frame = await waitForText(lastFrame, 'blocked')
    expect(frame).toContain('blocked')
    expect(frame.toLowerCase()).toContain('unsafe')
    expect(frame).not.toContain('exit 0')
  })

  it('stdout-pipe is blocked by default', async () => {
    // stdout-pipe is at flat index 14 in HIGH_VALUE_GROUPS
    const bin = makeFakeBinary()
    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes />)
    await navigateToResult(lastFrame, stdin, 14)

    const frame = await waitForText(lastFrame, 'blocked')
    expect(frame).toContain('blocked')
    expect(frame.toLowerCase()).toContain('unsafe')
    expect(frame).not.toContain('exit 0')
  })

  it('raw args containing --exec are blocked without --unsafe', async () => {
    const bin = makeFakeBinary()
    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes />)
    await waitForText(lastFrame, '[Outcome]')
    stdin.write('\r')
    await waitForText(lastFrame, '[Options]')

    // Focus raw args: quality -> sourceUrl -> rawArgs
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('--exec echo hi')
    await tick(50)

    stdin.write('\r')
    const frame = await waitForText(lastFrame, 'blocked')
    expect(frame).toContain('blocked')
    expect(frame.toLowerCase()).toContain('unsafe')
    expect(frame).not.toContain('exit 0')
  })

  it('normal recipe still runs with --run --yes', async () => {
    const bin = makeFakeBinary()
    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes />)
    await navigateToResult(lastFrame, stdin, 0)

    const frame = await waitForText(lastFrame, 'exit 0')
    expect(frame).toContain('exit 0')
  })
})

describe('force flag parsing', () => {
  it('parses --force from argv', async () => {
    const { parseArgs } = await import('../../src/tui/run.ts')
    expect(parseArgs(['--force']).force).toBe(true)
  })
})
