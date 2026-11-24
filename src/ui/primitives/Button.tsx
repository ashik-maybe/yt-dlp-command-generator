import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button. */
  variant?: ButtonVariant
}

export function Button({ variant = 'secondary', className, ...rest }: ButtonProps) {
  return <button type="button" className={`btn btn-${variant} ${className ?? ''}`} {...rest} />
}
