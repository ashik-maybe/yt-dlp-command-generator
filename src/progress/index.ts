export interface ProgressUpdate {
  percent: number | null
  downloadedBytes: number | null
  totalBytes: number | null
  speed: string | null
  eta: string | null
  destination: string | null
  raw: string
}

const BYTE_UNITS: Record<string, number> = {
  B: 1,
  KiB: 1024,
  MiB: 1024 ** 2,
  GiB: 1024 ** 3,
  TiB: 1024 ** 4,
  KB: 1000,
  kB: 1000,
  MB: 1000 ** 2,
  GB: 1000 ** 3,
  TB: 1000 ** 4,
}

function parseBytes(value: string, unit: string): number | null {
  const amount = Number.parseFloat(value)
  if (!Number.isFinite(amount)) return null
  const factor = BYTE_UNITS[unit]
  if (factor === undefined) return null
  return Math.round(amount * factor)
}

function cleanLine(line: string): string {
  return line.replace(/\r/g, '').trim()
}

function normalizeSpeed(value: string | undefined): string | null {
  if (value === undefined) return null
  if (value === 'Unknown' || value === 'Unknown speed' || value === 'N/A') return null
  return value
}

function normalizeEta(value: string | undefined): string | null {
  if (value === undefined) return null
  if (value === 'Unknown' || value === 'N/A') return null
  return value
}

const DOWNLOAD_PROGRESS_RE =
  /^\[download\]\s+(?:(\d+(?:\.\d+)?)%\s+of\s+(?:~\s*)?(\d+(?:\.\d+)?)\s*(KiB|MiB|GiB|TiB|B|KB|kB|MB|GB|TB)|(\d+(?:\.\d+)?)\s*(KiB|MiB|GiB|TiB|B|KB|kB|MB|GB|TB))(?:\s+at\s+(Unknown(?:\s+speed)?|N\/A|\S+))?(?:\s+ETA\s+(Unknown|N\/A|\S+))?(?:\s+.*)?$/

const DOWNLOAD_COMPLETE_RE =
  /^\[download\]\s+100%\s+of\s+(?:~\s*)?(\d+(?:\.\d+)?)\s*(KiB|MiB|GiB|TiB|B|KB|kB|MB|GB|TB)\s+in\s+\S+(?:\s+at\s+(Unknown(?:\s+speed)?|N\/A|\S+))?(?:\s+.*)?$/

const DESTINATION_RE = /^\[download\]\s+Destination:\s+(.+)$/

const ALREADY_DOWNLOADED_RE = /^\[download\]\s+(.+)\s+has already been downloaded$/

export function parseProgressLine(line: string): ProgressUpdate | null {
  try {
    const raw = line.replace(/\r/g, '')
    const cleaned = cleanLine(line)
    if (cleaned.length === 0) return null

    const destinationMatch = DESTINATION_RE.exec(cleaned)
    if (destinationMatch) {
      return {
        percent: null,
        downloadedBytes: null,
        totalBytes: null,
        speed: null,
        eta: null,
        destination: destinationMatch[1],
        raw,
      }
    }

    const alreadyMatch = ALREADY_DOWNLOADED_RE.exec(cleaned)
    if (alreadyMatch) {
      return {
        percent: 100,
        downloadedBytes: null,
        totalBytes: null,
        speed: null,
        eta: null,
        destination: alreadyMatch[1],
        raw,
      }
    }

    const completeMatch = DOWNLOAD_COMPLETE_RE.exec(cleaned)
    if (completeMatch) {
      const totalBytes = parseBytes(completeMatch[1], completeMatch[2])
      return {
        percent: 100,
        downloadedBytes: totalBytes,
        totalBytes,
        speed: normalizeSpeed(completeMatch[3]),
        eta: '00:00',
        destination: null,
        raw,
      }
    }

    const progressMatch = DOWNLOAD_PROGRESS_RE.exec(cleaned)
    if (progressMatch) {
      const percentValue = progressMatch[1]
      const speed = normalizeSpeed(progressMatch[6])
      const eta = normalizeEta(progressMatch[7])
      if (percentValue !== undefined) {
        const totalBytes = parseBytes(progressMatch[2], progressMatch[3])
        const percent = Number.parseFloat(percentValue)
        const downloadedBytes =
          totalBytes !== null && Number.isFinite(percent)
            ? Math.round((percent / 100) * totalBytes)
            : null
        return {
          percent: Number.isFinite(percent) ? percent : null,
          downloadedBytes,
          totalBytes,
          speed,
          eta,
          destination: null,
          raw,
        }
      }

      const downloadedBytes = parseBytes(progressMatch[4], progressMatch[5])
      return {
        percent: null,
        downloadedBytes,
        totalBytes: null,
        speed,
        eta,
        destination: null,
        raw,
      }
    }

    return null
  } catch {
    return null
  }
}

export function latestProgressFromLines(lines: Iterable<string>): ProgressUpdate | null {
  try {
    let latest: ProgressUpdate | null = null
    for (const line of lines) {
      const update = parseProgressLine(line)
      if (update !== null) {
        latest = update
      }
    }
    return latest
  } catch {
    return null
  }
}
