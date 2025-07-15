import type { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center front-medium transistion-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:
      'bg-gradient-to-t from-[#4D23A5] to-[#783FCF] text-[#FFFFFF] font-bold brightness-105 hover:from-[#5D23A5] hover:to-[#813FCF] focus:ring-4',
    secondary:
      'bg-[#7A38CA] hover:bg-[#6a2eb8] text-[#FFFFFF] border border-[#4D23A5] focus:ring-[#4D23A5]',
    outline:
      'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-500',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-gray-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <title>Loading</title>
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
