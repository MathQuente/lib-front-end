import { twMerge } from 'tailwind-merge'
import type { IconButtonProps } from '../interfaces/ui'

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        'border-white/10 rounded p-1.5 transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light',
        transparent ? 'bg-black/20' : 'bg-white/10',
        !props.disabled &&
          (transparent ? 'hover:bg-black/30' : 'hover:bg-white/15'),
        props.disabled ? 'opacity-50 cursor-not-allowed' : null
      )}
    />
  )
}
