import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

interface SegmentedProps {
  /** Options the user picks from. */
  options: string[]
  /** Current selection. */
  value: string
  /** Called with the newly selected option. */
  onChange: (value: string) => void
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className="segmented">
      <TabsList className="segmented-list">
        {options.map((option) => (
          <TabsTrigger key={option} value={option} className="segmented-trigger">
            {option}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
