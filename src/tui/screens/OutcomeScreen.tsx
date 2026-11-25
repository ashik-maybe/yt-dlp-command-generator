import { Box, Text, useInput } from 'ink'
import { useRef, useState } from 'react'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'

export interface OutcomeItem {
  /** Stable outcome id. */
  id: string
  /** Display name. */
  name: string
}

export interface OutcomeScreenProps {
  /** Available outcomes. */
  outcomes: readonly OutcomeItem[]
  /** Currently selected outcome id. */
  selectedId: string
  /** Called when the user selects an outcome. */
  onSelect: (id: string) => void
}

/** Screen for choosing an outcome. */
export function OutcomeScreen({ outcomes, selectedId, onSelect }: OutcomeScreenProps) {
  const initialIndex = Math.max(
    0,
    outcomes.findIndex((outcome) => outcome.id === selectedId),
  )
  const [index, setIndex] = useState(initialIndex)
  const indexRef = useRef(initialIndex)

  useInput((_input, key) => {
    if (outcomes.length === 0) return
    if (key.upArrow) {
      const nextIndex = (indexRef.current - 1 + outcomes.length) % outcomes.length
      indexRef.current = nextIndex
      setIndex(nextIndex)
    }
    if (key.downArrow) {
      const nextIndex = (indexRef.current + 1) % outcomes.length
      indexRef.current = nextIndex
      setIndex(nextIndex)
    }
    if (key.return) {
      const outcome = outcomes[indexRef.current]
      if (outcome) onSelect(outcome.id)
    }
  })

  return (
    <Box flexDirection="column">
      <StatusBar label="Outcome" value={`${outcomes.length} options`} />
      <Box flexDirection="column" marginTop={1}>
        {outcomes.map((outcome, itemIndex) => {
          const cursor = itemIndex === index ? '>' : ' '
          const selected = outcome.id === selectedId ? '*' : ' '
          return (
            <Text key={outcome.id}>
              {cursor} {itemIndex + 1}. [{selected}] {outcome.name}
            </Text>
          )
        })}
      </Box>
      <Box marginTop={1}>
        <KeyHint
          hints={[
            { key: 'Up/Down', action: 'move' },
            { key: 'Enter', action: 'select' },
          ]}
        />
      </Box>
    </Box>
  )
}
