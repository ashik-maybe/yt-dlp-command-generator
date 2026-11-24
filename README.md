# yt-dlp command generator

This site builds a `yt-dlp` command from guided inputs.
It runs in the browser. It does not upload data or download files.
Copy the command and run it on your own machine.

## Pinned version

The generated spec is pinned to `yt-dlp 2026.11.23`.
The spec records that version in `src/spec/options.json`.

## Coverage

The spec contains 250 options and 0 deprecated entries parsed from the pinned help text.
This covers options present in that cached help output.
It does not prove every documented or future `yt-dlp` option is covered.
Advanced mode accepts raw arguments and marks them as unverified.

## Commands

- `bun install` installs dependencies.
- `bun run dev` starts the dev server.
- `bun run ci` runs the full gate.

The gate runs lint, format check, typecheck, design lint, tests, and build.

## Spec generation

The spec is generated from `.cache/yt-dlp-help.txt`.
Regenerate it with:

```sh
node tools/spec-compiler/generate.mjs
```

`bun run spec:check` verifies option count, flag shape, pinned version, and help SHA-256.
