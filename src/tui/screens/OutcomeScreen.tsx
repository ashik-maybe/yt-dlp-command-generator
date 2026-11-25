import { Box, Text, useInput } from 'ink'
import { useMemo, useRef, useState } from 'react'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'

export interface OutcomeItem {
  /** Stable outcome id. */
  id: string
  /** Display name. */
  name: string
}

export interface OutcomeGroup {
  /** Group heading shown above items. */
  label: string
  /** Outcomes in this group. */
  items: readonly OutcomeItem[]
}

export interface OutcomeScreenProps {
  /** Available outcomes. */
  outcomes?: readonly OutcomeItem[]
  /** Grouped outcomes. */
  groups?: readonly OutcomeGroup[]
  /** Currently selected outcome id. */
  selectedId: string
  /** Called when the user selects an outcome. */
  onSelect: (id: string) => void
}

function flattenGroups(groups: readonly OutcomeGroup[]): OutcomeItem[] {
  return groups.flatMap((group) => [...group.items])
}

/** Screen for choosing an outcome. */
export function OutcomeScreen({ outcomes, groups, selectedId, onSelect }: OutcomeScreenProps) {
  const items = useMemo(
    () => (groups ? flattenGroups(groups) : [...(outcomes ?? [])]),
    [groups, outcomes],
  )
  const initialIndex = Math.max(
    0,
    items.findIndex((outcome) => outcome.id === selectedId),
  )
  const [index, setIndex] = useState(initialIndex)
  const indexRef = useRef(initialIndex)

  useInput((_input, key) => {
    if (items.length === 0) return
    if (key.upArrow) {
      const nextIndex = (indexRef.current - 1 + items.length) % items.length
      indexRef.current = nextIndex
      setIndex(nextIndex)
    }
    if (key.downArrow) {
      const nextIndex = (indexRef.current + 1) % items.length
      indexRef.current = nextIndex
      setIndex(nextIndex)
    }
    if (key.return) {
      const outcome = items[indexRef.current]
      if (outcome) onSelect(outcome.id)
    }
  })

  return (
    <Box flexDirection="column">
      <StatusBar label="Outcome" value={`${items.length} options`} />
      <Box flexDirection="column" marginTop={1}>
        {groups
          ? groups.map((group, groupIndex) => {
              const start = groups
                .slice(0, groupIndex)
                .reduce((sum, current) => sum + current.items.length, 0)
              return (
                <Box key={group.label} flexDirection="column" marginBottom={1}>
                  <Text>{group.label}</Text>
                  {group.items.map((outcome, outcomeIndex) => {
                    const itemIndex = start + outcomeIndex
                    const cursor = itemIndex === index ? '>' : ' '
                    const selected = outcome.id === selectedId ? '*' : ' '
                    return (
                      <Text key={outcome.id}>
                        {cursor} {itemIndex + 1}. [{selected}] {outcome.name}
                      </Text>
                    )
                  })}
                </Box>
              )
            })
          : items.map((outcome, itemIndex) => {
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
