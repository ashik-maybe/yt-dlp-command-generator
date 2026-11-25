import { Box, Text } from 'ink'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'
import { glyphs, theme } from '../theme.ts'

export interface ResultFinding {
  /** Finding severity. */
  severity: string
  /** Stable finding code. */
  code: string
  /** Human readable message. */
  message: string
}

export interface ResultScreenProps {
  /** Rendered command text. */
  command: string
  /** Validation findings. */
  findings: readonly ResultFinding[]
  /** Tool version label. */
  version: string
  /** Plain task label. */
  taskLabel?: string
  /** True while a run is active. */
  running: boolean
  /** Latest parsed progress percent. */
  progressPercent?: number | null
  /** Latest parsed progress speed. */
  progressSpeed?: string | null
  /** Raw process output log. */
  rawLog?: string
  /** Output verification or blocking status. */
  verification?: 'verified' | 'failed' | 'blocked' | null
  /** Reason shown when execution is blocked. */
  blockedReason?: string | null
  /** Hide internal chrome when wrapped by App. */
  embedded?: boolean
  /** Hide raw log and shorten hints for narrow terminals. */
  narrow?: boolean
}

export const RESULT_HINTS = [
  { key: 'q', action: 'quit' },
  { key: '?', action: 'help' },
] as const

export const RESULT_HINTS_NARROW = [
  { key: 'q', action: 'quit' },
  { key: '?', action: 'help' },
] as const

function progressBar(percent: number | null | undefined): string {
  if (percent === null || percent === undefined || Number.isNaN(percent)) {
    return `[${glyphs.barEmpty.repeat(10)}] --%`
  }
  const clamped = Math.max(0, Math.min(100, percent))
  const width = 10
  const filled = Math.round((clamped / 100) * width)
  const empty = width - filled
  return `[${glyphs.barFill.repeat(filled)}${glyphs.barEmpty.repeat(empty)}] ${Math.round(clamped)}%`
}

/** Screen for command output and findings. */
export function ResultScreen({
  command,
  findings,
  version,
  taskLabel,
  running,
  progressPercent,
  progressSpeed,
  rawLog,
  verification,
  blockedReason,
  embedded = false,
  narrow = false,
}: ResultScreenProps) {
  const hasProgress = progressPercent !== undefined || progressSpeed !== undefined
  const status = running ? 'running' : 'ready'
  const verificationColor =
    verification === 'verified'
      ? theme.success
      : verification === 'failed' || verification === 'blocked'
        ? theme.error
        : undefined
  const showRawLog = rawLog !== undefined && !narrow
  const hints = narrow ? [...RESULT_HINTS_NARROW] : [...RESULT_HINTS]

  const body = (
    <Box flexDirection="column">
      <Box flexDirection="column" marginTop={embedded ? 0 : 1}>
        {taskLabel ? <Text>Task: {taskLabel}</Text> : null}
        <Text>Version: {version}</Text>
        <Text>Command:</Text>
        <Text wrap="wrap">{command}</Text>
      </Box>
      {verification ? (
        <Box flexDirection="column" marginTop={1}>
          <Text color={verificationColor}>Verification: {verification}</Text>
          {blockedReason ? <Text color={theme.error}>{blockedReason}</Text> : null}
        </Box>
      ) : null}
      {hasProgress ? (
        <Box flexDirection="column" marginTop={1}>
          <Text>Progress:</Text>
          <Text>{`  ${progressBar(progressPercent)}`}</Text>
          <Text>
            {'  '}percent: {progressPercent ?? 'unknown'}
          </Text>
          <Text>
            {'  '}speed: {progressSpeed ?? 'unknown'}
          </Text>
        </Box>
      ) : null}
      <Box flexDirection="column" marginTop={1}>
        <Text>Checks:</Text>
        <Text>Findings:</Text>
        {findings.length === 0 ? (
          <Text> none</Text>
        ) : (
          findings.map((finding, index) => (
            <Text key={`${finding.code}-${index}`}>
              - [{finding.severity}] {finding.code}: {finding.message}
            </Text>
          ))
        )}
      </Box>
      {showRawLog ? (
        <Box flexDirection="column" marginTop={1}>
          <Text>Raw log:</Text>
          <Text wrap="wrap">{rawLog.length > 0 ? rawLog : ' (empty)'}</Text>
        </Box>
      ) : null}
    </Box>
  )

  if (embedded) return body

  return (
    <Box flexDirection="column">
      <StatusBar label="Result" value={status} />
      {body}
      <Box marginTop={1}>
        <KeyHint hints={hints} />
      </Box>
    </Box>
  )
}
