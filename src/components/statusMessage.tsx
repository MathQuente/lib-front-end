import { type ReactNode, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Search, TriangleAlert, WifiOff } from 'lucide-react'
import { SearchBar } from './searchBar'
import type { StatusMessageProps } from '../interfaces/ui'

const ICONS = {
  'not-found': Compass,
  error: TriangleAlert,
  offline: WifiOff,
  empty: Search
}

const linkClass =
  'text-primary-link hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm'

export function StatusMessage({
  variant,
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  showSearch,
  shortcuts,
  documentTitle
}: StatusMessageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isPage = variant !== 'empty'
  const Icon = ICONS[icon ?? variant]

  useEffect(() => {
    if (!isPage) return
    const previousTitle = document.title
    document.title = `${documentTitle ?? title} · Lib`
    headingRef.current?.focus({ preventScroll: true })
    return () => {
      document.title = previousTitle
    }
  }, [isPage, documentTitle, title])

  const Heading = isPage ? 'h1' : 'h3'

  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      className="flex flex-col items-center justify-center w-full py-16 text-center gap-3"
    >
      <Icon className="size-12 text-gray-400" aria-hidden="true" />
      <Heading
        ref={headingRef}
        tabIndex={isPage ? -1 : undefined}
        className="text-white font-semibold text-lg focus:outline-none"
      >
        {title}
      </Heading>
      <p className="text-gray-400 text-sm max-w-sm">{description}</p>

      {showSearch && (
        <div className="w-full max-w-xs">
          <SearchBar isMobile />
        </div>
      )}

      {shortcuts && shortcuts.length > 0 && (
        <nav
          aria-label="Atalhos"
          className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm"
        >
          {shortcuts.map(s => (
            <Link key={s.to} to={s.to} className={linkClass}>
              {s.label}
            </Link>
          ))}
        </nav>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}

export function StatusLink({
  to,
  variant = 'primary',
  children
}: {
  to: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
}) {
  const styles =
    variant === 'primary'
      ? 'bg-primary hover:bg-primary-hover text-white font-bold'
      : 'bg-transparent hover:bg-dark-bg-lighter text-gray-300 hover:text-white border border-dark-border font-medium'
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center px-4 py-2 max-sm:min-h-11 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${styles}`}
    >
      {children}
    </Link>
  )
}
