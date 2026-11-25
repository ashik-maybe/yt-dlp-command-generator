import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { recipes, toPlan } from '../../src/recipes/index.ts'
import type { Arg } from '../../src/core/types.ts'

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

function recipeArgv(args: Arg[]): string[] {
  const out: string[] = []
  for (const arg of args) {
    if (arg.flag === null) {
      if (arg.value !== undefined) out.push(arg.value)
      continue
    }
    const flag = arg.flag.startsWith('-') ? arg.flag : `--${arg.flag}`
    if (arg.values !== undefined) {
      for (const value of arg.values) out.push(flag, value)
      continue
    }
    if (arg.value !== undefined) {
      out.push(flag, arg.value)
      continue
    }
    out.push(flag)
  }
  return out
}

const safeRecipeIds = [
  'list-formats',
  'match-filters',
  'format-sort-small',
  'use-extractors',
  'parse-metadata',
  'split-chapters',
  'force-keyframes-at-cuts',
  'impersonate',
  'concurrent-fragments',
  'throttled-rate',
  'sleep-jitter',
  'template-playlist',
  'template-chapter',
] as const

describe.skipIf(!hasBin)('high-value recipe runtime', () => {
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

  for (const id of safeRecipeIds) {
    it(`runs ${id} with --simulate against a local fixture`, async () => {
      const recipe = recipes.find((r) => r.id === id)
      expect(recipe).toBeDefined()
      const plan = toPlan(recipe!, {}, 'posix')
      let args = recipeArgv(plan.args)
      const baseArgs = [
        '--ignore-config',
        '--no-playlist',
        '--simulate',
        '--force-generic-extractor',
      ]

      if (id === 'use-extractors') {
        args = ['--use-extractors', 'generic,HTML5']
      }
      if (id === 'force-keyframes-at-cuts') {
        args = ['--force-keyframes-at-cuts', '--download-sections', '*0-1']
      }
      if (id === 'impersonate') {
        const targets = await run(['--list-impersonate-targets'])
        const text = String(targets.stdout) + String(targets.stderr)
        if (/chrome\b[^\n]*unavailable/i.test(text) || !/\bchrome\b/i.test(text)) {
          return
        }
      }

      const result = await run([...baseArgs, ...args, baseUrl])
      expect(result.code).toBe(0)
    }, 30_000)
  }
})
