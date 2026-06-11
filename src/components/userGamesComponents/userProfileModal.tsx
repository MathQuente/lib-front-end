import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function UserProfileModal({
  open,
  onOpenChange,
  children
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg max-h-[90vh] flex flex-col bg-[#1F2029] border border-[#2A2B36] rounded-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2B36] flex-shrink-0">
            <Dialog.Title className="text-white font-semibold">
              Editar perfil
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-white transition-colors p-0.5">
              <X size={18} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Formulário para editar informações do perfil
          </Dialog.Description>
          <div className="overflow-y-auto flex-1">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

UserProfileModal.Close = Dialog.Close
