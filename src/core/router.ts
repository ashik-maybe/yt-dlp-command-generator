import type { Route } from './types.ts'

/** Read a shareable state from the URL hash. */
export function parseHash(hash: string): Route {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const recipeId = params.get('recipe') ?? undefined
  const screen = params.get('screen')
  if (screen === 'recipes' || screen === 'generate') {
    return { screen, ...(recipeId ? { recipeId } : {}) }
  }
  return { screen: 'home', ...(recipeId ? { recipeId, screen: 'generate' as const } : {}) }
}

/** Write a shareable state to the URL hash. */
export function buildHash(route: Route): string {
  const params = new URLSearchParams()
  params.set('screen', route.screen)
  if (route.recipeId) params.set('recipe', route.recipeId)
  return `#${params.toString()}`
}
