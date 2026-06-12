import { forwardRef } from 'react'
import type { AuthInputProps } from '../interfaces/ui'

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ id, label, icon, error, ...inputProps }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm text-gray-400">
          {label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
            {icon}
          </span>
          <input
            id={id}
            ref={ref}
            {...inputProps}
            className={`bg-[#13141C] text-white placeholder-gray-600 rounded-lg block w-full text-sm py-3 pl-10 pr-3 border ${
              error
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } focus:outline-none transition-colors duration-150`}
          />
        </div>
        {error && <span className="text-red-500 text-xs">{error.message}</span>}
      </div>
    )
  }
)
