import type { Arg, Command, Shell } from '../types.ts'
import { quote } from './quote.ts'

/**
 * Render rules.
 *
 * - The program is emitted first, unquoted.
 * - An Arg with a null flag is a bare operand: its value, quoted, with no
 *   dash added.
 * - An Arg with values is repeated: one `flag value` pair per value.
 * - An Arg with a value and no values emits `flag value`.
 * - An Arg with a flag and no value emits the flag name alone.
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
  if (arg.values !== undefined) {
    return arg.values.map((value) => `${arg.flag} ${quote(value, shell)}`)
  }
  if (arg.value !== undefined) {
    return [`${arg.flag} ${quote(arg.value, shell)}`]
  }
  return [arg.flag]
}
