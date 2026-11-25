import type { OptionSpec } from '../../core/types.ts'
import { recipes } from '../../recipes/index.ts'
import { readmeFlags, spec } from '../../spec/index.ts'
import { Panel } from '../primitives/index.ts'
import './coverage.css'

/** Spec option with the alias field the spec compiler emits. */
type SpecOption = OptionSpec & { readonly alias?: string }

export function CoveragePanel() {
  const options = spec.options as readonly SpecOption[]
  const specFlags = new Set(options.map((option) => option.flag))
  const readmeOnly = readmeFlags.filter((flag) => !specFlags.has(flag.flag))
  const counts: ReadonlyArray<readonly [string, number]> = [
    ['Help options', options.length],
    ['Aliases', options.filter((option) => option.alias).length],
    ['Deprecated options', spec.deprecated.length],
    ['README-only flags', readmeOnly.length],
    ['Recipes', recipes.length],
  ]

  return (
    <Panel className="coverage-panel">
      <h2 className="coverage-title">Coverage</h2>
      <table className="coverage-table">
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          {counts.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="coverage-note">
        Raw arguments are unverified and downloads are not executed in the browser.
      </p>
    </Panel>
  )
}
