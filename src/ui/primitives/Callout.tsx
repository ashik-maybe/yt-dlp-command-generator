import { CircleX, Flag, Info, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Icon } from './Icon.tsx'

export type CalloutTone = 'note' | 'warning' | 'error'

const TONE_ICONS: Record<CalloutTone, LucideIcon> = {
  note: Info,
  warning: Flag,
  error: CircleX,
}

interface CalloutProps {
  /** Severity of the callout. */
  tone?: CalloutTone
  /** Optional title line. */
  title?: string
  /** Callout content. */
  children?: ReactNode
}

export function Callout({ tone = 'note', title, children }: CalloutProps) {
  return (
    <div className={`callout callout-${tone}`}>
      <Icon icon={TONE_ICONS[tone]} className="callout-icon" />
      <div className="callout-body">
        {title && <p className="callout-title">{title}</p>}
        <div className="callout-content">{children}</div>
      </div>
    </div>
  )
}
