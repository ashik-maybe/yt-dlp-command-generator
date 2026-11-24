# yt-dlp command generator

This site turns a video link into one yt-dlp command.

The site runs in a browser. It does not download files. It does not upload data.
Copy the command and run it on your own machine.

## Commands

- `bun install` installs the dependencies.
- `bun run dev` starts the site.
- `bun run ci` runs the full gate.

## Scope

The generator aims for every documented yt-dlp option. A generated spec lists the
options. Each command records the tool version that it was checked against.

The advanced mode accepts raw arguments. The site marks raw arguments as unverified.
