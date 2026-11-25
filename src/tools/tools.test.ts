import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { Recipe } from '../core/types.ts'
import { detectBinary } from './detect.ts'
import { parseVersion } from './detect.ts'
import { compileRuntimeSpec, parseHelp } from './spec-runtime/compile.ts'
import { validateAgainstRuntime } from './spec-runtime/validate.ts'

const CANNED_HELP = `Usage: yt-dlp [OPTIONS] URL [URL...]

General Options:
    -h, --help                      Print this help text and exit
    --version                       Print program version and exit
    -i, --ignore-errors             Ignore download and postprocessing errors
    --abort-on-error                Abort downloading of further videos (Alias: --no-ignore-errors)

Download Options:
    -o, --output TEMPLATE           Output filename template
    --download-sections REGEX       Download only chapters that match the regular expression

Deprecated Options:
    --old-flag                      This option is deprecated
`

const dirs: string[] = []

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'yt-dlp-tools-test-'))
  dirs.push(dir)
  return dir
}

function makeFakeBinary(help = CANNED_HELP, version = '2026.11.23'): string {
  const dir = makeTempDir()
  const file = join(dir, 'yt-dlp')
  const script = `#!/bin/sh
if [ "$1" = "--version" ]; then
  echo "${version}"
  exit 0
fi
if [ "$1" = "--help" ]; then
  cat <<'HELP'
${help}
HELP
  exit 0
fi
echo "unknown args: $@" 1>&2
exit 1
`
  writeFileSync(file, script)
  chmodSync(file, 0o755)
  return file
}

afterEach(() => {
  while (dirs.length > 0) {
    const dir = dirs.pop()
    if (dir) rmSync(dir, { recursive: true, force: true })
  }
})

describe('detectBinary', () => {
  it('detects a fake binary and parses version', () => {
    const bin = makeFakeBinary()
    const result = detectBinary(bin)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.path).toBe(bin)
      expect(result.version).toBe('2026.11.23')
    }
  })

  it('returns NOT_FOUND when absent', () => {
    const result = detectBinary('/definitely/missing/yt-dlp')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('NOT_FOUND')
      expect(result.message).toContain('not found')
    }
  })
})

describe('parseVersion', () => {
  it('parses version from output', () => {
    expect(parseVersion('2026.11.23\n')).toBe('2026.11.23')
    expect(parseVersion(' \n 2026.01.01 \n')).toBe('2026.01.01')
    expect(parseVersion('')).toBeNull()
  })
})

describe('parseHelp', () => {
  it('parses options, aliases, sections, and deprecated flags', () => {
    const parsed = parseHelp(CANNED_HELP)
    expect(parsed.sections).toEqual(['General Options', 'Download Options', 'Deprecated Options'])

    const help = parsed.options.find((o) => o.flag === 'help')
    expect(help?.isBoolean).toBe(true)
    expect(help?.section).toBe('General Options')

    const output = parsed.options.find((o) => o.flag === 'output')
    expect(output?.isBoolean).toBe(false)
    expect(output?.metavar).toBe('TEMPLATE')
    expect(output?.section).toBe('Download Options')

    const abort = parsed.options.find((o) => o.flag === 'abort-on-error')
    expect(abort?.alias).toBe('no-ignore-errors')

    expect(parsed.deprecated).toContain('old-flag')
    expect(parsed.options.some((o) => o.flag === 'old-flag')).toBe(false)
  })
})

describe('compileRuntimeSpec', () => {
  it('compiles spec from fake binary and reuses cache', () => {
    const bin = makeFakeBinary()
    const cacheDir = makeTempDir()

    const first = compileRuntimeSpec(bin, { cacheDir })
    expect(first.tool).toBe('yt-dlp')
    expect(first.version).toBe('2026.11.23')
    expect(first.helpSha256).toMatch(/^[a-f0-9]{64}$/)
    expect(first.options.some((o) => o.flag === 'help')).toBe(true)
    expect(first.deprecated).toContain('old-flag')

    const second = compileRuntimeSpec(bin, { cacheDir })
    expect(second).toEqual(first)
  })
})

function makeSpec(flags: string[]): import('./spec-runtime/types.ts').RuntimeSpec {
  return {
    tool: 'yt-dlp',
    version: '2026.01.01',
    helpSha256: 'a'.repeat(64),
    sections: ['General Options'],
    deprecated: [],
    options: flags.map((flag) => ({
      flag,
      description: flag,
      section: 'General Options',
      isBoolean: false,
    })),
  }
}

describe('validateAgainstRuntime', () => {
  it('returns findings for unknown flags', () => {
    const bin = makeFakeBinary()
    const cacheDir = makeTempDir()
    const spec = compileRuntimeSpec(bin, { cacheDir })

    const recipe: Recipe = {
      id: 'test',
      name: 'Test',
      args: [
        { flag: 'output', value: '%(title)s.%(ext)s' },
        { flag: 'not-a-real-flag', value: 'x' },
        { flag: null, value: 'https://example.com' },
      ],
      confidence: 'unverified',
    }

    const findings = validateAgainstRuntime(spec, recipe)
    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({
      severity: 'error',
      code: 'UNKNOWN_FLAG',
    })
    expect(findings[0].message).toContain('--not-a-real-flag')
  })

  it('flags exec-guarded when spec lacks --exec', () => {
    const spec = makeSpec(['output'])
    const recipe: Recipe = {
      id: 'exec-guarded',
      name: 'Guarded exec',
      args: [{ flag: 'exec', value: 'after_move:echo %(filepath)q' }],
      confidence: 'unverified',
    }
    const findings = validateAgainstRuntime(spec, recipe)
    expect(findings.some((f) => f.code === 'UNKNOWN_FLAG' && f.message.includes('--exec'))).toBe(
      true,
    )
  })

  it('does not flag exec-guarded when spec has --exec', () => {
    const spec = makeSpec(['exec', 'output'])
    const recipe: Recipe = {
      id: 'exec-guarded',
      name: 'Guarded exec',
      args: [{ flag: 'exec', value: 'after_move:echo %(filepath)q' }],
      confidence: 'unverified',
    }
    expect(validateAgainstRuntime(spec, recipe)).toEqual([])
  })

  it('flags load-info-json when spec lacks it', () => {
    const spec = makeSpec(['output'])
    const recipe: Recipe = {
      id: 'load-info-json',
      name: 'Load info JSON',
      args: [{ flag: 'load-info-json', value: 'info.json' }],
      confidence: 'verified',
    }
    const findings = validateAgainstRuntime(spec, recipe)
    expect(
      findings.some((f) => f.code === 'UNKNOWN_FLAG' && f.message.includes('--load-info-json')),
    ).toBe(true)
  })

  it('flags split-chapters when spec lacks it', () => {
    const spec = makeSpec(['output'])
    const recipe: Recipe = {
      id: 'template-chapter',
      name: 'Chapter output template',
      args: [
        { flag: 'split-chapters' },
        { flag: 'output', value: 'chapter:%(section_number)02d - %(section_title)s.%(ext)s' },
      ],
      confidence: 'unverified',
    }
    const findings = validateAgainstRuntime(spec, recipe)
    expect(
      findings.some((f) => f.code === 'UNKNOWN_FLAG' && f.message.includes('--split-chapters')),
    ).toBe(true)
  })
})
