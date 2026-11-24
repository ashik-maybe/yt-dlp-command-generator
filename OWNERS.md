# File ownership

One owner writes one file set. An agent never edits a file outside its set.
The orchestrator freezes `src/core/types.ts` after P1.

| Owner            | Paths                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| orchestrator     | CONTRACT.md, OWNERS.md, design/DIRECTION.md, package.json, vite.config.ts, README.md, .github/**, .oxlintrc.json, .oxfmtrc.json |
| S1 spec compiler | tools/spec-compiler/**, src/spec/**, scripts/spec-check.mjs                                                                     |
| S2 renderer      | src/core/render/**                                                                                                              |
| S3 validator     | src/core/validate/**, src/data/rules.*.json                                                                                     |
| S4 recipes       | src/recipes/**, src/data/recipes.json                                                                                           |
| S5 styles        | src/styles/**, src/ui/primitives/**                                                                                             |
| S6 content       | src/content/**                                                                                                                  |
| B1 outcomes      | src/ui/outcomes/**                                                                                                              |
| B2 moment        | src/ui/moment/**                                                                                                                |
| B3 receipt       | src/ui/receipt/**                                                                                                               |
| B4 handoff       | src/ui/handoff/**                                                                                                               |
| B5 calibration   | src/ui/calibration/**                                                                                                           |
| B6 advanced      | src/ui/advanced/**                                                                                                              |
| T1 conformance   | tests/conformance/**, tests/core/**                                                                                             |
| T2 golden        | tests/golden/**                                                                                                                 |
| T3 runtime       | tests/runtime/**                                                                                                                |
| T4 e2e           | tests/e2e/**, playwright.config.ts                                                                                              |

Shared import rule: an agent may import a file from another owner. An agent may not edit that file.
