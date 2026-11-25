import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'

const spec = JSON.parse(readFileSync(new URL('../src/spec/options.json', import.meta.url), 'utf8'))
const readmeFlags = JSON.parse(
  readFileSync(new URL('../src/spec/readme-flags.json', import.meta.url), 'utf8'),
)
const help = readFileSync(new URL('../.cache/yt-dlp-help.txt', import.meta.url), 'utf8')

const sections = new Map()
for (const option of spec.options) {
  sections.set(option.section ?? 'unknown', (sections.get(option.section ?? 'unknown') ?? 0) + 1)
}

const problems = []
if (spec.options.length <= 200) problems.push('option count must be above 200')
if (spec.options.some((option) => !option.flag)) problems.push('every option needs a flag')
if (!spec.options.some((option) => option.alias)) problems.push('option aliases missing')
if (!spec.deprecated || spec.deprecated.length === 0) problems.push('deprecated entries missing')
if (spec.provenance?.version !== '2026.11.23') problems.push('pinned version mismatch')
if (spec.provenance?.helpSha256 !== createHash('sha256').update(help).digest('hex')) {
  problems.push('help cache sha256 mismatch')
}
if (new Set(spec.options.map((option) => option.flag)).size !== spec.options.length) {
  problems.push('duplicate flags')
}
if (!Array.isArray(readmeFlags.flags)) problems.push('readme flags array missing')
if (readmeFlags.provenance?.version !== '2026.11.23') problems.push('readme version mismatch')
if (!/^[a-f0-9]{64}$/.test(readmeFlags.provenance?.readmeSha256 ?? '')) {
  problems.push('readme sha256 missing')
}

console.log(
  `spec-check: ${spec.options.length} options, ${spec.deprecated?.length ?? 0} deprecated, ${readmeFlags.flags.length} README-only`,
)
for (const [section, count] of sections) console.log(`  ${section}: ${count}`)

if (problems.length) {
  for (const problem of problems) console.error(`  FAIL ${problem}`)
  process.exit(1)
}
console.log('spec-check: PASS')
