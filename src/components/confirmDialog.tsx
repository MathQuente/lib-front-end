import * as Dialog from '@radix-ui/react-dialog'
import { Button } from './button'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  onConfirm,
  isLoading
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  isLoading?: boolean
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed z-40" />
        <Dialog.Content className="w-[calc(100vw-2rem)] max-w-[380px] fixed bg-dark-bg-lighter text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-50 p-5 flex flex-col gap-4">
          <Dialog.Title className="text-white font-semibold">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400">
            {description}
          </Dialog.Description>
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="cancel">Cancelar</Button>
            </Dialog.Close>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-500"
              onClick={onConfirm}
              loading={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
