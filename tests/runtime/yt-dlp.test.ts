import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const binPath = resolve(repoRoot, 'tools/bin/yt-dlp')
const fixturePath = resolve(repoRoot, 'tests/runtime/fixture.mp4')
const hasBin = existsSync(binPath)

type RunResult = { code: number | null; stdout: string; stderr: string }

function run(args: string[]): Promise<RunResult> {
  return new Promise((resolveResult) => {
    const proc = spawn(binPath, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PATH: process.env.PATH ?? '' },
    })
    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', (d: Buffer) => {
      stdout += d.toString()
    })
    proc.stderr.on('data', (d: Buffer) => {
      stderr += d.toString()
    })
    proc.on('close', (code) => resolveResult({ code, stdout, stderr }))
  })
}

describe.skipIf(!hasBin)('pinned yt-dlp runtime', () => {
  let server: Server
  let baseUrl: string

  beforeAll(async () => {
    const mp4 = readFileSync(fixturePath)
    const html = '<!doctype html><html><body><video src="/fixture.mp4"></video></body></html>'
    server = createServer((req, res) => {
      if (req.url === '/fixture.mp4') {
        res.writeHead(200, {
          'Content-Type': 'video/mp4',
          'Content-Length': mp4.length,
        })
        res.end(mp4)
        return
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html)
    })
    await new Promise<void>((resolveListen) => {
      server.listen(0, '127.0.0.1', () => resolveListen())
    })
    const addr = server.address()
    if (addr === null || typeof addr === 'string') {
      throw new Error('server did not bind to a port')
    }
    baseUrl = `http://127.0.0.1:${addr.port}/page.html`
  })

  afterAll(async () => {
    await new Promise<void>((resolveClose) => server.close(() => resolveClose()))
  })

  it('reports a pinned 2026.11 version', async () => {
    const result = await run(['--version'])
    expect(result.code).toBe(0)
    expect(result.stdout.trim()).toMatch(/^2026\.11/)
  })

  it('runs --simulate against a local generic extractor URL', async () => {
    const result = await run([
      '--ignore-config',
      '--no-playlist',
      '--simulate',
      '--force-generic-extractor',
      baseUrl,
    ])
    expect(result.code).toBe(0)
    expect(result.stdout + result.stderr).toContain('generic')
  }, 30_000)

  it('runs -F against a local generic extractor URL', async () => {
    const result = await run([
      '--ignore-config',
      '--no-playlist',
      '-F',
      '--force-generic-extractor',
      baseUrl,
    ])
    expect(result.code).toBe(0)
    expect(result.stdout).toContain('Available formats')
  }, 30_000)
})
