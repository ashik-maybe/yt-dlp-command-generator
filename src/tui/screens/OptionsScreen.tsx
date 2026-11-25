import { Box, Text, useInput } from 'ink'
import { useState } from 'react'
import { KeyHint } from '../components/KeyHint.tsx'
import { StatusBar } from '../components/StatusBar.tsx'
import { theme } from '../theme.ts'

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
  /** Advanced mode enabled. */
  advanced?: boolean
  /** Called when advanced mode toggles. */
  onToggleAdvanced?: () => void
  /** Hide internal chrome when wrapped by App. */
  embedded?: boolean
  /** Shorten hints for narrow terminals. */
  narrow?: boolean
}

type FocusField = 'sourceUrl' | 'quality' | 'rawArgs'

const FOCUS_ORDER: FocusField[] = ['quality', 'sourceUrl', 'rawArgs']

export const OPTIONS_HINTS = [
  { key: 'Up/Down', action: 'focus' },
  { key: 'Left/Right', action: 'quality' },
  { key: 'Type', action: 'value' },
  { key: 'a', action: 'advanced' },
  { key: '?', action: 'help' },
] as const

export const OPTIONS_HINTS_NARROW = [
  { key: 'Up/Dn', action: 'focus' },
  { key: 'L/R', action: 'quality' },
  { key: 'a', action: 'advanced' },
  { key: '?', action: 'help' },
] as const

/** Screen for choosing command options. */
export function OptionsScreen({
  quality,
  shell,
  rawArgs,
  sourceUrl,
  onSourceUrl,
  onChange,
  advanced = true,
  onToggleAdvanced,
  embedded = false,
  narrow = false,
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

    if (input === 'a' || input === 'A') {
      const canToggle = focus !== 'sourceUrl' && !(focus === 'rawArgs' && advanced)
      if (canToggle) {
        onToggleAdvanced?.()
        return
      }
      if (focus === 'sourceUrl') {
        onSourceUrl(sourceUrl + input)
        return
      }
      if (focus === 'rawArgs' && advanced) {
        onChange({ quality, shell: 'posix', rawArgs: rawArgs + input })
        return
      }
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
      else if (advanced) onChange({ quality, shell: 'posix', rawArgs: rawArgs.slice(0, -1) })
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
      if (focus === 'sourceUrl') {
        onSourceUrl(sourceUrl + input)
        return
      }
      if (focus === 'rawArgs') {
        if (!advanced) {
          onToggleAdvanced?.()
          onChange({ quality, shell: 'posix', rawArgs: rawArgs + input })
          return
        }
        onChange({ quality, shell: 'posix', rawArgs: rawArgs + input })
      }
    }
  })

  const sourceMarker = focus === 'sourceUrl' ? '>' : ' '
  const qualityMarker = focus === 'quality' ? '>' : ' '
  const rawArgsMarker = focus === 'rawArgs' ? '>' : ' '
  const show = (value: string) => (value.length > 0 ? value : '-')
  const rawArgsValue = advanced ? show(rawArgs) : '-'
  const hints = narrow ? [...OPTIONS_HINTS_NARROW] : [...OPTIONS_HINTS]

  const body = (
    <Box flexDirection="column" marginTop={embedded ? 0 : 1}>
      <Text color={focus === 'sourceUrl' ? theme.accent : undefined}>
        {sourceMarker} Source URL: {show(sourceUrl)}
      </Text>
      <Text color={theme.muted}> Hint: type a source URL</Text>
      <Text color={focus === 'quality' ? theme.accent : undefined}>
        {qualityMarker} Quality: {show(quality)}
      </Text>
      <Text color={theme.muted}> Hint: use Left/Right to change quality</Text>
      <Text color={theme.muted}> Choices: {QUALITY_OPTIONS.join(' | ')}</Text>
      <Text color={focus === 'rawArgs' ? theme.accent : undefined}>
        {rawArgsMarker} Raw args: {rawArgsValue}
      </Text>
      <Text color={theme.muted}>
        {advanced ? ' Hint: type extra arguments' : ' Hint: press a to edit'}
      </Text>
      <Text> Shell: {shell}</Text>
      <Text color={theme.muted}> Advanced: {advanced ? 'on' : 'off'}</Text>
    </Box>
  )

  if (embedded) return body

  return (
    <Box flexDirection="column">
      <StatusBar label="Options" value="shell: posix" />
      {body}
      <Box marginTop={1}>
        <KeyHint hints={hints} />
      </Box>
    </Box>
  )
}
