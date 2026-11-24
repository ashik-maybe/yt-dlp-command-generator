import type { Shell } from '../types.ts'

/**
 * Shell quoting rules.
 *
 * - posix: the value is wrapped in single quotes. A single quote inside the
 *   value becomes `'\''` (close quote, escaped quote, reopen). Double
 *   quotes, dollar signs, backticks, semicolons and newlines are inert
 *   inside single quotes, so no extra escape is added.
 * - powershell: the value is wrapped in single quotes. A single quote
 *   becomes `''` (doubled). Double quotes, dollar signs, backticks,
 *   semicolons and newlines are inert inside single quotes, so no extra
 *   escape is added.
 * - cmd: the value is wrapped in double quotes. Each of `^`, `"`, `&`,
 *   `|`, `<`, `>` and `;` becomes `^` plus the character, and `%` becomes
 *   `^%`. Dollar signs and backticks are not special in cmd and are left
 *   as-is.
 */
export function quote(value: string, shell: Shell): string {
  switch (shell) {
    case 'posix':
      return `'${value.replace(/'/g, "'\\''")}'`
    case 'powershell':
      return `'${value.replace(/'/g, "''")}'`
    case 'cmd':
      return `"${quoteCmd(value)}"`
  }
}

const cmdEscapes: Record<string, string> = {
  '^': '^^',
  '"': '^"',
  '&': '^&',
  '|': '^|',
  '<': '^<',
  '>': '^>',
  ';': '^;',
  '%': '^%',
}

function quoteCmd(value: string): string {
  return value.replace(/[\^"&|<>%;]/g, (c) => cmdEscapes[c] ?? c)
}
