import type { Command, Shell } from '../types.ts'

export function render(command: Command, shell: Shell): string {
  void command
  void shell
  throw new Error('NotImplemented: render')
}
