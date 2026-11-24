import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const roots = ['src', 'scripts']
const banned = [
  [/linear-gradient\(/i, 'no hue gradients'],
  [/text-shadow\s*:/i, 'no text glow'],
  [/animate-(?:pulse|ping|bounce)/i, 'no looping motion'],
  [/transition-all/i, 'name the transition properties'],
  [/💩|🎉|🚀|✨|👍|🙂/u, 'no emoji in the interface'],
]

const self = new URL(import.meta.url).pathname

const files = []
for (const root of roots) {
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry)
      if (statSync(path).isDirectory()) walk(path)
      else if (/\.(?:ts|tsx|css|js|mjs)$/.test(path) && resolve(path) !== self) files.push(path)
    }
  }
  walk(root)
}

const problems = []
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const [pattern, message] of banned) {
    if (pattern.test(text)) problems.push(`${file}: ${message}`)
  }
}

if (problems.length) {
  console.error(`design-lint: ${problems.length} problem(s)`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

console.log(`design-lint: ${files.length} files clean`)
