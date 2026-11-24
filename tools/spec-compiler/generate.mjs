#!/usr/bin/env node
/**
 * Spec compiler: generate src/spec/options.json from .cache/yt-dlp-help.txt.
 *
 * Parses every option line of the cached help text. Keeps flag, alias, value
 * placeholder, description and section for each option, and parses a
 * deprecated options section when one is present. Adds provenance: the
 * pinned version, the source URL, the generated date and the sha256 of the
 * cached help text.
 */

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const helpPath = join(root, '.cache', 'yt-dlp-help.txt')
const outPath = join(root, 'src', 'spec', 'options.json')

const TOOL = 'yt-dlp'
const VERSION = '2026.11.23'
const PINNED_VERSION = '2026.11.23'
const SOURCE_URL = 'https://github.com/yt-dlp/yt-dlp/releases/tag/2026.11.23'
const HELP_FILE = '.cache/yt-dlp-help.txt'

const sectionRe = /^(?:Options:|  [A-Za-z][^:]*:)$/
const optionLineRe = /^ {4}(-{1,2}\S+(?:[ ,]+-{1,2}\S+)*)/
const indentRe = /^\s*/
const metavarRe = /^[A-Z0-9_]+(?::[A-Z0-9_]+)*(\[.+\])?$/
const aliasRe = /\(Alias:\s*(-{1,2}\w[\w-]*)\)/

function isMetavar(token) {
  if (!token) return false
  if (token[0] === '[') return true
  return metavarRe.test(token)
}

function parseOptionLine(line, match, lines, startIndex, section) {
  const rawFlags = match[1].split(/[ ,]+/).filter(Boolean)
  if (rawFlags.length === 0) return null
  const longFlag = rawFlags.find((token) => token.startsWith('--'))
  const flag = (longFlag ?? rawFlags[0]).replace(/^-+/, '')

  const rest = line.slice(match[0].length)
  const indent = indentRe.exec(rest)[0]
  let description = rest.slice(indent.length)
  let metavar = null
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
    if (sectionRe.test(next) || optionLineRe.test(next)) break
    if (!/^\s+\S/.test(next)) break
    parts.push(next.trim())
    j++
  }

  const option = {
    flag,
    description: parts.filter(Boolean).join(' ').trim(),
    section,
    isBoolean: metavar === null,
  }
  if (metavar) option.metavar = metavar
  const alias = aliasRe.exec(option.description)?.[1]?.replace(/^-+/, '')
  if (alias) option.alias = alias
  return option
}

function parseHelp(text) {
  const lines = text.split('\n')
  const options = []
  const deprecated = []
  let section = null
  let inDeprecated = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '')
    if (sectionRe.test(line)) {
      section = line.trim().replace(/:$/, '')
      inDeprecated = /deprecated/i.test(section)
      continue
    }
    // Preset aliases such as "-t mp3" are not options. Skip that section.
    if (section === 'Preset Aliases') continue
    const match = optionLineRe.exec(line)
    if (!match) continue
    const parsed = parseOptionLine(line, match, lines, i, section)
    if (!parsed) continue
    if (inDeprecated) deprecated.push(parsed.flag)
    else options.push(parsed)
  }

  return { options, deprecated }
}

function main() {
  const text = readFileSync(helpPath, 'utf8')
  const { options, deprecated } = parseHelp(text)
  const spec = {
    tool: TOOL,
    version: VERSION,
    pinnedVersion: PINNED_VERSION,
    helpFile: HELP_FILE,
    options,
    deprecated,
    provenance: {
      version: VERSION,
      sourceUrl: SOURCE_URL,
      generatedDate: new Date().toISOString().slice(0, 10),
      helpSha256: createHash('sha256').update(text).digest('hex'),
    },
  }
  writeFileSync(outPath, JSON.stringify(spec, null, 2) + '\n')
  console.log(`spec-compiler: wrote ${options.length} options to ${outPath}`)
}

main()
