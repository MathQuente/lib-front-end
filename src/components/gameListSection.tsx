import dayjs from 'dayjs'
import type { Game } from '../types/games'
import { GameCard } from './gamesComponents/gameCard'
import { Link } from 'react-router-dom'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { FaStar, FaTimes } from 'react-icons/fa'

interface GameListSectionProps extends ComponentProps<'div'> {
  games: Game[]
  title: string
  type: string
}

export function GameListSection({
  games,
  title,
  className,
  type
}: GameListSectionProps) {
  const baseStyles = 'flex flex-col items-center justify-center w-full'

  if (games.length > 0 && type === 'coming') {
    return (
      <div className={twMerge(baseStyles, className)}>
        <div className="w-full max-w-sm py-2 rounded-md min-h-[550px]">
          <div className="flex flex-row justify-between w-full mb-3">
            <p className="text-[#7A38CA] font-medium">{title}</p>
            <Link
              to="/games/comingSoon"
              className="text-gray-600 hover:text-[#7A38CA]"
            >
              See More
            </Link>
          </div>
          <div className="flex flex-col gap-y-3">
            {games.map(game => (
              <div className="flex flex-row w-full gap-2" key={game.id}>
                <Link to={`/games/${game.id}`}>
                  <GameCard game={game} size="small" />
                </Link>
                <div>
                  <Link to={`/games/${game.id}`}>
                    <p className="text-white font-sans lg:text-base lg:font-normal xl:text-base xl:font-medium hover:text-[#7A38CA]">
                      {game.gameName}
                    </p>
                  </Link>
                  {
                    <p className="text-gray-400">
                      {dayjs(game.gameLaunchers[0].dateRelease).format(
                        'MMM DD YYYY'
                      )}
                    </p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (games.length === 0 && type === 'coming') {
    return (
      <div className={twMerge(baseStyles, className)}>
        <div className="w-full max-w-sm  px-4 py-2 rounded-md min-h-[550px]">
          <div className="flex flex-row justify-between w-full mb-3">
            <p className="text-[#7A38CA] font-medium">{title}</p>
            <Link to="/games/comingSoon" className="hover:text-[#7A38CA]">
              See More
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="text-center">
              <div className="mb-4">
                <FaTimes className="w-16 h-16 mx-auto text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhum jogo encontrado
              </h3>
              <p className="text-gray-400 text-sm">
                Não há jogos disponíveis no momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className={twMerge(baseStyles, className)}>
        <div className="w-full max-w-sm  px-4 py-2 rounded-md min-h-[550px]">
          <div className="flex flex-row justify-between w-full mb-3">
            <p className="text-[#7A38CA] font-medium">{title}</p>
          </div>
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="text-center">
              <div className="mb-4">
                <FaTimes className="w-16 h-16 mx-auto text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhum jogo encontrado
              </h3>
              <p className="text-gray-400 text-sm">
                Não há jogos disponíveis no momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'rateds') {
    return (
      <div className={twMerge(baseStyles, className)}>
        <div className="w-full max-w-sm  px-4 py-2 rounded-md min-h-[550px]">
          <div className="flex flex-row justify-between w-full mb-3">
            <p className="text-[#7A38CA] font-medium">{title}</p>
          </div>
          <div className="flex flex-col gap-y-3">
            {games.map(game => (
              <div className="flex flex-row w-full gap-2" key={game.id}>
                <Link to={`/games/${game.id}`}>
                  <GameCard game={game} size="small" />
                </Link>
                <div>
                  <Link to={`/games/${game.id}`}>
                    <p className="text-white font-sans lg:text-base lg:font-normal xl:text-base xl:font-medium hover:text-[#7A38CA]">
                      {game.gameName}
                    </p>
                  </Link>
                  <div className="flex items-center gap-x-0.5">
                    <p className="text-gray-400 text-sm">{game.ratingAvg}</p>
                    <FaStar className="size-3 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={twMerge(baseStyles, className)}>
        <div className="w-full max-w-sm  px-4 py-2 rounded-md min-h-[550px]">
          <div className="flex flex-row justify-between w-full mb-3">
            <p className="text-[#7A38CA] font-medium">{title}</p>
          </div>
          <div className="flex flex-col gap-y-3">
            {games.map(game => (
              <div className="flex flex-row w-full gap-2" key={game.id}>
                <Link to={`/games/${game.id}`}>
                  <GameCard game={game} size="small" />
                </Link>
                <div>
                  <Link to={`/games/${game.id}`}>
                    <p className="text-white font-sans lg:text-base lg:font-normal xl:text-base xl:font-medium hover:text-[#7A38CA]">
                      {game.gameName}
                    </p>
                  </Link>
                  {
                    <p className="text-gray-400">
                      {dayjs(game.gameLaunchers[0].dateRelease).format(
                        'MMM DD YYYY'
                      )}
                    </p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
