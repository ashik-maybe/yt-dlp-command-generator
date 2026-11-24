import type { Shell } from '../types.ts'

/**
 * Shell quoting rules.
 *
 * - posix: single quotes. A single quote becomes `'\''`.
 * - powershell: single quotes. A single quote is doubled.
 * - cmd: double quotes. A double quote is doubled. Carets, ampersands and
 *   pipes are literal inside double quotes, so the renderer does not add
 *   carets. Cmd cannot pass a literal newline in an argument, so the
 *   renderer rejects that input instead of emitting a broken command.
 */
export function quote(value: string, shell: Shell): string {
  switch (shell) {
    case 'posix':
      return `'${value.replace(/'/g, "'\\''")}'`
    case 'powershell':
      return `'${value.replace(/'/g, "''")}'`
    case 'cmd':
      if (/[\r\n]/.test(value)) {
        throw new Error('cmd cannot pass a newline inside one argument')
      }
      return `"${value.replace(/"/g, '""')}"`
  }
}
