import { Box, Text, useInput } from 'ink'
import { useEffect, useMemo, useRef, useState } from 'react'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'
import { theme } from '../theme.ts'
import { allTasks } from '../tasks.ts'
import type { TaskItem } from '../tasks.ts'

export interface MoreTasksScreenProps {
  /** Called when user selects a task id. */
  onSelect: (id: string) => void
  /** Called when user goes back. */
  onBack: () => void
  /** Hide internal chrome when wrapped by App. */
  embedded?: boolean
}

export const MORE_HINTS = [
  { key: 'Up/Down', action: 'move' },
  { key: 'Type', action: 'filter' },
  { key: 'Enter', action: 'select' },
  { key: 'Esc', action: 'back' },
  { key: '?', action: 'help' },
] as const

function matches(task: TaskItem, query: string): boolean {
  const q = query.toLowerCase()
  return task.label.toLowerCase().includes(q) || task.id.toLowerCase().includes(q)
}

/** Screen for searching and selecting any task. */
export function MoreTasksScreen({ onSelect, onBack, embedded = false }: MoreTasksScreenProps) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)

  const items = useMemo(() => {
    const all = allTasks()
    if (query.length === 0) return all
    return all.filter((task) => matches(task, query))
  }, [query])

  const clampIndex = (next: number, length: number) => {
    if (length <= 0) return 0
    return Math.max(0, Math.min(next, length - 1))
  }

  useInput((input, key) => {
    if (key.escape) {
      onBack()
      return
    }
    if (items.length > 0) {
      if (key.upArrow) {
        const next = (indexRef.current - 1 + items.length) % items.length
        indexRef.current = next
        setIndex(next)
        return
      }
      if (key.downArrow) {
        const next = (indexRef.current + 1) % items.length
        indexRef.current = next
        setIndex(next)
        return
      }
      if (key.return) {
        const task = items[indexRef.current]
        if (task) onSelect(task.id)
        return
      }
    }
    if (key.backspace || key.delete) {
      setQuery((q) => q.slice(0, -1))
      indexRef.current = 0
      setIndex(0)
      return
    }
    if (key.tab || key.ctrl || key.meta || key.leftArrow || key.rightArrow) return
    if (input && input !== '?') {
      setQuery((q) => q + input)
      indexRef.current = 0
      setIndex(0)
    }
  })

  const safeIndex = clampIndex(index, items.length)
  useEffect(() => {
    indexRef.current = safeIndex
  }, [safeIndex])

  const body = (
    <Box flexDirection="column" marginTop={embedded ? 0 : 1}>
      <Text>Search: {query.length > 0 ? query : '-'}</Text>
      <Text color={theme.muted}>{items.length} matches</Text>
      <Box flexDirection="column" marginTop={1}>
        {items.length === 0 ? (
          <Text color={theme.muted}>No matches</Text>
        ) : (
          items.map((task, itemIndex) => {
            const active = itemIndex === safeIndex
            const cursor = active ? '>' : ' '
            return (
              <Text key={task.id} color={active ? theme.accent : undefined}>
                {cursor} {itemIndex + 1}. {task.label}
                <Text color={theme.muted}> - {task.hint}</Text>
              </Text>
            )
          })
        )}
      </Box>
    </Box>
  )

  if (embedded) return body

  return (
    <Box flexDirection="column">
      <StatusBar label="More tasks" value={`${items.length} matches`} />
      {body}
      <Box marginTop={1}>
        <KeyHint hints={[...MORE_HINTS]} />
      </Box>
    </Box>
  )
}
