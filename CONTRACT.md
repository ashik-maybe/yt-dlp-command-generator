# P1 contract: yt-dlp command generator

Contract for phase P1. Defines every core type, every interface, the error
codes, and the invariants. `src/core/types.ts` is frozen after this phase.

## Types

All types are pure. They live in `src/core/types.ts`. This file has no
runtime exports.

### Shell

The shell a command is rendered for. Values: `posix`, `powershell`, `cmd`.

### Severity

Values: `error`, `warning`, `info`, `debug`.

### Confidence

Values: `verified`, `validated`, `unverified`.

### Arg

One argument of a `Command` or a `Plan`.

| Field    | Type                  | Meaning                                                |
| -------- | --------------------- | ------------------------------------------------------ |
| `flag`   | string or null        | Flag name without leading dashes. Null for an operand. |
| `value`  | string, optional      | Value bound to the flag or operand.                    |
| `alias`  | string, optional      | Alias the recipe selects, when the spec offers one.    |
| `anchor` | string, optional      | Doc anchor of the flag, from the spec.                 |
| `values` | string list, optional | Repeated values for repeatable flags.                  |

### Command

| Field     | Type    | Meaning                                |
| --------- | ------- | -------------------------------------- |
| `program` | string  | Executable name, for example `yt-dlp`. |
| `args`    | `Arg[]` | Ordered arguments of the command.      |
| `shell`   | `Shell` | Shell the command renders for.         |

### Plan

A recipe plus the user values.

| Field        | Type         |
| ------------ | ------------ |
| `tool`       | string       |
| `args`       | `Arg[]`      |
| `shell`      | `Shell`      |
| `confidence` | `Confidence` |

### Finding

A review item.

| Field      | Type             |
| ---------- | ---------------- |
| `severity` | `Severity`       |
| `code`     | string           |
| `message`  | string           |
| `location` | string, optional |
| `fix`      | string, optional |

### Recipe

A typed scenario. Maps one user goal to IR arguments.

| Field        | Type         |
| ------------ | ------------ |
| `id`         | string       |
| `name`       | string       |
| `args`       | `Arg[]`      |
| `confidence` | `Confidence` |

### OptionSpec

One option of a tool.

| Field       | Type                  |
| ----------- | --------------------- |
| `flag`      | string                |
| `metavar`   | string, optional      |
| `choices`   | string list, optional |
| `default`   | string, optional      |
| `anchor`    | string, optional      |
| `isBoolean` | boolean, optional     |

### ToolSpec

The pinned spec of one tool version.

| Field           | Type             |
| --------------- | ---------------- |
| `name`          | string           |
| `version`       | string           |
| `pinnedVersion` | string           |
| `options`       | `OptionSpec[]`   |
| `deprecated`    | string list      |
| `helpFile`      | string, optional |

### Route

One screen of the app.

| Field      | Type                             |
| ---------- | -------------------------------- |
| `screen`   | `home`, `recipes`, or `generate` |
| `recipeId` | string, optional                 |

## Interfaces

### `render(command: Command, shell: Shell): string`

`src/core/render/index.ts`. Renders one command to text for one shell.

### `quote(value: string, shell: Shell): string`

`src/core/render/quote.ts`. Quotes one value for one shell.

### `validate(plan: Plan, spec: ToolSpec): Finding[]`

`src/core/validate/index.ts`. Returns findings for one plan.

### `planFromRecipe(recipe: Recipe, values: Record<string, string>): Plan`

`src/core/plan.ts`. Builds a plan from one recipe and user values.

### `parseHash(hash: string): Route`

`src/core/router.ts`. Turns app route text into a route.

### `buildHash(route: Route): string`

`src/core/router.ts`. Turns a route into app route text.

### `src/core/index.ts`

Re-exports the public API: every type above and the five functions.

## Error codes

Stub errors. Each stub throws exactly `Error('NotImplemented: <name>')`.

| Code                             | Meaning        |
| -------------------------------- | -------------- |
| `NotImplemented: quote`          | Quote stub.    |
| `NotImplemented: render`         | Render stub.   |
| `NotImplemented: validate`       | Validate stub. |
| `NotImplemented: planFromRecipe` | Plan stub.     |
| `NotImplemented: parseHash`      | Route stub.    |
| `NotImplemented: buildHash`      | Route stub.    |

Validation finding codes. `validate` returns these codes in findings.

| Code                   | Meaning                                          |
| ---------------------- | ------------------------------------------------ |
| `UNKNOWN_FLAG`         | The plan emits a flag the spec does not list.    |
| `MISSING_REQUIRED`     | The plan drops a required flag the spec lists.   |
| `REQUIRES_UNSATISFIED` | A requires chain is not satisfied.               |
| `CONFLICT`             | Two plan flags conflict per the spec.            |
| `UNSUPPORTED`          | The plan uses a flag the spec marks unsupported. |
| `DEPRECATED_FLAG`      | The plan uses a flag the spec marks deprecated.  |

## Invariants

1. `src/core/types.ts` exports types only. No runtime code.
2. Every stub throws `Error('NotImplemented: <name>')`.
3. `validate` returns a finding list. It never throws on a bad plan.
4. Every emitted flag exists in the pinned spec. This is the T1 check.
5. Arg values are strings. Boolean flags carry no value.
6. Renders are pure. Same command and shell give the same string.
7. The three shells are the complete `Shell` union. All three render.
