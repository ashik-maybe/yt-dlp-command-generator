import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

interface SegmentedProps {
  /** Options the user picks from. */
  options: string[]
  /** Current selection. */
  value: string
  /** Called with the newly selected option. */
  onChange: (value: string) => void
}

/** Radix puts the value in an id. Keep ids free of spaces and punctuation. */
function toValue(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <Tabs
      value={toValue(value)}
      onValueChange={(next) => onChange(options.find((option) => toValue(option) === next) ?? next)}
      className="segmented"
    >
      <TabsList className="segmented-list">
        {options.map((option) => (
          <TabsTrigger key={option} value={toValue(option)} className="segmented-trigger">
            {option}
          </TabsTrigger>
        ))}
      </TabsList>
      {options.map((option) => (
        <TabsContent key={option} value={toValue(option)} className="segmented-content" />
      ))}
    </Tabs>
  )
}
