import { readFileSync } from 'node:fs'

const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')

const required = [
  '--version',
  '--help',
  '--run',
  '--yes',
  '--force',
  '--unsafe',
  'Source URL',
  'Ctrl+C',
  'unbound placeholder',
  'overwrite',
  'output verified',
  'raw arguments unverified',
  'bun run ci',
  'bun run tui:test',
  'bunx playwright test',
  'bun run spec:check',
]

const missing = required.filter((value) => !readme.includes(value))

console.log(
  `readme-check: ${required.length} required, ${required.length - missing.length} found, ${missing.length} missing`,
)

if (missing.length > 0) {
  for (const value of missing) console.error(`  FAIL missing: ${value}`)
  process.exit(1)
}

console.log('readme-check: PASS')
