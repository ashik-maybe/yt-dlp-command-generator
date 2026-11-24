// @vitest-environment node
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { render } from '../../src/core/render/index.ts'
import { quote } from '../../src/core/render/quote.ts'
import type { Command, Shell } from '../../src/core/types.ts'

const hostilePath = new URL('../fixtures/hostile-names.json', import.meta.url)
const hostileNames = JSON.parse(readFileSync(hostilePath, 'utf8')) as string[]
const shells: Shell[] = ['posix', 'powershell', 'cmd']

function namesFor(shell: Shell): string[] {
  return shell === 'cmd' ? hostileNames.filter((name) => !/[\r\n]/.test(name)) : hostileNames
}

function commandFor(name: string, shell: Shell): Command {
  return {
    program: 'yt-dlp',
    args: [{ flag: null, value: name }],
    shell,
  }
}

describe('render hostile names', () => {
  for (const shell of shells) {
    it(`contains escaped name for every hostile filename (${shell})`, () => {
      for (const name of namesFor(shell)) {
        const rendered = render(commandFor(name, shell), shell)
        expect(rendered).toContain(quote(name, shell))
      }
    })
  }

  it('no rendered command contains undefined', () => {
    for (const shell of shells) {
      for (const name of namesFor(shell)) {
        const rendered = render(commandFor(name, shell), shell)
        expect(rendered).not.toContain('undefined')
      }
    }
  })

  it('posix render passes bash -n for five sample names', () => {
    const samples = hostileNames.slice(0, 5)
    expect(samples).toHaveLength(5)
    for (const name of samples) {
      const rendered = render(commandFor(name, 'posix'), 'posix')
      expect(() => {
        execFileSync('bash', ['-n', '-c', rendered], {
          encoding: 'utf8',
          stdio: 'pipe',
        })
      }).not.toThrow()
    }
  })
})
