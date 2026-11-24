import type { Shell } from '../types.ts'

export function quote(value: string, shell: Shell): string {
  void value
  void shell
  throw new Error('NotImplemented: quote')
}
