import type { HTMLAttributes, ReactNode } from 'react'

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Panel content. */
  children?: ReactNode
}

export function Panel({ children, className, ...rest }: PanelProps) {
  return (
    <div className={`panel ${className ?? ''}`} {...rest}>
      {children}
    </div>
  )
}
