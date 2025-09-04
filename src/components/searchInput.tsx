import type { ChangeEvent } from 'react'
import { CiSearch } from 'react-icons/ci'

interface SearchInputProps {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  className = 'bg-[#272932] text-[#8F8F8F] rounded-2xl block w-full h-[62px] pl-[62px] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
}: SearchInputProps) {
  return (
    <div className="relative">
      <div className="relative w-full sm:w-72">
        <CiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 size-6 text-[#8F8F8F] pointer-events-none" />
        <input
          onChange={onChange}
          value={value}
          className={className}
          type="text"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
