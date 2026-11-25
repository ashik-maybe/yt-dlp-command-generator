import { Box, Text, useInput } from 'ink'
import { useState } from 'react'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'

export const QUALITY_OPTIONS = ['best', 'good', 'medium', 'low'] as const

export type QualityOption = (typeof QUALITY_OPTIONS)[number]

export interface OptionsScreenValue {
  /** Selected quality. */
  quality: string
  /** Target shell. POSIX only. */
  shell: 'posix'
  /** Extra raw arguments. */
  rawArgs: string
}

export interface OptionsScreenProps {
  /** Selected quality. */
  quality: string
  /** Target shell. POSIX only. */
  shell: 'posix'
  /** Extra raw arguments. */
  rawArgs: string
  /** Source URL value. */
  sourceUrl: string
  /** Called when source URL changes. */
  onSourceUrl: (value: string) => void
  /** Called when any option changes. */
  onChange: (value: OptionsScreenValue) => void
}

type FocusField = 'quality' | 'sourceUrl' | 'rawArgs'

const FOCUS_ORDER: FocusField[] = ['quality', 'sourceUrl', 'rawArgs']

/** Screen for choosing command options. */
export function OptionsScreen({
  quality,
  shell,
  rawArgs,
  sourceUrl,
  onSourceUrl,
  onChange,
}: OptionsScreenProps) {
  const [focus, setFocus] = useState<FocusField>('quality')

  useInput((input, key) => {
    if (key.upArrow || key.downArrow) {
      setFocus((current) => {
        const index = FOCUS_ORDER.indexOf(current)
        const direction = key.downArrow ? 1 : -1
        const nextIndex = (index + direction + FOCUS_ORDER.length) % FOCUS_ORDER.length
        return FOCUS_ORDER[nextIndex] ?? 'quality'
      })
      return
    }

    if (focus === 'quality') {
      if (key.leftArrow || key.rightArrow) {
        const currentIndex = Math.max(0, QUALITY_OPTIONS.indexOf(quality as QualityOption))
        const direction = key.rightArrow ? 1 : -1
        const nextIndex =
          (currentIndex + direction + QUALITY_OPTIONS.length) % QUALITY_OPTIONS.length
        const nextQuality = QUALITY_OPTIONS[nextIndex] ?? 'best'
        onChange({ quality: nextQuality, shell: 'posix', rawArgs })
      }
      return
    }

    if (key.backspace || key.delete) {
      if (focus === 'sourceUrl') onSourceUrl(sourceUrl.slice(0, -1))
      else onChange({ quality, shell: 'posix', rawArgs: rawArgs.slice(0, -1) })
      return
    }

    if (
      key.return ||
      key.tab ||
      key.escape ||
      key.ctrl ||
      key.meta ||
      key.leftArrow ||
      key.rightArrow
    ) {
      return
    }

    if (input) {
      if (focus === 'sourceUrl') onSourceUrl(sourceUrl + input)
      else onChange({ quality, shell: 'posix', rawArgs: rawArgs + input })
    }
  })

  const qualityMarker = focus === 'quality' ? '>' : ' '
  const sourceMarker = focus === 'sourceUrl' ? '>' : ' '
  const rawArgsMarker = focus === 'rawArgs' ? '>' : ' '

  return (
    <Box flexDirection="column">
      <StatusBar label="Options" value="shell: posix" />
      <Box flexDirection="column" marginTop={1}>
        <Text>
          {qualityMarker} Quality: {quality}
        </Text>
        <Text> Choices: {QUALITY_OPTIONS.join(' | ')}</Text>
        <Text>
          {sourceMarker} Source URL: {sourceUrl}
        </Text>
        <Text>
          {rawArgsMarker} Raw args: {rawArgs}
        </Text>
        <Text> Shell: {shell}</Text>
      </Box>
      <Box marginTop={1}>
        <KeyHint
          hints={[
            { key: 'Up/Down', action: 'focus' },
            { key: 'Left/Right', action: 'quality' },
            { key: 'Type', action: 'value' },
          ]}
        />
      </Box>
    </Box>
  )
}
