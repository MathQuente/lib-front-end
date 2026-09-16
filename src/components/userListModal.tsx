import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { FollowList } from './followList'
import type { FollowSummary } from '../types/follow'

export function UserListModal({
  open,
  onOpenChange,
  title,
  users,
  renderAction
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  users: FollowSummary[]
  renderAction?: (user: FollowSummary) => ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs max-h-[80vh] flex flex-col bg-dark-bg-light border border-dark-border rounded-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border flex-shrink-0">
            <Dialog.Title className="text-white font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="text-gray-500 hover:text-white transition-colors p-0.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              title="Fechar"
              aria-label="Fechar"
            >
              <X size={18} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Lista de usuários
          </Dialog.Description>
          <div className="overflow-y-auto flex-1 px-6 py-4">
            <FollowList users={users} renderAction={renderAction} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
