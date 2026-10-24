import { useEffect } from 'react'

const BRAND = 'EuZerei'

// undefined: não mexe (o StatusMessage ou os dados ainda são donos do título).
// '': só a marca (home). Qualquer outro texto vira `${title} · EuZerei`.
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (title === undefined) return
    document.title = title === '' ? BRAND : `${title} · ${BRAND}`
  }, [title])
}
