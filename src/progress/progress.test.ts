import { describe, expect, test } from 'vitest'
import { latestProgressFromLines, parseProgressLine, type ProgressUpdate } from './index.ts'

describe('parseProgressLine', () => {
  test('parses a standard download progress line', () => {
    const line = '[download]   0.0% of 10.00MiB at 500.00KiB/s ETA 00:20'
    expect(parseProgressLine(line)).toEqual<ProgressUpdate>({
      percent: 0,
      downloadedBytes: 0,
      totalBytes: 10_485_760,
      speed: '500.00KiB/s',
      eta: '00:20',
      destination: null,
      raw: line,
    })
  })

  test('parses a mid-download progress line with approximate total', () => {
    const line = '[download]  45.3% of ~50.00MiB at   2.50MiB/s ETA 00:11'
    const update = parseProgressLine(line)
    expect(update).not.toBeNull()
    expect(update?.percent).toBe(45.3)
    expect(update?.totalBytes).toBe(52_428_800)
    expect(update?.downloadedBytes).toBe(Math.round((45.3 / 100) * 52_428_800))
    expect(update?.speed).toBe('2.50MiB/s')
    expect(update?.eta).toBe('00:11')
    expect(update?.destination).toBeNull()
  })

  test('parses a completed download line', () => {
    const line = '[download] 100% of 50.00MiB in 00:20'
    expect(parseProgressLine(line)).toEqual<ProgressUpdate>({
      percent: 100,
      downloadedBytes: 52_428_800,
      totalBytes: 52_428_800,
      speed: null,
      eta: '00:00',
      destination: null,
      raw: line,
    })
  })

  test('parses a completed download line with speed', () => {
    const line = '[download] 100% of 10.00MiB in 00:05 at 2.00MiB/s'
    const update = parseProgressLine(line)
    expect(update).not.toBeNull()
    expect(update?.percent).toBe(100)
    expect(update?.speed).toBe('2.00MiB/s')
    expect(update?.totalBytes).toBe(10_485_760)
  })

  test('parses destination lines', () => {
    const line = '[download] Destination: My Video [abc123].mp4'
    expect(parseProgressLine(line)).toEqual<ProgressUpdate>({
      percent: null,
      downloadedBytes: null,
      totalBytes: null,
      speed: null,
      eta: null,
      destination: 'My Video [abc123].mp4',
      raw: line,
    })
  })

  test('parses already-downloaded lines', () => {
    const line = '[download] My Video.mp4 has already been downloaded'
    expect(parseProgressLine(line)).toEqual<ProgressUpdate>({
      percent: 100,
      downloadedBytes: null,
      totalBytes: null,
      speed: null,
      eta: null,
      destination: 'My Video.mp4',
      raw: line,
    })
  })

  test('parses progress with unknown total', () => {
    const line = '[download]    1.2MiB at 500.00KiB/s ETA Unknown'
    const update = parseProgressLine(line)
    expect(update).not.toBeNull()
    expect(update?.percent).toBeNull()
    expect(update?.downloadedBytes).toBe(1_258_291)
    expect(update?.totalBytes).toBeNull()
    expect(update?.speed).toBe('500.00KiB/s')
    expect(update?.eta).toBeNull()
  })

  test('handles carriage-return updates', () => {
    const line = '\r[download]  45.3% of 50.00MiB at 2.50MiB/s ETA 00:11'
    const update = parseProgressLine(line)
    expect(update).not.toBeNull()
    expect(update?.percent).toBe(45.3)
    expect(update?.raw).toBe('[download]  45.3% of 50.00MiB at 2.50MiB/s ETA 00:11')
  })

  test('handles unknown speed and eta', () => {
    const line = '[download]   0.0% of 10.00MiB at Unknown speed ETA Unknown'
    const update = parseProgressLine(line)
    expect(update).not.toBeNull()
    expect(update?.percent).toBe(0)
    expect(update?.speed).toBeNull()
    expect(update?.eta).toBeNull()
  })

  test('returns null for unknown lines', () => {
    expect(parseProgressLine('[info] Downloading 1 format(s): 137+140')).toBeNull()
    expect(parseProgressLine('')).toBeNull()
    expect(parseProgressLine('not a progress line')).toBeNull()
  })

  test('never throws on malformed input', () => {
    const badInputs = [
      '[download] % of MiB at /s ETA',
      '[download] NaN% of 10.00MiB at 1.00MiB/s ETA 00:01',
      '[download] 50% of ???MiB at 1.00MiB/s ETA 00:01',
      '\0\0\0',
      '[download]',
    ]
    for (const input of badInputs) {
      expect(() => parseProgressLine(input)).not.toThrow()
      const result = parseProgressLine(input)
      expect(result === null || typeof result === 'object').toBe(true)
    }
  })
})

describe('latestProgressFromLines', () => {
  test('returns the latest parsed update from a stream of lines', () => {
    const lines = [
      '[info] Downloading 1 format(s): 137+140',
      '[download] Destination: video.mp4',
      '[download]   0.0% of 10.00MiB at 500.00KiB/s ETA 00:20',
      '[download]  50.0% of 10.00MiB at 1.00MiB/s ETA 00:05',
      '[info] some other line',
      '[download] 100% of 10.00MiB in 00:10',
    ]
    const update = latestProgressFromLines(lines)
    expect(update).not.toBeNull()
    expect(update?.percent).toBe(100)
  })

  test('returns null when no progress lines exist', () => {
    expect(latestProgressFromLines(['[info] hello', 'plain text'])).toBeNull()
  })

  test('handles carriage-return separated updates in lines', () => {
    const lines = [
      '\r[download]   1.0% of 10.00MiB at 1.00MiB/s ETA 00:10',
      '\r[download]   2.0% of 10.00MiB at 1.00MiB/s ETA 00:09',
    ]
    const update = latestProgressFromLines(lines)
    expect(update?.percent).toBe(2)
  })

  test('never throws on malformed stream', () => {
    expect(() => latestProgressFromLines(['', '\0', '[download] garbage'])).not.toThrow()
  })
})
