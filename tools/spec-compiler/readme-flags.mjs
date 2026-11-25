#!/usr/bin/env node
/**
 * Spec compiler: generate src/spec/readme-flags.json from .cache/yt-dlp-readme.md
 *
 * Parses option list sections in USAGE AND OPTIONS. Keeps long flags the
 * help-derived spec (src/spec/options.json) does not have. Each kept flag is
 * marked with source "README" and documentedOnly. Adds provenance: version,
 * source URL, generated date and sha256 of the cached README.
 */

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const readmePath = join(root, '.cache', 'yt-dlp-readme.md')
const helpSpecPath = join(root, 'src', 'spec', 'options.json')
const outPath = join(root, 'src', 'spec', 'readme-flags.json')

const TOOL = 'yt-dlp'
const VERSION = '2026.11.23'
const SOURCE_URL = 'https://github.com/yt-dlp/yt-dlp/blob/master/README.md'

const headingRe = /^(#{1,3})[ \t]+(.+?)[ \t]*$/
const flagTokenRe = /^--?[A-Za-z0-9][\w-]*$/
const backtickedFlagRe = /`(--[A-Za-z0-9][\w-]*)`/g

function parseBullet(line) {
  const indent = line.match(/^\s*/)[0]
  const rest = line.slice(indent.length)
  if (!/^-{1,2}[A-Za-z0-9]/.test(rest)) return null
  const tokens = rest.split(/[ ,]+/).filter(Boolean)
  const flags = []
  while (tokens.length > 0 && flagTokenRe.test(tokens[0])) {
    flags.push(tokens.shift())
  }
  if (flags.length === 0) return null
  const longFlag = flags.find((token) => token.startsWith('--'))
  if (!longFlag) return null
  const alias = flags.find((token) => !token.startsWith('--'))
  return {
    longFlag,
    alias,
    description: tokens.join(' ').trim(),
  }
}

function parseReadme(text) {
  const lines = text.split('\n').map((line) => line.replace(/\r$/, ''))
  const flags = new Map()
  let inUsage = false
  let inOptionSection = false
  let inCode = false
  let current = null

  const addFlag = (name, description, alias) => {
    if (!name || flags.has(name)) return
    const entry = {
      flag: name,
      description: (description ?? '').trim(),
      source: 'README',
      documentedOnly: true,
    }
    if (alias) entry.alias = alias.replace(/^-+/, '')
    flags.set(name, entry)
  }

  for (const line of lines) {
    if (/^```/.test(line)) {
      inCode = !inCode
      current = null
      continue
    }
    if (inCode) continue

    const heading = line.match(headingRe)
    if (heading) {
      const level = heading[1].length
      const title = heading[2].trim()
      current = null
      if (level === 1) {
        inUsage = title === 'USAGE AND OPTIONS'
        inOptionSection = false
      } else if (inUsage && level >= 2) {
        inOptionSection = /options|preset aliases/i.test(title)
      }
      continue
    }

    if (!inUsage || !inOptionSection) continue
    if (!line.trim()) {
      current = null
      continue
    }

    const bullet = parseBullet(line)
    if (bullet) {
      current = bullet
      addFlag(bullet.longFlag.replace(/^-+/, ''), bullet.description, bullet.alias)
      continue
    }

    // Continuation lines of a bullet keep the current description context.
    if (/^\s{20,}\S/.test(line) && current) {
      current.description = `${current.description} ${line.trim()}`.trim()
      const entry = flags.get(current.longFlag.replace(/^-+/, ''))
      if (entry) entry.description = current.description
    }

    // Backticked long flags in option sections are documented.
    for (const match of line.matchAll(backtickedFlagRe)) {
      addFlag(match[1].replace(/^-+/, ''), current?.description)
    }
  }

  return [...flags.values()]
}

function main() {
  const text = readFileSync(readmePath, 'utf8')
  const helpSpec = JSON.parse(readFileSync(helpSpecPath, 'utf8'))
  const helpFlags = new Set()
  for (const option of helpSpec.options) {
    if (option.flag) helpFlags.add(option.flag)
    if (option.alias) helpFlags.add(option.alias)
  }

  const flags = parseReadme(text).filter((entry) => !helpFlags.has(entry.flag))
  const spec = {
    tool: TOOL,
    flags,
    provenance: {
      version: VERSION,
      sourceUrl: SOURCE_URL,
      generatedDate: new Date().toISOString().slice(0, 10),
      readmeSha256: createHash('sha256').update(text).digest('hex'),
    },
  }

  writeFileSync(outPath, JSON.stringify(spec, null, 2) + '\n')
  console.log(`readme-flags: wrote ${flags.length} flags to ${outPath}`)
  console.log(
    `readme-flags: first 20: ${flags
      .slice(0, 20)
      .map((f) => `--${f.flag}`)
      .join(', ')}`,
  )
}

main()
