import type { LucideIcon } from 'lucide-react'
import type { SVGProps } from 'react'

interface IconProps extends SVGProps<SVGSVGElement> {
  /** lucide-react icon component. */
  icon: LucideIcon
  /** Pixel size of the icon. */
  size?: number
  /** Stroke width of the icon. */
  strokeWidth?: number
}

export function Icon({ icon: IconComponent, size = 18, strokeWidth = 1.5, ...rest }: IconProps) {
  return <IconComponent size={size} strokeWidth={strokeWidth} {...rest} />
}
