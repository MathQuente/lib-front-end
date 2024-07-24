import * as Dialog from '@radix-ui/react-dialog'

import { ReactNode } from 'react'

export default function GameModal({
  open,
  onOpenChange,
  children
}: {
  open: boolean
  onOpenChange: (open: boolean) => void

  children?: ReactNode
}) {
  // const dateFormatter = (release: string) => {
  //   return new Intl.DateTimeFormat('pt-BR', {
  //     dateStyle: 'medium'
  //   }).format(new Date(release))
  // }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed" />
        <Dialog.Content className="fixed bg-[#272932] pt-4 px-12 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg ">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-2xl"></Dialog.Title>
            <Dialog.Description></Dialog.Description>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

GameModal.Close = Dialog.Close
