/// <reference types="node" />
import { describe, expect, test, afterEach } from 'vitest'
import { mkdtemp, rm, writeFile, chmod } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runProcess, type ProgressSink } from './index.ts'

const dirs: string[] = []

async function makeBin(script: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'runner-test-'))
  dirs.push(dir)
  const file = join(dir, 'bin.mjs')
  await writeFile(file, script, 'utf8')
  await chmod(file, 0o755)
  return file
}

afterEach(async () => {
  await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })))
})

describe('runProcess', () => {
  test('returns stdout and exit 0 on success', async () => {
    const bin = await makeBin('process.stdout.write("hello")')
    const result = await runProcess([process.execPath, bin])
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toBe('hello')
    expect(result.stderr).toBe('')
    expect(result.durationMs).toBeGreaterThanOrEqual(0)
  })

  test('returns failure exit code', async () => {
    const bin = await makeBin('process.exit(7)')
    const result = await runProcess([process.execPath, bin])
    expect(result.exitCode).toBe(7)
  })

  test('returns clear ENOENT exit code', async () => {
    const result = await runProcess(['/tmp/opencode/definitely-missing-binary-xyz'])
    expect(result.exitCode).toBe(127)
    expect(result.stdout).toBe('')
  })

  test('streams stdout and stderr to callbacks', async () => {
    const bin = await makeBin('process.stdout.write("out"); process.stderr.write("err")')
    const out: string[] = []
    const err: string[] = []
    const sink: ProgressSink = {
      onStdout: (chunk) => out.push(chunk),
      onStderr: (chunk) => err.push(chunk),
    }
    const result = await runProcess([process.execPath, bin], undefined, sink)
    expect(result.exitCode).toBe(0)
    expect(out.join('')).toContain('out')
    expect(err.join('')).toContain('err')
    expect(result.stdout).toContain('out')
    expect(result.stderr).toContain('err')
  })

  test('cancels with AbortSignal', async () => {
    const bin = await makeBin('process.stdout.write("start\\n"); setInterval(() => {}, 1000)')
    const controller = new AbortController()
    let sawStart = false
    const sink: ProgressSink = {
      onStdout: (chunk) => {
        if (chunk.includes('start')) sawStart = true
      },
    }
    const promise = runProcess([process.execPath, bin], controller.signal, sink)
    const deadline = Date.now() + 2000
    while (!sawStart && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 5))
    }
    controller.abort()
    const result = await promise
    expect(result.exitCode).toBe(130)
    expect(result.stdout).toContain('start')
  })
})
