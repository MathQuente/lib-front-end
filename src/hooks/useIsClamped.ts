import { type RefObject, useEffect, useState } from 'react'

export function useIsClamped(
  ref: RefObject<HTMLElement>,
  paused: boolean,
  dependency: unknown
) {
  const [isClamped, setIsClamped] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || paused) return

    const measure = () => setIsClamped(el.scrollHeight > el.clientHeight + 1)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, paused, dependency])

  return isClamped
}
