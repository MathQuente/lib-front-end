import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function SectionHeading({
  children,
  icon: Icon,
  className
}: {
  children: ReactNode
  icon?: LucideIcon
  className?: string
}) {
  return (
    <h2
      className={twMerge(
        'flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4',
        className
      )}
    >
      <span className="size-1.5 bg-primary shrink-0" aria-hidden="true" />
      {Icon && <Icon className="size-3.5 shrink-0" />}
      {children}
    </h2>
  )
}
