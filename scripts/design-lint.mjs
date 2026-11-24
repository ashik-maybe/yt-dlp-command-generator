import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const roots = ['src', 'scripts', 'design']
const self = resolve(new URL(import.meta.url).pathname)

const banned = [
  [/linear-gradient\(/i, 'no hue gradients'],
  [/text-shadow\s*:/i, 'no text glow'],
  [/backdrop-filter\s*:/i, 'no blur behind content'],
  [/animate-(?:pulse|ping|bounce)/i, 'no looping motion'],
  [/transition-all/i, 'name the transition properties'],
  [/text-transform\s*:\s*uppercase/i, 'use sentence case'],
  [/letter-spacing\s*:\s*(?:0\.?[2-9]|[1-9])em/i, 'no tracked labels'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'no emoji in the interface'],
  [/\bseamless\b|\beffortless\b|\bsupercharge\b|\bunlock\b|\bmagic\b/i, 'banned marketing word'],
]

const files = []
for (const root of roots) {
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry)
      if (statSync(path).isDirectory()) walk(path)
      else if (/\.(?:ts|tsx|css|js|mjs|md)$/.test(path) && resolve(path) !== self) files.push(path)
    }
  }
  walk(root)
}

const problems = []
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const [pattern, message] of banned) {
    for (const line of text.split('\n')) {
      if (pattern.test(line)) problems.push(`${file}: ${message}`)
    }
  }
}

if (problems.length) {
  console.error(`design-lint: ${problems.length} problem(s)`)
  for (const problem of problems.slice(0, 20)) console.error(`  ${problem}`)
  process.exit(1)
}

console.log(`design-lint: ${files.length} files clean`)
