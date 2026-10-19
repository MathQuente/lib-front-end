import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function isEditing(el: Element | null) {
  return (
    el instanceof HTMLElement &&
    (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
  )
}

function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

function focusMainHeading(allowMainFallback: boolean) {
  const h1 = document.querySelector<HTMLElement>('main h1')
  if (h1) {
    focusTarget(h1)
    return true
  }
  if (!allowMainFallback) return false
  const main = document.querySelector<HTMLElement>('main')
  if (!main) return false
  focusTarget(main)
  return true
}

export function useFocusOnRouteChange() {
  const { pathname } = useLocation()

  useEffect(() => {
    let retry = 0
    const first = requestAnimationFrame(() => {
      if (isEditing(document.activeElement)) return
      if (!focusMainHeading(false)) {
        retry = window.setTimeout(() => {
          if (!isEditing(document.activeElement)) focusMainHeading(true)
        }, 400)
      }
    })
    return () => {
      cancelAnimationFrame(first)
      clearTimeout(retry)
    }
  }, [pathname])
}
