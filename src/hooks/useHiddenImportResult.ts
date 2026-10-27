import { useCallback, useSyncExternalStore } from 'react'
import { useAuth } from './useAuth'

const memory = new Map<string, string>()
const memoryOnlyKeys = new Set<string>()
const listeners = new Set<() => void>()

function read(key: string) {
  try {
    const stored = window.localStorage.getItem(key)
    if (stored !== null) return stored
  } catch {}
  return memory.get(key) ?? null
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
    memory.delete(key)
    memoryOnlyKeys.delete(key)
  } catch {
    if (value === null) {
      memory.delete(key)
      memoryOnlyKeys.delete(key)
    } else {
      memory.set(key, value)
      memoryOnlyKeys.add(key)
    }
  }
  for (const listener of listeners) listener()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

export const useHiddenImportResult = (
  platformKey: string,
  finishedAt: number | undefined
) => {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const key = `importHidden:v1:${userId}:${platformKey}`

  const stored = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  )
  const memoryOnly = useSyncExternalStore(
    subscribe,
    () => memoryOnlyKeys.has(key),
    () => false
  )

  const canHide = Boolean(userId) && finishedAt !== undefined
  const hidden = canHide && stored === String(finishedAt)

  const hide = useCallback(() => {
    if (canHide) write(key, String(finishedAt))
  }, [canHide, key, finishedAt])
  const show = useCallback(() => write(key, null), [key])

  return { canHide, hidden, memoryOnly, hide, show }
}
