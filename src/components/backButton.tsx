import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { listStepsInHistory } from '../utils/listHistory'
import { focusRing } from '../styles/focus'

export function BackButton({ className }: { className?: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.key === 'default' && listStepsInHistory() === 0) return null

  return (
    <button
      type="button"
      onClick={() => navigate(-(1 + listStepsInHistory()))}
      className={twMerge(
        `inline-flex self-start items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors ${focusRing} rounded-sm`,
        className
      )}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Voltar
    </button>
  )
}
