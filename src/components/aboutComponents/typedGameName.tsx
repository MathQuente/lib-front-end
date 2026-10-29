import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const GAMES = [
  'Hi-Fi Rush',
  'Hollow Knight',
  'Celeste',
  'Portal 2',
  'Hades',
  'Minecraft Dungeons',
]

const TYPE_MS = 70
const DELETE_MS = 28
const HOLD_MS = 1700
const PAUSE_MS = 350

export function TypedGameName() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) return
    const word = GAMES[index]
    const atEnd = !deleting && length === word.length
    const atStart = deleting && length === 0
    let delay = deleting ? DELETE_MS : TYPE_MS
    if (atEnd) delay = HOLD_MS
    if (atStart) delay = PAUSE_MS

    const timer = window.setTimeout(() => {
      if (atEnd) {
        setDeleting(true)
      } else if (atStart) {
        setDeleting(false)
        setIndex(current => (current + 1) % GAMES.length)
      } else {
        setLength(current => current + (deleting ? -1 : 1))
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [reduced, index, length, deleting])

  const word = GAMES[index]
  const text = reduced
    ? `${GAMES[0]}.`
    : `${word.slice(0, length)}${length === word.length ? '.' : ''}`

  return (
    <p
      aria-hidden="true"
      className="font-display text-[2.125rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
    >
      Eu zerei
      <span className="block min-h-[2.16em] text-primary-light md:min-h-0">
        {text}
        {!reduced && (
          <span className="ml-1 inline-block h-[0.9em] w-[0.55ch] animate-cursor-blink bg-primary-light align-[-0.08em] motion-reduce:animate-none" />
        )}
      </span>
    </p>
  )
}
