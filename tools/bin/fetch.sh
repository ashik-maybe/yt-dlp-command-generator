#!/usr/bin/env bash
# Download the pinned tools into tools/bin/ and verify sha256 against tools/bin/CHECKSUMS.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p tools/bin

# yt-dlp (pinned by tools/SOURCES.md)
curl -fsSL "https://github.com/yt-dlp/yt-dlp/releases/download/2026.11.23/yt-dlp" -o tools/bin/yt-dlp
chmod +x tools/bin/yt-dlp

# FFmpeg static build (pinned by tools/SOURCES.md)
# Blocker: no static build of the pinned version was found in the sources checked.
FFMPEG_URL="${FFMPEG_URL:-}"
if [ -z "$FFMPEG_URL" ]; then
	echo "BLOCKER: no static FFmpeg 9.1 build URL is pinned. See tools/SOURCES.md." >&2
	exit 1
fi
curl -fsSL "$FFMPEG_URL" -o tools/bin/ffmpeg
chmod +x tools/bin/ffmpeg

# Verify both tools against tools/bin/CHECKSUMS.
ok=1
while read -r name expected; do
	[ -n "$name" ] || continue
	actual=$(sha256sum "tools/bin/$name" | cut -d' ' -f1)
	if [ "$actual" = "$expected" ]; then
		echo "OK   $name  $actual"
	else
		echo "FAIL $name  expected=$expected  actual=$actual"
		ok=0
	fi
done <tools/bin/CHECKSUMS
[ "$ok" = "1" ] || exit 1
