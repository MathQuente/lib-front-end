import { useEffect, useState } from 'react'

import type { Game } from '../types/games'

interface UserGameEntry {
  game: Game
}

import { Flip, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom'
import { api } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'

export function RouletteWheel() {
  const [options, setOptions] = useState<UserGameEntry[]>([])
  const [gameWinner, setGameWinner] = useState<Game>()

  const { user } = useAuth()
  const userId = user?.id ?? ''

  useEffect(() => {
    const fetchFinishedGames = async () => {
      if (userId) {
        const data = await api.getUserGames(1, '', undefined, 'gameName', 'asc')
        setOptions(data.userFinishedGames ?? [])
      }
    }
    fetchFinishedGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  function drawGame() {
    const games = options.filter(({ game }) => game?.id !== gameWinner?.id)
    const sort = Math.floor(Math.random() * games.length)
    setGameWinner(games[sort]?.game as Game | undefined)
  }

  async function addGametoPlaying() {
    if (!gameWinner) return
    await api.updateGameStatus(gameWinner.id, 2)
    setOptions((oldData: UserGameEntry[]) =>
      oldData.filter(({ game }) => game?.id !== gameWinner?.id)
    )
    toast.success('game add to playing', {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Flip,
      toastId: gameWinner.id
    })
    drawGame()
  }

  function removeGame() {
    setOptions((oldData: UserGameEntry[]) =>
      oldData.filter(({ game }) => game?.id !== gameWinner?.id)
    )
    drawGame()
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col items-center mt-4">
        <ToastContainer />

        {gameWinner && (
          <div className="flex flex-col items-center justify-center gap-2 pb-2">
            <img
              src={gameWinner?.gameBanner}
              className="w-[285px] h-[340px] rounded-md"
              alt=""
            />
            <p className="text-white font-bold text-xl uppercase">
              {gameWinner?.gameName}
            </p>
            <div className="flex gap-4">
              <button
                className="w-12 p-1 rounded-sm bg-red-600 text-white font-semibold"
                onClick={removeGame}
                disabled={options.length === 0}
                type="button"
              >
                &#10005;
              </button>
              <button
                className="w-12 p-1 rounded-sm bg-green-500 text-white font-semibold"
                onClick={addGametoPlaying}
                type="button"
              >
                &#10003;
              </button>
            </div>
          </div>
        )}
        {!gameWinner && options.length > 0 && (
          <div className="pb-5 flex flex-col items-center gap-6">
            <div className="w-[285px] h-[340px] bg-[#272932] flex items-center justify-center rounded-md">
              <p className="text-4xl">PLACEHOLDER</p>
            </div>
            <button
              onClick={drawGame}
              type="button"
              className="w-60 p-2 rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105
              hover:from-[#5D23A5] hover:to-[#813FCF]
               text-white font-semibold"
            >
              Choose the next game to play
            </button>
          </div>
        )}
        {options.length === 0 && (
          <div className="pb-5 flex flex-col items-center justify-center gap-6">
            <div className="w-[285px] h-[340px] bg-[#272932] flex items-center justify-center rounded-md">
              <p className="text-4xl justify-center">game list is over</p>
            </div>
            <Link to="/games">
              <button
                type="button"
                className="p-2 rounded-2xl bg-gradient-to-t from-[#4D23A5] to-[#783FCF] brightness-105
              hover:from-[#5D23A5] hover:to-[#813FCF]
               text-white font-semibold w-44"
              >
                Search more
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
