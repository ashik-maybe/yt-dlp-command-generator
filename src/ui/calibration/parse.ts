/** Typed row parsed from `yt-dlp -F` output. */
export interface FormatRow {
  /** Format ID from the table, e.g. `137` or `137-3`. */
  readonly formatId: string
  /** File extension, e.g. `mp4` or `m4a`. */
  readonly ext: string
  /** Resolution from the table, e.g. `1920x1080`. Null when the table has none. */
  readonly resolution: string | null
  /** Protocol from the table, e.g. `https` or `hls`. Null when the table has none. */
  readonly protocol: string | null
}

/** Outcome of parsing pasted tool output. */
export type ParseResult =
  | { readonly ok: true; readonly version: string | null; readonly rows: FormatRow[] }
  | { readonly ok: false; readonly error: string }

const HEADER_RE = /^ID\b/i
const VERSION_RE = /^yt-dlp\s+v?(\d+\.\d+\.\d+[^\s]*)/i
const RESOLUTION_RE = /^\d{3,5}x\d{3,5}$/
const AUDIO_RE = /^audio$/i
const PROTOCOL_RE = /^(https?|hls[a-z0-9_-]*|m3u8|dash|direct|ftps?|rtmp[a-z]*|tcp|udp|ipv[46])$/i

/**
 * Parse pasted `yt-dlp -F` table output or `yt-dlp --version` text.
 * Pure string parsing: never fetches or opens any network resource.
 */
export function parseToolOutput(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')

  if (lines.length === 0) {
    return { ok: false, error: 'Paste a `yt-dlp -F` table or a `yt-dlp --version` line.' }
  }

  const headerIndex = lines.findIndex((line) => HEADER_RE.test(line))
  if (headerIndex !== -1) {
    const rows = lines
      .slice(headerIndex + 1)
      .map(parseRow)
      .filter((row): row is FormatRow => row !== null)
    if (rows.length > 0) {
      return { ok: true, version: null, rows }
    }
  }

  const version = findVersion(lines)
  if (version !== null) {
    return { ok: true, version, rows: [] }
  }

  return {
    ok: false,
    error: 'No formats found. Paste a `yt-dlp -F` table or a `yt-dlp --version` line.',
  }
}

function findVersion(lines: string[]): string | null {
  for (const line of lines) {
    const match = VERSION_RE.exec(line)
    if (match !== null) return match[1]
  }
  return null
}

function parseRow(line: string): FormatRow | null {
  const tokens = line.split(/\s+/).filter((token) => token !== '')
  if (tokens.length < 2) return null
  const [formatId, ext] = tokens
  const rest = tokens.slice(2)
  return {
    formatId,
    ext,
    resolution: extractResolution(rest),
    protocol: extractProtocol(rest),
  }
}

function extractResolution(rest: string[]): string | null {
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i]
    if (RESOLUTION_RE.test(token)) return token
    if (AUDIO_RE.test(token)) {
      return rest[i + 1]?.toLowerCase() === 'only' ? 'audio only' : token
    }
  }
  return null
}

function extractProtocol(rest: string[]): string | null {
  for (const token of rest) {
    const match = PROTOCOL_RE.exec(token)
    if (match !== null) return match[0].toLowerCase()
  }
  return null
}
