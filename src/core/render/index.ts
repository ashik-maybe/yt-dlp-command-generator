import type { Arg, Command, Shell } from '../types.ts'
import { quote } from './quote.ts'

/**
 * Render a command from the IR.
 *
 * - The program is emitted first, unquoted.
 * - A null flag is a bare operand. Its value is quoted.
 * - A bare flag name from the spec is written with two dashes.
 * - The renderer owns shell quoting. Values enter the IR unquoted.
 */
export function render(command: Command, shell: Shell): string {
  const parts: string[] = [command.program]
  for (const arg of command.args) {
    parts.push(...renderArg(arg, shell))
  }
  return parts.join(' ')
}

function renderArg(arg: Arg, shell: Shell): string[] {
  if (arg.flag === null) {
    return arg.value === undefined ? [] : [quote(arg.value, shell)]
  }
  const flag = arg.flag.startsWith('-') ? arg.flag : `--${arg.flag}`
  if (arg.values !== undefined) {
    return arg.values.map((value) => `${flag} ${quote(value, shell)}`)
  }
  if (arg.value !== undefined) {
    return [`${flag} ${quote(arg.value, shell)}`]
  }
  return [flag]
}
