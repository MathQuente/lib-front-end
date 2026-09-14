import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

export function BackButton({ className }: { className?: string }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={twMerge(
        'inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm',
        className
      )}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Voltar
    </button>
  )
}
