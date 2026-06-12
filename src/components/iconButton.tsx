import { twMerge } from 'tailwind-merge'
import type { IconButtonProps } from '../interfaces/ui'

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        'border-white/10 rounded p-1.5',
        transparent ? 'bg-black/20' : 'bg-white/10',
        props.disabled ? 'opacity-50 cursor-not-allowed' : null
      )}
    />
  )
}
