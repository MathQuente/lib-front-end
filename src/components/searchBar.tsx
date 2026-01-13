import { useEffect, useRef, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router-dom'
import { useMobileMenu } from '../contexts/useMobileMenu'

interface SearchBarProps {
  isMobile: boolean
  inputRef?: RefObject<HTMLInputElement>
  autoFocus?: boolean
}

export function SearchBar({ isMobile, inputRef, autoFocus }: SearchBarProps) {
  const { query } = useParams()
  const navigate = useNavigate()
  const { setMobileMenuOpen } = useMobileMenu()
  const internalInputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>('')

  const actualInputRef = inputRef || internalInputRef

  useEffect(() => {
    if (query) {
      setSearch(query)
    }
  }, [query])

  useEffect(() => {
    if (!autoFocus) return

    const id = window.setTimeout(() => {
      actualInputRef.current?.focus()
      const el = actualInputRef.current
      if (el) {
        const len = el.value.length
        el.setSelectionRange(len, len)
      }
    }, 30)

    return () => clearTimeout(id)
  }, [autoFocus, actualInputRef])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search/${search}`)
      setSearch('')
      if (isMobile) {
        setMobileMenuOpen(false)
      }
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <CiSearch
          className="absolute left-1 top-[3px] text-gray-400"
          size={18}
        />
        <input
          ref={actualInputRef}
          className={`${
            isMobile ? 'w-72' : 'w-48'
          } pl-6 bg-[#3a3b47] text-white placeholder-gray-400 rounded-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7A38CA] focus:border-transparent transition-all`}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
        />
        {search && (
          <button
            type="button"
            className="absolute right-1 text-gray-400 hover:text-gray-200 transition-all duration-200 z-10 p-0.5 rounded-full hover:bg-gray-600 hover:scale-110 active:scale-95"
            onClick={() => {
              setSearch('')
              actualInputRef.current?.focus()
            }}
            aria-label="Clear search"
          >
            <IoClose size={16} />
          </button>
        )}
      </div>
    </form>
  )
}
