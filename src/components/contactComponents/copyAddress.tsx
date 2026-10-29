import { useEffect, useRef, useState } from 'react'
import {
  primaryButtonClass,
  secondaryButtonClass,
} from '../aboutComponents/styles'
import { SUPPORT_EMAIL, mailtoHref } from './supportEmail'

const MESSAGE_MS = 4000
const ANNOUNCE_GAP_MS = 80

export function CopyAddress() {
  const addressRef = useRef<HTMLAnchorElement>(null)
  const timerRef = useRef<number>()
  const announceRef = useRef<number>()
  const [message, setMessage] = useState('')

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current)
      window.clearTimeout(announceRef.current)
    },
    []
  )

  function show(text: string) {
    window.clearTimeout(timerRef.current)
    window.clearTimeout(announceRef.current)
    setMessage('')
    announceRef.current = window.setTimeout(() => {
      setMessage(text)
      timerRef.current = window.setTimeout(() => setMessage(''), MESSAGE_MS)
    }, ANNOUNCE_GAP_MS)
  }

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(SUPPORT_EMAIL)
      show('Endereço copiado.')
    } catch {
      const node = addressRef.current
      if (node) {
        const range = document.createRange()
        range.selectNodeContents(node)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
      show('Não deu para copiar. O endereço está selecionado, é só copiar.')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <a
        ref={addressRef}
        href={mailtoHref()}
        className="inline-block w-fit max-w-full rounded-sm py-1 font-display text-lg font-extrabold tracking-tight text-white [overflow-wrap:anywhere] transition-colors hover:text-primary-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light sm:text-2xl lg:text-3xl xl:text-4xl"
      >
        {SUPPORT_EMAIL}
      </a>
      <div className="flex flex-wrap items-center gap-2.5">
        <a href={mailtoHref()} className={primaryButtonClass}>
          Escrever e-mail
        </a>
        <button type="button" onClick={copy} className={secondaryButtonClass}>
          Copiar endereço
        </button>
      </div>
      <p aria-live="polite" className="min-h-5 text-sm text-gray-300">
        {message}
      </p>
    </div>
  )
}
