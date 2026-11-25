import { Box, Text } from 'ink'
import { theme } from '../theme.ts'

export interface HelpOverlayProps {
  /** Called to close overlay; handled by parent input. */
  onClose?: () => void
}

const KEYS: Array<{ key: string; action: string }> = [
  { key: 'Up/Down', action: 'move or focus' },
  { key: 'Left/Right', action: 'change quality' },
  { key: 'Enter', action: 'select or continue' },
  { key: 'Type', action: 'edit field value' },
  { key: 'Backspace', action: 'delete character' },
  { key: 'r', action: 'run command when enabled' },
  { key: 'q', action: 'quit from result' },
  { key: '?', action: 'toggle help' },
  { key: 'Esc', action: 'close help' },
  { key: 'Ctrl+C', action: 'quit immediately' },
]

/** Help overlay listing key bindings. */
export function HelpOverlay(_props: HelpOverlayProps) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor={theme.muted} paddingX={1}>
      <Text color={theme.accent}>Help</Text>
      {KEYS.map((item) => (
        <Text key={`${item.key}-${item.action}`}>
          <Text color={theme.accent}>{item.key}</Text>
          <Text>{`: ${item.action}`}</Text>
        </Text>
      ))}
      <Text color={theme.muted}>Press ? or Esc to close help.</Text>
    </Box>
  )
}
