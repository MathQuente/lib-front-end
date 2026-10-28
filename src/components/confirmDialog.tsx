import * as Dialog from '@radix-ui/react-dialog'
import { type ReactNode, useRef } from 'react'
import { Button } from './button'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isLoading,
  confirmDisabled,
  confirmVariant = 'danger',
  lockWhileLoading,
  children
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmLabel: string
  onConfirm: () => void
  isLoading?: boolean
  confirmDisabled?: boolean
  confirmVariant?: 'danger' | 'primary'
  lockWhileLoading?: boolean
  children?: ReactNode
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  const handleOpenChange = (next: boolean) => {
    if (lockWhileLoading && isLoading) return
    onOpenChange(next)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed z-confirm" />
        <Dialog.Content
          ref={contentRef}
          onOpenAutoFocus={event => {
            event.preventDefault()
            contentRef.current
              ?.querySelector<HTMLButtonElement>('[data-cancel]')
              ?.focus()
          }}
          className="w-[calc(100vw-2rem)] max-w-[380px] fixed bg-dark-bg-lighter text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-confirm-content p-5 flex flex-col gap-4"
        >
          <Dialog.Title className="text-white font-semibold">
            {title}
          </Dialog.Title>
          <Dialog.Description asChild>
            <div className="text-sm text-gray-400">{description}</div>
          </Dialog.Description>
          {children}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button
                variant="secondary"
                data-cancel
                disabled={lockWhileLoading && isLoading}
              >
                Cancelar
              </Button>
            </Dialog.Close>
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              loading={isLoading}
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
