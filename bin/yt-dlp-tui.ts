import { run } from '../src/tui/run.ts'

const result = run(process.argv.slice(2))
if (result.code !== 0) {
  process.exit(result.code)
}
