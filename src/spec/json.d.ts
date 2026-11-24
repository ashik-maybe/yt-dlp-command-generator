/**
 * Ambient wildcard module so the spec JSONs import under tsconfig.app.json,
 * which does not enable resolveJsonModule.
 */
declare module '*.json' {
  const value: unknown
  export default value
}
