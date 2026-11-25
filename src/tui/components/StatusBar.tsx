import { Box, Text } from 'ink'

export interface StatusBarProps {
  /** Left side label. */
  label: string
  /** Optional right side value. */
  value?: string
}

/** Simple ASCII status bar. */
export function StatusBar({ label, value }: StatusBarProps) {
  return (
    <Box>
      <Text>
        [{label}]{value ? ` ${value}` : ''}
      </Text>
    </Box>
  )
}
