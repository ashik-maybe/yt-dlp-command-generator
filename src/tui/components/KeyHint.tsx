import { Box, Text } from 'ink'

export interface KeyHintItem {
  /** Key name shown to the user. */
  key: string
  /** Action description. */
  action: string
}

export interface KeyHintProps {
  /** Hints to display. */
  hints: readonly KeyHintItem[]
}

/** Simple ASCII key hint line. */
export function KeyHint({ hints }: KeyHintProps) {
  return (
    <Box>
      <Text>{hints.map((hint) => `${hint.key}: ${hint.action}`).join(' | ')}</Text>
    </Box>
  )
}
