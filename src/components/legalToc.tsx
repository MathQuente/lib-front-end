import { useEffect, useMemo, useState } from 'react'
import { focusRing } from '../styles/focus'

export type LegalTocItem = {
  id: string
  number: string
  title: string
}

function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(() => {
    const fromHash = window.location.hash.slice(1)
    return ids.includes(fromHash) ? fromHash : ids[0]
  })

  useEffect(() => {
    const update = () => {
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActiveId(ids[ids.length - 1])
        return
      }
      const line = window.innerHeight * 0.15
      let next = ids[0]
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= line) next = id
      }
      setActiveId(next)
    }

    const onHashChange = () => {
      const id = window.location.hash.slice(1)
      if (ids.includes(id)) setActiveId(id)
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [ids])

  return activeId
}

export function LegalToc({ items }: { items: LegalTocItem[] }) {
  const ids = useMemo(() => items.map(item => item.id), [items])
  const activeId = useActiveSection(ids)

  return (
    <nav
      aria-label="Nesta página"
      className="hidden lg:block sticky top-4 self-start"
    >
      <ol className="list-none border-t border-dark-border">
        {items.map(({ id, number, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === activeId ? 'true' : undefined}
              className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-1 border-b border-dark-border px-1 py-2.5 text-sm leading-snug transition-colors hover:text-white ${focusRing} ${
                id === activeId
                  ? 'bg-dark-bg-lighter text-white'
                  : 'text-gray-400'
              }`}
            >
              <span className="font-display font-extrabold text-primary-light">
                {number}
              </span>
              <span>{title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
