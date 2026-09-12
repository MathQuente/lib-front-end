import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { AuthInputProps } from '../interfaces/ui'

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput({ id, label, icon, error, type, ...inputProps }, ref) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const resolvedType = isPassword && showPassword ? 'text' : type

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm text-gray-400">
          {label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
          <input
            id={id}
            ref={ref}
            type={resolvedType}
            {...inputProps}
            className={`bg-dark-bg-darker text-white placeholder-gray-500 rounded-lg block w-full text-sm py-3 pl-10 border outline-2 outline-offset-1 outline-transparent focus-visible:outline-primary-light ${
              isPassword ? 'pr-10' : 'pr-3'
            } ${
              error
                ? 'border-red-500 focus:border-red-500'
                : 'border-dark-border focus:border-primary'
            } transition-colors duration-150`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        <span className="text-red-500 text-xs min-h-[1rem]">
          {error?.message ?? ' '}
        </span>
      </div>
    )
  }
)
