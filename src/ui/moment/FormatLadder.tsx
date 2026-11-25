import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useState, type KeyboardEvent } from 'react'

interface FormatRow {
  /** Row id; the value reported through onChange. */
  id: string
  /** Label shown on the row, such as 2160p or Audio. */
  label: string
  /** Derived yt-dlp -f chain, shown in mono text when the row is selected. */
  chain: string
  /** Plain-language fallback chain, shown under the -f chain. */
  fallback: string
}

const ROWS: FormatRow[] = [
  {
    id: '2160p',
    label: '2160p',
    chain: 'bestvideo[height>=2160]+bestaudio/best',
    fallback: 'If nothing is at or above 4K, yt-dlp falls back to the best video it can find.',
  },
  {
    id: '1440p',
    label: '1440p',
    chain: 'bestvideo[height>=1440]+bestaudio/best',
    fallback: 'If nothing is at or above 2K, yt-dlp falls back to the best video it can find.',
  },
  {
    id: '1080p',
    label: '1080p',
    chain: 'bestvideo[height>=1080]+bestaudio/best',
    fallback: 'If nothing is at or above Full HD, yt-dlp falls back to the best video it can find.',
  },
  {
    id: '720p',
    label: '720p',
    chain: 'bestvideo[height>=720]+bestaudio/best',
    fallback: 'If nothing is at or above HD, yt-dlp falls back to the best video it can find.',
  },
  {
    id: '480p',
    label: '480p',
    chain: 'bestvideo[height>=480]+bestaudio/best',
    fallback: 'If nothing is at or above SD, yt-dlp falls back to the best video it can find.',
  },
  {
    id: 'audio',
    label: 'Audio',
    chain: 'bestaudio/best',
    fallback: 'Audio only: no video is downloaded.',
  },
]

export interface FormatLadderProps {
  /** Selected row id. Defaults to 1080p. */
  value?: string
  /** Called with the newly selected row id. */
  onChange?: (value: string) => void
}

export function FormatLadder({ value = '1080p', onChange }: FormatLadderProps) {
  const [focusedId, setFocusedId] = useState(value)

  const selectedRow = ROWS.find((row) => row.id === value) ?? ROWS[0]

  const select = (id: string) => {
    setFocusedId(id)
    onChange?.(id)
  }

  const move = (delta: number) => {
    const index = ROWS.findIndex((row) => row.id === focusedId)
    const next = ROWS[(index + delta + ROWS.length) % ROWS.length]
    select(next.id)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        move(-1)
        break
      case 'Home':
        event.preventDefault()
        select(ROWS[0].id)
        break
      case 'End':
        event.preventDefault()
        select(ROWS[ROWS.length - 1].id)
        break
    }
  }

  return (
    <div className="format-ladder">
      <fieldset className="format-ladder-rows">
        <legend>
          <VisuallyHidden>Quality</VisuallyHidden>
        </legend>
        {ROWS.map((row) => {
          const active = row.id === value
          return (
            <button
              key={row.id}
              type="button"
              className="format-ladder-row"
              data-state={active ? 'active' : 'inactive'}
              aria-pressed={active}
              tabIndex={row.id === focusedId ? 0 : -1}
              onClick={() => select(row.id)}
              onKeyDown={onKeyDown}
            >
              {row.label}
            </button>
          )
        })}
      </fieldset>
      <div className="format-ladder-details">
        <code className="format-ladder-chain">{selectedRow.chain}</code>
        <p className="format-ladder-fallback">{selectedRow.fallback}</p>
      </div>
    </div>
  )
}
