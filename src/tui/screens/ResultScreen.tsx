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
}

/** Screen for command output and findings. */
export function ResultScreen({ command, findings, version, running }: ResultScreenProps) {
  return (
    <Box flexDirection="column">
      <StatusBar label="Result" value={running ? 'running' : 'ready'} />
      <Box flexDirection="column" marginTop={1}>
        <Text>Version: {version}</Text>
        <Text>Command:</Text>
        <Text>{command}</Text>
      </Box>
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
      <Box marginTop={1}>
        <KeyHint hints={[{ key: 'q', action: 'quit' }]} />
      </Box>
    </Box>
  )
}
