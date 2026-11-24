import { Label } from '@radix-ui/react-label'
import type { ReactNode } from 'react'
import { useId } from 'react'

interface FieldProps {
  /** Label text, or a custom label element. */
  label: ReactNode
  /** Control rendered below the label. */
  children?: ReactNode
  /** Helper text under the control. */
  description?: ReactNode
  /** Error message shown under the control. */
  error?: ReactNode
  /** htmlFor value forwarded to the label. */
  htmlFor?: string
}

export function Field({ label, children, description, error, htmlFor }: FieldProps) {
  const errorId = useId()
  return (
    <div className="field">
      <Label htmlFor={htmlFor} className="field-label">
        {label}
      </Label>
      {children}
      {description && <p className="field-description">{description}</p>}
      {error && (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
