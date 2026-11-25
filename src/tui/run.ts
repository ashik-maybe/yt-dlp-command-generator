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
    const output = 'Usage: yt-dlp-tui [--version] [--help] [--run] [--yes]'
    console.log(output)
    return { code: 0, output }
  }

  render(React.createElement(App, { runEnabled: parsed.run, yes: parsed.yes }), {
    exitOnCtrlC: false,
  })
  return { code: 0, output: '' }
}
