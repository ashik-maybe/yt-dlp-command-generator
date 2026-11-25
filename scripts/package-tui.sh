#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

mkdir -p dist

if [ ! -d node_modules/react-devtools-core ]; then
	mkdir -p node_modules/react-devtools-core
	cat >node_modules/react-devtools-core/package.json <<'JSON'
{"name":"react-devtools-core","version":"0.0.0","main":"index.js"}
JSON
	cat >node_modules/react-devtools-core/index.js <<'JS'
module.exports = {};
JS
fi

bun build bin/yt-dlp-tui.ts --compile --target bun-linux-x64 --outfile dist/yt-dlp-tui-linux-x64
bun build bin/yt-dlp-tui.ts --compile --target bun-linux-arm64 --outfile dist/yt-dlp-tui-linux-arm64

for file in dist/yt-dlp-tui-linux-x64 dist/yt-dlp-tui-linux-arm64; do
	sha256sum "$file"
done
