import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import type { ReactNode } from 'react'

export function UserGameModal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed" />
        <Dialog.Title>
          <VisuallyHidden.Root />
        </Dialog.Title>
        <Dialog.Description>
          <VisuallyHidden.Root />
        </Dialog.Description>
        <Dialog.Content className="w-[700px] h-[500px] fixed bg-[#272932] text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

UserGameModal.Close = Dialog.Close
