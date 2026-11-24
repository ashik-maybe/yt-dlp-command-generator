/**
 * Selftest for quote and render.
 *
 * Runs node against the hostile names in tests/fixtures/hostile-names.json
 * and prints each rendered command for posix, powershell and cmd. Each
 * printed render is verified to round-trip back to the original name,
 * so the output shows that no shell breaks.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from './index.ts'
import { quote } from './quote.ts'

const here = dirname(fileURLToPath(import.meta.url))
const fixturePath = join(here, '..', '..', '..', 'tests', 'fixtures', 'hostile-names.json')
const names = JSON.parse(readFileSync(fixturePath, 'utf8'))
const shells = ['posix', 'powershell', 'cmd']

function unquotePosix(quoted) {
  return quoted.slice(1, -1).replace(/'\\''/g, "'")
}

function unquotePowershell(quoted) {
  return quoted.slice(1, -1).replace(/''/g, "'")
}

function unquoteCmd(quoted) {
  return quoted.slice(1, -1).replace(/\^(.)/g, '$1')
}

const unquoters = {
  posix: unquotePosix,
  powershell: unquotePowershell,
  cmd: unquoteCmd,
}

let failures = 0
for (const shell of shells) {
  for (const name of names) {
    const quoted = quote(name, shell)
    const rendered = render(
      { program: 'yt-dlp', args: [{ flag: null, value: name }], shell },
      shell,
    )
    const roundTrips = rendered === `yt-dlp ${quoted}` && unquoters[shell](quoted) === name
    if (!roundTrips) failures += 1
    console.log(`${shell}\t${roundTrips ? '' : 'BROKEN: '}${rendered}`)
  }
}

if (failures === 0) {
  console.log(`OK: ${names.length} names x ${shells.length} shells round-trip, no shell breaks`)
} else {
  console.log(`FAIL: ${failures} renders do not round-trip`)
  process.exit(1)
}
