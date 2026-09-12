import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import type { ReactNode } from 'react'

export function GameModal({
  open,
  onOpenChange,
  title,
  children
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children?: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed z-40" />
        <Dialog.Title asChild>
          <VisuallyHidden.Root>{title}</VisuallyHidden.Root>
        </Dialog.Title>
        <Dialog.Description>
          <VisuallyHidden.Root />
        </Dialog.Description>
        <Dialog.Content className="w-[calc(100vw-2rem)] max-w-[380px] lg:max-w-[700px] lg:h-[500px] fixed bg-dark-bg-lighter text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 overflow-y-auto max-h-[calc(100vh-2rem)]">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

GameModal.Close = Dialog.Close
