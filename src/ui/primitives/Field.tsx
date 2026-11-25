import { Label } from '@radix-ui/react-label'
import { cloneElement, isValidElement, useId, type ReactNode } from 'react'

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

/** Props read off the child control before cloning it. */
interface ControlProps {
  id?: string
  'aria-describedby'?: string
}

export function Field({ label, children, description, error, htmlFor }: FieldProps) {
  const controlId = useId()
  const descriptionId = useId()
  const errorId = useId()
  const describedBy = description ? descriptionId : undefined
  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children, {
        id: children.props.id ?? controlId,
        'aria-describedby': children.props['aria-describedby'] ?? describedBy,
      })
    : children
  return (
    <div className="field">
      <Label htmlFor={htmlFor ?? controlId} className="field-label">
        {label}
      </Label>
      {control}
      {description && (
        <p className="field-description" id={descriptionId}>
          {description}
        </p>
      )}
      {error && (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
