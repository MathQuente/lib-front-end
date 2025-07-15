import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import { useNavigate, useParams } from 'react-router-dom'

interface SearchBarProps {
  isMobile: boolean
}

export function SearchBar({ isMobile }: SearchBarProps) {
  const { query } = useParams()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (query) {
      setSearch(query)
    }
  }, [query])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search/${search}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <CiSearch className="absolute left-3 text-gray-400 z-10" size={20} />
        <input
          ref={inputRef}
          className={`${
            isMobile ? 'w-72' : 'w-64'
          } pl-10 pr-10 py-2 bg-[#3a3b47] text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7A38CA] focus:border-transparent transition-all`}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="absolute right-3 text-gray-400 hover:text-gray-200 transition-all duration-200 z-10 p-1 rounded-full hover:bg-gray-600 hover:scale-110 active:scale-95"
            onClick={() => {
              setSearch('')
              inputRef.current?.focus()
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
