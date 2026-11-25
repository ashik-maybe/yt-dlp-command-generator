import {
  Clock,
  FileJson,
  FileOutput,
  FileText,
  Filter,
  Gauge,
  ListOrdered,
  Network,
  Scissors,
  SlidersHorizontal,
  Split,
  Terminal,
  Timer,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { outcomeStrings } from '../../content/index.ts'
import { Button } from '../primitives/Button.tsx'
import { Icon } from '../primitives/Icon.tsx'

interface OutcomeGroup {
  id: string
  label: string
  outcomeIds: string[]
}

const OUTCOME_GROUPS: OutcomeGroup[] = [
  {
    id: 'select',
    label: 'Select',
    outcomeIds: ['list-formats', 'match-filters', 'format-sort-small', 'use-extractors'],
  },
  {
    id: 'metadata',
    label: 'Metadata',
    outcomeIds: ['parse-metadata', 'split-chapters', 'force-keyframes-at-cuts', 'load-info-json'],
  },
  {
    id: 'network',
    label: 'Network',
    outcomeIds: ['impersonate', 'concurrent-fragments', 'throttled-rate', 'sleep-jitter'],
  },
  {
    id: 'output',
    label: 'Output',
    outcomeIds: ['template-playlist', 'template-chapter', 'stdout-pipe', 'exec-guarded'],
  },
]

/** Outcome icons, keyed by the outcome id in src/content/index.ts. */
const OUTCOME_ICONS: Record<string, LucideIcon> = {
  'list-formats': ListOrdered,
  'match-filters': Filter,
  'format-sort-small': SlidersHorizontal,
  'use-extractors': Workflow,
  'parse-metadata': FileText,
  'split-chapters': Split,
  'force-keyframes-at-cuts': Scissors,
  'load-info-json': FileJson,
  impersonate: Network,
  'concurrent-fragments': Gauge,
  'throttled-rate': Timer,
  'sleep-jitter': Clock,
  'template-playlist': FileOutput,
  'template-chapter': FileOutput,
  'stdout-pipe': Terminal,
  'exec-guarded': Terminal,
}

/** Short sentence under each outcome name. */
const OUTCOME_SENTENCES: Record<string, string> = {
  'list-formats': 'Show available formats for a URL',
  'match-filters': 'Skip items that do not match a filter',
  'format-sort-small': 'Order formats by size and quality fields',
  'use-extractors': 'Restrict downloads to matching extractors',
  'parse-metadata': 'Map metadata fields with a pattern',
  'split-chapters': 'Write each chapter to a separate file',
  'force-keyframes-at-cuts': 'Cut sections at keyframes for cleaner splits',
  'load-info-json': 'Read metadata from a saved info JSON file',
  impersonate: 'Send requests as a browser client',
  'concurrent-fragments': 'Fetch multiple fragments at the same time',
  'throttled-rate': 'Set a minimum rate for throttled detection',
  'sleep-jitter': 'Wait between requests with a random range',
  'template-playlist': 'Save files with a playlist output template',
  'template-chapter': 'Save split chapters with an output template',
  'stdout-pipe': 'Send output to standard output',
  'exec-guarded': 'Run a command after each file is moved',
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

/** Grid of the outcome cards, grouped by high-value recipe category. */
export function OutcomeGrid({ onSelect }: OutcomeGridProps) {
  const byId = new Map(outcomeStrings.map((outcome) => [outcome.id, outcome]))

  return (
    <div className="flex flex-col gap-6">
      {OUTCOME_GROUPS.map((group) => (
        <section key={group.id} aria-labelledby={`outcome-group-${group.id}`}>
          <h3 id={`outcome-group-${group.id}`} className="section-heading">
            {group.label}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {group.outcomeIds.map((id) => {
              const outcome = byId.get(id)
              if (!outcome) return null
              return (
                <OutcomeCard
                  key={id}
                  id={id}
                  name={outcome.text}
                  sentence={OUTCOME_SENTENCES[id] ?? ''}
                  icon={OUTCOME_ICONS[id] ?? ListOrdered}
                  onSelect={onSelect}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
