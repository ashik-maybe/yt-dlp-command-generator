# File ownership

One owner writes one file set. An agent never edits a file outside its set.
The orchestrator freezes `src/core/types.ts` after the contract phase.

| Owner        | Paths                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orchestrator | CONTRACT.md, OWNERS.md, design/DIRECTION.md, package.json, README.md, .github/**, .oxlintrc.json, .oxfmtrc.json, tsconfig.json, tsconfig.app.json, vitest.config.ts |
| S1 spec      | tools/spec-compiler/**, src/spec/**, scripts/spec-check.mjs                                                                                                         |
| S2 core      | src/core/**                                                                                                                                                         |
| S3 validator | src/data/rules.*.json                                                                                                                                               |
| S4 recipes   | src/recipes/**, src/data/recipes*.json                                                                                                                              |
| S5 runner    | src/runner/**                                                                                                                                                       |
| S6 tools     | src/tools/**                                                                                                                                                        |
| S7 progress  | src/progress/**                                                                                                                                                     |
| B1 TUI       | src/tui/**, tests/tui/**                                                                                                                                            |
| B2 scripts   | scripts/package-tui.sh, scripts/readme-check.mjs, scripts/design-lint.mjs                                                                                           |
| T1 tests     | tests/conformance/**, tests/core/**, tests/golden/**, tests/runtime/**                                                                                              |

Shared import rule: an agent may import a file from another owner. An agent may not edit that file.
