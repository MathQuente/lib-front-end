import { useEffect } from 'react'

const BRAND = 'EuZerei'

export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (title === undefined) return
    document.title = title === '' ? BRAND : `${title} · ${BRAND}`
  }, [title])
}
