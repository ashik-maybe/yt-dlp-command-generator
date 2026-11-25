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
    --load-info-json FILE           Load info from JSON
`

const dirs: string[] = []

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'yt-dlp-hardening-'))
  dirs.push(dir)
  return dir
}

function makeFakeBinary(scriptBody: string, version = '2026.11.23'): string {
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

describe('execution hardening', () => {
  it('blocks execution when an unbound placeholder is present', async () => {
    // load-info-json is 8th item overall (index 7) and has <FILE> placeholder.
    const bin = makeFakeBinary('echo ok\nexit 0')
    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes />)
    await navigateToResult(lastFrame, stdin, 7)

    const frame = await waitForText(lastFrame, 'blocked')
    expect(frame).toContain('UNBOUND_PLACEHOLDER')
    expect(frame).toContain('blocked')
    expect(frame).not.toContain('exit 0')
  })

  it('blocks execution when output file already exists', async () => {
    const dir = makeTempDir()
    const output = join(dir, 'out.mp4')
    writeFileSync(output, 'existing')

    const bin = makeFakeBinary('echo ok\nexit 0')
    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes />)
    await waitForText(lastFrame, '[Outcome]')

    // Select list-formats (index 0) - no output in recipe.
    stdin.write('\r')
    await waitForText(lastFrame, '[Options]')

    // Focus raw args: quality -> sourceUrl -> rawArgs
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write(`--output ${output}`)
    await tick(50)

    stdin.write('\r')
    const frame = await waitForText(lastFrame, 'blocked')
    expect(frame).toContain('blocked')
    expect(frame).not.toContain('exit 0')
  })

  it('verifies output file exists and has size after exit 0', async () => {
    const dir = makeTempDir()
    const output = join(dir, 'result.mp4')
    const bin = makeFakeBinary(`cat > "${output}" << 'EOF'
data
EOF
exit 0`)

    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes />)
    await waitForText(lastFrame, '[Outcome]')
    stdin.write('\r')
    await waitForText(lastFrame, '[Options]')

    // Set explicit output via raw args.
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write(`--output ${output}`)
    await tick(50)

    stdin.write('\r')
    const frame = await waitForText(lastFrame, 'verified')
    expect(frame).toContain('exit 0')
    expect(frame).toContain('verified')
  })

  it('allows overwrite when --force is set', async () => {
    const dir = makeTempDir()
    const output = join(dir, 'out.mp4')
    writeFileSync(output, 'existing')

    const bin = makeFakeBinary(`cat > "${output}" << 'EOF'
newdata
EOF
exit 0`)

    const { lastFrame, stdin } = render(<App binary={bin} runEnabled yes force />)
    await waitForText(lastFrame, '[Outcome]')
    stdin.write('\r')
    await waitForText(lastFrame, '[Options]')

    stdin.write('\u001B[B')
    await tick(50)
    stdin.write('\u001B[B')
    await tick(50)
    stdin.write(`--output ${output}`)
    await tick(50)

    stdin.write('\r')
    const frame = await waitForText(lastFrame, 'exit 0')
    expect(frame).toContain('exit 0')
    expect(frame).not.toContain('blocked')
  })
})
