/** Shared TUI theme tokens. One accent only. */
export const theme = {
  accent: 'cyan',
  muted: 'gray',
  error: 'red',
  success: 'green',
} as const

/** ASCII glyphs used by the TUI. */
export const glyphs = {
  cursor: '>',
  selected: '*',
  unselected: ' ',
  barFill: '#',
  barEmpty: '-',
} as const

/** Return true when terminal width is narrow. */
export function isNarrow(width: number | undefined): boolean {
  return (width ?? 80) < 60
}
