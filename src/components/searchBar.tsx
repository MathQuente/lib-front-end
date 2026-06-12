import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMobileMenu } from '../contexts/useMobileMenu'
import type { SearchBarProps } from '../interfaces/ui'

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
        <Search
          className="absolute left-2.5 text-gray-600 pointer-events-none size-4"
        />
        <input
          ref={actualInputRef}
          className={`${
            isMobile ? 'w-full' : 'w-48'
          } pl-8 pr-7 py-1.5 bg-dark-input text-sm text-white placeholder-gray-600 rounded-lg border border-dark-border focus:border-primary focus:outline-none transition-colors duration-150`}
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
            <X size={15} />
          </button>
        )}
      </div>
    </form>
  )
}
