import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { Icon } from './Icon.tsx'

interface DisclosureProps {
  /** Visible title of the disclosure. */
  title: ReactNode
  /** Content shown when the disclosure is open. */
  children?: ReactNode
  /** Start the disclosure open. */
  defaultOpen?: boolean
}

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()
  return (
    <div className="disclosure">
      <button
        type="button"
        className="disclosure-toggle"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
      >
        {title}
        <Icon icon={open ? ChevronUp : ChevronDown} aria-hidden />
      </button>
      {open && (
        <div className="disclosure-content" id={contentId}>
          {children}
        </div>
      )}
    </div>
  )
}
