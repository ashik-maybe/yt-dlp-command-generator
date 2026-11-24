import {
  AudioLines,
  Copy,
  FileCog,
  History,
  ListOrdered,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { outcomeStrings } from '../../content/index.ts'
import { Button } from '../primitives/Button.tsx'
import { Icon } from '../primitives/Icon.tsx'

/** Outcome icons, keyed by the outcome id in src/content/index.ts. */
const OUTCOME_ICONS: Record<string, LucideIcon> = {
  outcomeDownloadVideo: Video,
  outcomeExtractAudio: AudioLines,
  outcomeConvertFormat: FileCog,
  outcomeResumeDownload: History,
  outcomeListFormats: ListOrdered,
  outcomeCopyCommand: Copy,
}

/** Short sentence under each outcome name. */
const OUTCOME_SENTENCES: Record<string, string> = {
  outcomeDownloadVideo: 'Save the clip for later.',
  outcomeExtractAudio: 'Keep the sound, drop the picture.',
  outcomeConvertFormat: 'Same video, different format.',
  outcomeResumeDownload: 'Pick up where it stopped.',
  outcomeListFormats: 'See the formats yt-dlp offers.',
  outcomeCopyCommand: 'Copy the ready-to-paste line.',
}

interface OutcomeCardProps {
  /** Outcome id passed to OutcomeGrid's onSelect. */
  id: string
  /** Plain-language outcome name from src/content/index.ts. */
  name: string
  /** Short sentence under the outcome name. */
  sentence: string
  /** Real lucide icon for the outcome. */
  icon: LucideIcon
  /** Called when the card is clicked. */
  onSelect?: (id: string) => void
}

function OutcomeCard({ id, name, sentence, icon, onSelect }: OutcomeCardProps) {
  return (
    <Button
      type="button"
      className="flex w-full flex-col items-start gap-2"
      onClick={() => onSelect?.(id)}
    >
      <Icon icon={icon} size={18} strokeWidth={1.5} />
      <span>{name}</span>
      <span>{sentence}</span>
    </Button>
  )
}

export interface OutcomeGridProps {
  /** Called when a card is clicked, with the outcome id. */
  onSelect?: (id: string) => void
}

/** Grid of the six outcome cards, one per outcome in src/content/index.ts. */
export function OutcomeGrid({ onSelect }: OutcomeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {outcomeStrings.map((outcome) => (
        <OutcomeCard
          key={outcome.id}
          id={outcome.id}
          name={outcome.text}
          sentence={OUTCOME_SENTENCES[outcome.id] ?? ''}
          icon={OUTCOME_ICONS[outcome.id] ?? Video}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
