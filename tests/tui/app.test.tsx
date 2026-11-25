import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'ink-testing-library'
import { App } from '../../src/tui/app.tsx'
import { run } from '../../src/tui/run.ts'

const CANNED_HELP = `Usage: yt-dlp [OPTIONS] URL [URL...]

General Options:
    -h, --help                      Print this help text and exit
    --version                       Print program version and exit
    --list-formats                  List available formats

Download Options:
    -f, --format FORMAT             Video format code
    -o, --output TEMPLATE           Output filename template
`

const dirs: string[] = []

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'yt-dlp-tui-test-'))
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

describe('tui app', () => {
  it('default render shows outcome screen', async () => {
    const bin = makeFakeBinary()
    const { lastFrame } = render(<App binary={bin} />)
    const frame = await waitForText(lastFrame, '[Outcome]')
    expect(frame).toContain('[Outcome]')
  })

  it('--version output returns version string', () => {
    const result = run(['--version'])
    expect(result.code).toBe(0)
    expect(result.output).toContain('yt-dlp-tui 0.0.0')
  })

  it('shows unknown flag finding for raw args', async () => {
    const bin = makeFakeBinary()
    const { lastFrame, stdin } = render(<App binary={bin} />)
    await waitForText(lastFrame, '[Outcome]')

    // Select first outcome.
    stdin.write('\r')
    await waitForText(lastFrame, '[Options]')

    // Move focus to raw args and type unknown flag.
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('--bogus-flag')
    await tick(50)

    // Go to result.
    stdin.write('\r')
    const frame = await waitForText(lastFrame, 'UNKNOWN_FLAG')
    expect(frame).toContain('UNKNOWN_FLAG')
  })

  it('gates execution behind --run', async () => {
    const bin = makeFakeBinary()

    // Without --run, should not execute.
    const noRun = render(<App binary={bin} />)
    await waitForText(noRun.lastFrame, '[Outcome]')
    noRun.stdin.write('\r')
    await waitForText(noRun.lastFrame, '[Options]')
    noRun.stdin.write('\r')
    const noRunFrame = await waitForText(noRun.lastFrame, '[Result]')
    expect(noRunFrame).toContain('ready')
    expect(noRunFrame).not.toContain('exit 0')

    // With --run and --yes, should execute.
    const withRun = render(<App binary={bin} runEnabled yes />)
    await waitForText(withRun.lastFrame, '[Outcome]')
    withRun.stdin.write('\r')
    await waitForText(withRun.lastFrame, '[Options]')
    withRun.stdin.write('\r')
    const runFrame = await waitForText(withRun.lastFrame, 'exit 0')
    expect(runFrame).toContain('exit 0')
  })
})
