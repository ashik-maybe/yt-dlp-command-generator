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
  /** Called when any option changes. */
  onChange: (value: OptionsScreenValue) => void
}

type FocusField = 'quality' | 'rawArgs'

/** Screen for choosing command options. */
export function OptionsScreen({ quality, shell, rawArgs, onChange }: OptionsScreenProps) {
  const [focus, setFocus] = useState<FocusField>('quality')

  useInput((input, key) => {
    if (key.upArrow || key.downArrow) {
      setFocus((current) => (current === 'quality' ? 'rawArgs' : 'quality'))
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
      onChange({ quality, shell: 'posix', rawArgs: rawArgs.slice(0, -1) })
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
      onChange({ quality, shell: 'posix', rawArgs: rawArgs + input })
    }
  })

  const qualityMarker = focus === 'quality' ? '>' : ' '
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
          {rawArgsMarker} Raw args: {rawArgs}
        </Text>
        <Text> Shell: {shell}</Text>
      </Box>
      <Box marginTop={1}>
        <KeyHint
          hints={[
            { key: 'Up/Down', action: 'focus' },
            { key: 'Left/Right', action: 'quality' },
            { key: 'Type', action: 'raw args' },
          ]}
        />
      </Box>
    </Box>
  )
}
