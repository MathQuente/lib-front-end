import { type RefObject, useEffect, useState } from 'react'

export function useIsClamped(
  ref: RefObject<HTMLElement>,
  paused: boolean,
  dependency: unknown
) {
  const [isClamped, setIsClamped] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies(dependency): dependency só dispara o efeito, o texto é remedido quando o conteúdo muda
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
