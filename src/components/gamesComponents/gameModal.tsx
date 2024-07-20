// import { getGamesStatus } from '../../services/gamesServices'
// import { useEffect, useState } from 'react'

import { Game } from '../../types'
import * as Dialog from '@radix-ui/react-dialog'

import { ReactNode } from 'react'
import { RxCross1 } from 'react-icons/rx'

export default function GameModal({
  open,
  onOpenChange,
  game,
  children
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  game: Game | null
  children?: ReactNode
}) {
  // const [valorSelecionado, setValorSelecionado] = useState('')

  // async function handleSubmitGame() {
  //   try {
  //     const body = { game, status: Number(valorSelecionado) }
  //     await addGame(body)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const handleGame = (event: any) => {
  //   setValorSelecionado(event.target.value)
  //   console.log(event.target.value)
  // }

  // useEffect(() => {
  //   listGamesStatus()
  // }, [])

  // const dateFormatter = (release: string) => {
  //   return new Intl.DateTimeFormat('pt-BR', {
  //     dateStyle: 'medium'
  //   }).format(new Date(release))
  // }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 inset-0 fixed" />
        <Dialog.Content className="fixed bg-[#272932] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[630px] h-[650px] ">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl">{game?.gameName}</Dialog.Title>
            <Dialog.Description></Dialog.Description>
            <Dialog.Close className="text-gray-400 hover:text-gray-500">
              <RxCross1 />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

GameModal.Close = Dialog.Close
