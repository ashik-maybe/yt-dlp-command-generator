import { Box, Text } from 'ink'
import type { ReactNode } from 'react'
import { theme } from '../theme.ts'
import { KeyHint } from './KeyHint.tsx'
import type { KeyHintItem } from './KeyHint.tsx'
import { StatusBar } from './StatusBar.tsx'

export interface ChromeProps {
  /** Application name. */
  appName: string
  /** Detected tool version. */
  version: string
  /** Current step number. */
  step: number
  /** Total step count. */
  totalSteps: number
  /** Screen label. */
  label: string
  /** Screen value shown in status bar. */
  value?: string
  /** Footer key hints. */
  hints: readonly KeyHintItem[]
  /** Screen content. */
  children: ReactNode
}

/** Shared screen chrome with header, status, and footer hints. */
export function Chrome({
  appName,
  version,
  step,
  totalSteps,
  label,
  value,
  hints,
  children,
}: ChromeProps) {
  return (
    <Box flexDirection="column">
      <Box>
        <Text color={theme.accent}>{appName}</Text>
        <Text color={theme.muted}> v{version}</Text>
        <Text color={theme.muted}>
          {'  '}step {step} of {totalSteps}
        </Text>
      </Box>
      <StatusBar label={label} value={value} />
      <Box flexDirection="column" marginTop={1}>
        {children}
      </Box>
      <Box marginTop={1}>
        <KeyHint hints={hints} />
      </Box>
    </Box>
  )
}
