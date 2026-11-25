import { render } from 'ink'
import React from 'react'
import { App } from './app.tsx'
import type { TuiArgs } from './types.ts'

/** Parse command-line arguments. */
export function parseArgs(args: string[]): TuiArgs {
  return {
    version: args.includes('--version'),
    help: args.includes('--help'),
    run: args.includes('--run'),
    yes: args.includes('--yes'),
    unsafe: args.includes('--unsafe'),
    force: args.includes('--force'),
  }
}

/** Execute the TUI run. */
export function run(args: string[]): { code: number; output: string } {
  const parsed = parseArgs(args)

  if (parsed.version) {
    const output = 'yt-dlp-tui 0.0.0'
    console.log(output)
    return { code: 0, output }
  }

  if (parsed.help) {
    const output = 'Usage: yt-dlp-tui [--version] [--help] [--run] [--yes] [--unsafe] [--force]'
    console.log(output)
    return { code: 0, output }
  }

  render(
    React.createElement(App, {
      runEnabled: parsed.run,
      yes: parsed.yes,
      unsafe: parsed.unsafe,
      force: parsed.force,
    }),
    {
      exitOnCtrlC: false,
    },
  )
  return { code: 0, output: '' }
}
