import { spawnSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { delimiter, join } from 'node:path'
import type { DetectResult } from './spec-runtime/types.ts'

/** Find an executable on PATH. */
export function findOnPath(name: string): string | null {
  if (name.includes('/')) {
    return isExecutable(name) ? name : null
  }
  const pathEnv = process.env.PATH ?? ''
  for (const dir of pathEnv.split(delimiter)) {
    if (!dir) continue
    const candidate = join(dir, name)
    if (isExecutable(candidate)) return candidate
  }
  return null
}

function isExecutable(file: string): boolean {
  try {
    if (!existsSync(file)) return false
    const stat = statSync(file)
    if (!stat.isFile()) return false
    // On POSIX, check execute bit; on Windows this is lenient.
    if (process.platform !== 'win32') {
      return (stat.mode & 0o111) !== 0
    }
    return true
  } catch {
    return false
  }
}

/** Parse version string from yt-dlp --version output. */
export function parseVersion(output: string): string | null {
  const line = output
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 0)
  if (!line) return null
  // yt-dlp versions are typically YYYY.MM.DD or similar; keep first token.
  const token = line.split(/\s+/)[0]
  return token || null
}

/** Detect yt-dlp binary on PATH and return its version. */
export function detectBinary(binary = 'yt-dlp'): DetectResult {
  const path = findOnPath(binary)
  if (!path) {
    return {
      ok: false,
      error: 'NOT_FOUND',
      message: `yt-dlp binary not found: ${binary}`,
    }
  }

  const result = spawnSync(path, ['--version'], {
    encoding: 'utf8',
    timeout: 10_000,
  })

  if (result.error || result.status !== 0) {
    return {
      ok: false,
      error: 'NOT_FOUND',
      message: `yt-dlp binary not runnable: ${path}`,
    }
  }

  const version = parseVersion(result.stdout ?? '')
  if (!version) {
    return {
      ok: false,
      error: 'NOT_FOUND',
      message: `yt-dlp version not parseable: ${path}`,
    }
  }

  return { ok: true, path, version }
}
