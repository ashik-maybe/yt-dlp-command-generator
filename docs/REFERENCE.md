# Reference

## Coverage

The spec pins `yt-dlp` version 2026.11.23.
Counts come from the checked files.

| Item                 | Count |
| -------------------- | ----: |
| Options in the spec  |   250 |
| Options with aliases |    23 |
| Deprecated flags     |    89 |
| README-only flags    |     0 |
| Recipes              |    48 |
| High-value recipes   |    16 |
| High-value groups    |     4 |

`bun run spec:check` reports the counts.
It verifies the pinned version and the help file hash.

## Recipes

The app ships 48 recipes.
The loader merges seven files and removes duplicate ids.

### Formats and quality

- `best-video`: Use `bestvideo+bestaudio/best`.
- `format-1080p`: Download at 1080p.
- `format-4k`: Download at 4K.
- `format-sort`: Sort formats by `res,fps`.
- `format-sort-small`: Sort formats by `+size,+br,+res,+fps`.
- `list-formats`: List available formats.
- `match-filters`: Filter matches with `!is_live`.

### Audio

- `audio-mp3`: Extract audio as MP3.
- `audio-flac`: Extract audio as FLAC.

### Playlists and archives

- `playlist-range`: Download items 1 to 10.
- `archive-resume`: Use `archive.txt` and continue downloads.
- `archive-skip`: Use `archive.txt` and skip archived items.
- `playlist-reverse`: Reverse a playlist.

### Subtitles

- `embed-subs`: Write and embed subtitles.
- `subtitles-only`: Skip the video and write subtitles.

### Metadata and chapters

- `metadata-chapters`: Embed metadata and chapters.
- `chapters`: Embed chapters.
- `metadata-only`: Write info JSON and skip the download.
- `parse-metadata`: Parse metadata with `<FROM>:<TO>`.
- `split-chapters`: Split chapters with a template.
- `load-info-json`: Load an info JSON file.

### Clips and sections

- `clip-by-section`: Clip from 00:10:00 to 00:20:00.
- `force-keyframes-at-cuts`: Force keyframes at section cuts.

### Thumbnails and cleanup

- `thumbnail`: Embed a thumbnail.
- `thumbnails-embed`: Embed thumbnails.
- `sponsorblock`: Remove sponsor segments.
- `sponsorblock-all`: Remove all listed SponsorBlock categories.

### Network and access

- `cookies`: Use a cookies file.
- `cookies-browser`: Use cookies from a browser.
- `geo-bypass`: Use an `xff` value of `default`.
- `impersonate`: Impersonate the `chrome` client.
- `js-runtimes`: Add a JavaScript runtime.
- `use-extractors`: Limit extractors to `youtube`.
- `extractor-args`: Pass arguments to an extractor.

### Rate, retries, and timing

- `limit-rate`: Limit the download rate.
- `retries`: Set the retry count.
- `throttled-rate`: Set a throttled rate of `100K`.
- `concurrent-fragments`: Download four fragments at once.
- `sleep`: Sleep two seconds between requests.
- `sleep-jitter`: Sleep 10 to 20 seconds with jitter.

### Output and commands

- `output-template`: Set a custom output template.
- `template-playlist`: Use a playlist output template.
- `template-chapter`: Use a chapter output template.
- `stdout-pipe`: Write the output to stdout.
- `print-json`: Print metadata as JSON.
- `exec`: Run a command after the download.
- `exec-guarded`: Run a guarded command after move.
- `batch-file`: Read URLs from a batch file.

## High-value groups

The TUI shows four high-value groups.
Each group holds four recipes.

Select:

- `list-formats`: List formats.
- `match-filters`: Filter matches.
- `format-sort-small`: Sort formats by size.
- `use-extractors`: Limit extractors.

Metadata:

- `parse-metadata`: Parse metadata.
- `split-chapters`: Split chapters.
- `force-keyframes-at-cuts`: Force keyframes at cuts.
- `load-info-json`: Load info JSON.

Network:

- `impersonate`: Impersonate a client.
- `concurrent-fragments`: Download fragments concurrently.
- `throttled-rate`: Set a throttled rate.
- `sleep-jitter`: Add a sleep interval.

Output:

- `template-playlist`: Set a playlist template.
- `template-chapter`: Set a chapter template.
- `stdout-pipe`: Write to stdout.
- `exec-guarded`: Run a command after move.

## High-value examples

Examples use the `--flag value` form.

Format sorting:

```sh
yt-dlp --format-sort "+size,+br,+res,+fps" URL
yt-dlp --format-sort "res,fps" URL
```

The first command prefers small files.
The second command sorts by resolution and frame rate.

Match filters:

```sh
yt-dlp --match-filters "!is_live" URL
```

This command skips live streams.

Metadata parsing:

```sh
yt-dlp --parse-metadata "<FROM>:<TO>" URL
```

This command rewrites one metadata field into another.

Chapters:

```sh
yt-dlp --split-chapters --output "chapter:<TEMPLATE>" URL
yt-dlp --embed-chapters URL
```

Sections:

```sh
yt-dlp --download-sections "*00:10:00-00:20:00" URL
yt-dlp --force-keyframes-at-cuts --download-sections "*<START>-<END>" URL
```

## Raw snippets

- `--match-filters "!is_live"`
- `--format-sort "+size,+br,+res,+fps"`
- `--parse-metadata "<FROM>:<TO>"`
- `--extractor-args "<IE_KEY>:<ARGS>"`
- `--exec "<CMD>"`
- `--download-sections "*00:00-01:00"`

The exec snippet carries a warning.
It runs a command.
Review it before use.
