import { twMerge } from 'tailwind-merge'
import type { IconButtonProps } from '../interfaces/ui'

const sizes = {
  sm: 'size-7 before:-inset-2',
  md: 'size-9 before:-inset-1'
}

const tones = {
  neutral: 'text-gray-300 hover:text-white',
  danger: 'text-gray-300 hover:text-red-400'
}

export function IconButton({
  transparent,
  size = 'sm',
  tone = 'neutral',
  variant = 'filled',
  className,
  ...props
}: IconButtonProps) {
  const filled = variant === 'filled'
  return (
    <button
      type="button"
      {...props}
      className={twMerge(
        'relative inline-flex shrink-0 items-center justify-center rounded-md transition-colors before:absolute',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light',
        sizes[size],
        tones[tone],
        filled && (transparent ? 'bg-black/20' : 'bg-white/10'),
        !props.disabled &&
          (filled
            ? transparent
              ? 'hover:bg-black/30'
              : 'hover:bg-white/15'
            : 'hover:bg-dark-bg'),
        props.disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    />
  )
}
