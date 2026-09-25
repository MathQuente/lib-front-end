import { twMerge } from 'tailwind-merge'
import type { ButtonProps } from '../interfaces/ui'

export function Button({
  variant = 'primary',
  size = 'sm',
  children,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary hover:bg-primary-light text-white font-bold',
    secondary:
      'bg-primary hover:bg-primary-light text-white border border-primary',
    cancel:
      'bg-dark-bg-lighter hover:bg-dark-bg-light text-gray-300 hover:text-white border border-dark-border disabled:hover:bg-dark-bg-lighter disabled:hover:text-gray-300',
    outline:
      'bg-transparent hover:bg-dark-bg-lighter text-gray-300 border border-dark-border',
    ghost: 'bg-transparent hover:bg-dark-bg-lighter text-gray-300 border border-transparent'
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
          <title>Carregando</title>
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
