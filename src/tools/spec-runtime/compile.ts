import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseVersion } from '../detect.ts'
import type { RuntimeOption, RuntimeSpec } from './types.ts'

const SECTION_RE = /^(?: {0,2})[A-Za-z][^:]*:$/
const OPTION_LINE_RE = /^ {4}(-{1,2}\S+(?:[ ,]+-{1,2}\S+)*)/
const INDENT_RE = /^\s*/
const METAVAR_RE = /^[A-Z0-9_]+(?::[A-Z0-9_]+)*(\[.+\])?$/
const ALIAS_RE = /\(Alias:\s*(-{1,2}\w[\w-]*)\)/

function isMetavar(token: string | undefined): token is string {
  if (!token) return false
  if (token.startsWith('[')) return true
  return METAVAR_RE.test(token)
}

function parseOptionLine(
  line: string,
  match: RegExpExecArray,
  lines: string[],
  startIndex: number,
  section: string,
): RuntimeOption | null {
  const rawFlags = match[1].split(/[ ,]+/).filter(Boolean)
  if (rawFlags.length === 0) return null
  const longFlag = rawFlags.find((token) => token.startsWith('--'))
  const flag = (longFlag ?? rawFlags[0]).replace(/^-+/, '')

  const rest = line.slice(match[0].length)
  const indent = INDENT_RE.exec(rest)?.[0] ?? ''
  let description = rest.slice(indent.length)
  let metavar: string | undefined
  const first = description.match(/^\S+/)?.[0]
  if (isMetavar(first)) {
    metavar = first
    description = description.slice(metavar.length).replace(/^\s+/, '')
  }

  const parts = [description.trim()]
  let j = startIndex + 1
  while (j < lines.length) {
    const next = lines[j].replace(/\r$/, '')
    if (!next.trim()) break
    if (SECTION_RE.test(next) || OPTION_LINE_RE.test(next)) break
    if (!/^\s+\S/.test(next)) break
    parts.push(next.trim())
    j++
  }

  const fullDescription = parts.filter(Boolean).join(' ').trim()
  const flat = fullDescription.replace(/\s+/g, '')
  const alias = ALIAS_RE.exec(flat)?.[1]?.replace(/^-+/, '')

  const option: RuntimeOption = {
    flag,
    description: fullDescription,
    section,
    isBoolean: metavar === undefined,
    ...(metavar ? { metavar } : {}),
    ...(alias ? { alias } : {}),
  }
  return option
}

/** Parse yt-dlp --help text into runtime spec components. */
export function parseHelp(text: string): {
  options: RuntimeOption[]
  deprecated: string[]
  sections: string[]
} {
  const lines = text.split('\n')
  const options: RuntimeOption[] = []
  const deprecated: string[] = []
  const sections: string[] = []
  let section: string | null = null
  let inDeprecated = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '')
    if (SECTION_RE.test(line)) {
      section = line.trim().replace(/:$/, '')
      inDeprecated = /deprecated/i.test(section)
      if (!sections.includes(section)) sections.push(section)
      continue
    }
    if (section === 'Preset Aliases') continue
    const match = OPTION_LINE_RE.exec(line)
    if (!match || !section) continue
    const parsed = parseOptionLine(line, match, lines, i, section)
    if (!parsed) continue
    if (inDeprecated) deprecated.push(parsed.flag)
    else options.push(parsed)
  }

  return { options, deprecated, sections }
}

/** Compute sha256 hex digest for text. */
export function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex')
}

/** Default cache directory for runtime specs. */
export function defaultCacheDir(): string {
  return join(tmpdir(), 'yt-dlp-command-generator', 'spec-runtime')
}

function cachePath(cacheDir: string, version: string, helpHash: string): string {
  const safeVersion = version.replace(/[^a-zA-Z0-9._-]/g, '_')
  return join(cacheDir, `${safeVersion}-${helpHash}.json`)
}

function readCache(cacheDir: string, version: string, helpHash: string): RuntimeSpec | null {
  const file = cachePath(cacheDir, version, helpHash)
  if (!existsSync(file)) return null
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as RuntimeSpec
    if (
      parsed.tool === 'yt-dlp' &&
      parsed.version === version &&
      parsed.helpSha256 === helpHash &&
      Array.isArray(parsed.options)
    ) {
      return parsed
    }
  } catch {
    return null
  }
  return null
}

function writeCache(cacheDir: string, spec: RuntimeSpec): void {
  mkdirSync(cacheDir, { recursive: true })
  const file = cachePath(cacheDir, spec.version, spec.helpSha256)
  writeFileSync(file, JSON.stringify(spec))
}

export interface CompileRuntimeSpecOptions {
  /** Cache directory override. */
  cacheDir?: string
}

/** Compile a RuntimeSpec from a local yt-dlp binary. */
export function compileRuntimeSpec(
  binaryPath: string,
  opts: CompileRuntimeSpecOptions = {},
): RuntimeSpec {
  const helpResult = spawnSync(binaryPath, ['--help'], {
    encoding: 'utf8',
    timeout: 10_000,
  })
  if (helpResult.error || helpResult.status !== 0) {
    throw new Error(`Failed to run --help: ${binaryPath}`)
  }
  const helpText = helpResult.stdout ?? ''
  const helpHash = sha256(helpText)

  const versionResult = spawnSync(binaryPath, ['--version'], {
    encoding: 'utf8',
    timeout: 10_000,
  })
  const version = parseVersion(versionResult.stdout ?? '') ?? 'unknown'
  const cacheDir = opts.cacheDir ?? defaultCacheDir()

  const cached = readCache(cacheDir, version, helpHash)
  if (cached) return cached

  const { options, deprecated, sections } = parseHelp(helpText)
  const spec: RuntimeSpec = {
    tool: 'yt-dlp',
    version,
    helpSha256: helpHash,
    options,
    deprecated,
    sections,
  }
  writeCache(cacheDir, spec)
  return spec
}
