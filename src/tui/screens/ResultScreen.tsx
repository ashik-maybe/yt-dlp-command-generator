import { Box, Text } from 'ink'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'

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
}

/** Screen for command output and findings. */
export function ResultScreen({
  command,
  findings,
  version,
  running,
  progressPercent,
  progressSpeed,
  rawLog,
  verification,
  blockedReason,
}: ResultScreenProps) {
  const hasProgress = progressPercent !== undefined || progressSpeed !== undefined
  return (
    <Box flexDirection="column">
      <StatusBar label="Result" value={running ? 'running' : 'ready'} />
      <Box flexDirection="column" marginTop={1}>
        <Text>Version: {version}</Text>
        <Text>Command:</Text>
        <Text>{command}</Text>
      </Box>
      {verification ? (
        <Box flexDirection="column" marginTop={1}>
          <Text>Verification: {verification}</Text>
          {blockedReason ? <Text>{blockedReason}</Text> : null}
        </Box>
      ) : null}
      {hasProgress ? (
        <Box flexDirection="column" marginTop={1}>
          <Text>Progress:</Text>
          <Text>
            {'  '}percent: {progressPercent ?? 'unknown'}
          </Text>
          <Text>
            {'  '}speed: {progressSpeed ?? 'unknown'}
          </Text>
        </Box>
      ) : null}
      <Box flexDirection="column" marginTop={1}>
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
      {rawLog !== undefined ? (
        <Box flexDirection="column" marginTop={1}>
          <Text>Raw log:</Text>
          <Text>{rawLog.length > 0 ? rawLog : ' (empty)'}</Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <KeyHint hints={[{ key: 'q', action: 'quit' }]} />
      </Box>
    </Box>
  )
}
