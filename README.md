# yt-dlp wrapper

The TUI builds `yt-dlp` commands from guided inputs.
It helps users who do not want to memorize flags.

## Install

Download the Linux x64 or arm64 binary from the releases.
Or install dependencies from source:

```sh
bun install --frozen-lockfile
```

## Quick start

Run one of these commands:

```sh
bun run tui
bun run tui --run
bun run tui --run --yes
```

The first command starts the TUI without execution.
The second command allows execution with confirmation.
The third command executes without confirmation.

## How it works

Pick a task, enter input, review the command, then run it if you want.
The TUI shows six curated tasks: Download video, Audio only, List formats, Subtitles, Playlist, and Clip a section.
Use More tasks to search all available recipes.
The default mode never executes a command.

## Keys

| Key          | Screen  | Action                                         |
| ------------ | ------- | ---------------------------------------------- |
| `Up/Down`    | Options | Move focus between fields.                     |
| `Left/Right` | Options | Change quality.                                |
| `Type`       | Options | Edit the focused field.                        |
| `Enter`      | Options | Open the result screen.                        |
| `r`          | Result  | Start the run in `--run` mode without `--yes`. |
| `q`          | Result  | Quit.                                          |
| `Ctrl+C`     | Any     | Abort a running command and exit.              |

## Flags

| Flag        | Effect                                         |
| ----------- | ---------------------------------------------- |
| `--version` | Print the TUI version and exit.                |
| `--help`    | Print usage and exit.                          |
| `--run`     | Allow command execution. Off by default.       |
| `--yes`     | Skip the confirmation prompt before execution. |
| `--force`   | Allow overwrite of an existing output file.    |
| `--unsafe`  | Allow unsafe recipes and unsafe raw flags.     |

## Safety

The TUI does not execute commands by default.
It blocks overwrite of an existing output file unless you pass `--force`.
It blocks unsafe recipes and unsafe raw flags unless you pass `--unsafe`.
It binds placeholders before execution and blocks unbound placeholders.
It verifies output after a successful run.

## Limits

The TUI runs on Linux only.
The spec reflects one pinned `yt-dlp` help snapshot.
Raw arguments have no guarantee of correctness.
Flag combinations have no guarantee of working together.
The app does not guarantee a successful download.

## Development

Repository layout:

- `bin/`: TUI entry point.
- `src/`: core, recipes, spec, tools, and TUI code.
- `tests/`: unit and TUI tests.
- `scripts/`: checks and packaging scripts.
- `docs/`: reference documentation.

To add a task, add or update a recipe in `src/data/` and keep it in the recipe loader.

Test and build commands:

```sh
bun run ci
bun run tui:test
bun run tui:build
bash scripts/package-tui.sh
```

See [docs/REFERENCE.md](docs/REFERENCE.md) for coverage, recipes, and examples.
