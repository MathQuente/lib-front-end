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
    <form onSubmit={handleSearch}>
      <div className="relative flex items-center">
        <CiSearch
          className="absolute left-2.5 text-gray-600 pointer-events-none"
          size={16}
        />
        <input
          ref={actualInputRef}
          className={`${
            isMobile ? 'w-full' : 'w-48'
          } pl-8 pr-7 py-1.5 bg-[#13141C] text-sm text-white placeholder-gray-600 rounded-lg border border-[#2A2B36] focus:border-[#7A38CA] focus:outline-none transition-colors duration-150`}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar"
        />
        {search && (
          <button
            type="button"
            className="absolute right-2 text-gray-600 hover:text-gray-300 transition-colors"
            onClick={() => {
              setSearch('')
              actualInputRef.current?.focus()
            }}
            aria-label="Limpar busca"
          >
            <IoClose size={15} />
          </button>
        )}
      </div>
    </form>
  )
}
