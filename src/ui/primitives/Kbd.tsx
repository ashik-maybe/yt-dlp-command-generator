import type { ReactNode } from 'react'

interface KbdProps {
  /** Shortcut text to show. */
  children: ReactNode
}

export function Kbd({ children }: KbdProps) {
  return <kbd className="kbd">{children}</kbd>
}
