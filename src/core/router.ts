import type { Route } from './types.ts'

export function parseHash(hash: string): Route {
  void hash
  throw new Error('NotImplemented: parseHash')
}

export function buildHash(route: Route): string {
  void route
  throw new Error('NotImplemented: buildHash')
}
