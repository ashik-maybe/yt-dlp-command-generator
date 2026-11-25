import { Box, Text, useInput } from 'ink'
import { useMemo, useRef, useState } from 'react'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'
import { theme } from '../theme.ts'

export interface OutcomeItem {
  /** Stable outcome id. */
  id: string
  /** Display name. */
  name: string
  /** Short plain hint. */
  hint?: string
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
  /** Extra navigable items not shown. */
  hiddenItems?: readonly OutcomeItem[]
  /** Currently selected outcome id. */
  selectedId: string
  /** Called when the user selects an outcome. */
  onSelect: (id: string) => void
  /** Called when user opens more tasks. */
  onMore?: () => void
  /** Show the More tasks row. */
  showMore?: boolean
  /** Hide internal chrome when wrapped by App. */
  embedded?: boolean
}

export const OUTCOME_HINTS = [
  { key: 'Up/Down', action: 'move' },
  { key: 'Enter', action: 'select' },
  { key: '?', action: 'help' },
] as const

function flattenGroups(groups: readonly OutcomeGroup[]): OutcomeItem[] {
  return groups.flatMap((group) => [...group.items])
}

const EMPTY_ITEMS: readonly OutcomeItem[] = []

/** Screen for choosing an outcome. */
export function OutcomeScreen({
  outcomes,
  groups,
  hiddenItems = EMPTY_ITEMS,
  selectedId,
  onSelect,
  onMore,
  showMore = false,
  embedded = false,
}: OutcomeScreenProps) {
  const baseItems = useMemo(
    () => (groups ? flattenGroups(groups) : [...(outcomes ?? [])]),
    [groups, outcomes],
  )
  const moreItem: OutcomeItem | null = useMemo(
    () => (showMore ? { id: '__more__', name: 'More tasks...' } : null),
    [showMore],
  )
  const items = useMemo(() => {
    const visible = moreItem ? [...baseItems, moreItem] : baseItems
    return hiddenItems.length > 0 ? [...visible, ...hiddenItems] : visible
  }, [baseItems, moreItem, hiddenItems])

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
      if (!outcome) return
      if (outcome.id === '__more__') {
        onMore?.()
        return
      }
      onSelect(outcome.id)
    }
  })

  const renderItem = (outcome: OutcomeItem, itemIndex: number, number: number) => {
    const cursor = itemIndex === index ? '>' : ' '
    const selected = outcome.id === selectedId ? '*' : ' '
    const active = itemIndex === index
    const hint = outcome.hint ? ` - ${outcome.hint}` : ''
    return (
      <Text key={outcome.id} color={active ? theme.accent : undefined}>
        {cursor} {number}. [{selected}] {outcome.name}
        {hint ? <Text color={theme.muted}>{hint}</Text> : null}
      </Text>
    )
  }

  const body = (
    <Box flexDirection="column" marginTop={embedded ? 0 : 1}>
      {groups
        ? groups.map((group, groupIndex) => {
            const start = groups
              .slice(0, groupIndex)
              .reduce((sum, current) => sum + current.items.length, 0)
            return (
              <Box key={group.label} flexDirection="column" marginBottom={1}>
                <Text color={theme.muted}>{group.label}</Text>
                {group.items.map((outcome, outcomeIndex) => {
                  const itemIndex = start + outcomeIndex
                  return renderItem(outcome, itemIndex, itemIndex + 1)
                })}
              </Box>
            )
          })
        : baseItems.map((outcome, itemIndex) => renderItem(outcome, itemIndex, itemIndex + 1))}
      {moreItem ? (
        <Box marginTop={groups ? 0 : 1}>
          <Text color={index === baseItems.length ? theme.accent : undefined}>
            {index === baseItems.length ? '>' : ' '} {baseItems.length + 1}. [ ] {moreItem.name}
          </Text>
        </Box>
      ) : null}
    </Box>
  )

  if (embedded) return body

  return (
    <Box flexDirection="column">
      <StatusBar label="Outcome" value={`${items.length} options`} />
      {body}
      <Box marginTop={1}>
        <KeyHint hints={[...OUTCOME_HINTS]} />
      </Box>
    </Box>
  )
}
