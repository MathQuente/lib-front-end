import dayjs from 'dayjs'
import type { Game } from '../types/games'
import { GameCard } from './gamesComponents/gameCard'
import { Link } from 'react-router-dom'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface GameListSectionProps extends ComponentProps<'div'> {
  games: Game[]
  seeMore?: boolean
  title: string
}

export function GameListSection({
  games,
  seeMore,
  title,
  className
}: GameListSectionProps) {
  const baseStyles = 'flex flex-col items-center justify-center'

  return (
    <>
      {seeMore ? (
        <div className={twMerge(baseStyles, className)}>
          <div className="w-full max-w-sm">
            <div className="flex flex-row justify-between w-full mb-3">
              <p className="text-[#7A38CA] font-medium">{title}</p>
              <p className="text-gray-600">See more</p>
            </div>
            <div className="flex flex-col gap-y-3">
              {games.map(game => (
                <div className="flex flex-row w-full gap-2" key={game.id}>
                  <Link to={`/games/${game.id}`}>
                    <GameCard game={game} size="small" />
                  </Link>
                  <div>
                    <Link to={`/games/${game.id}`}>
                      <p className="text-white font-sans text-base font-medium hover:text-[#7A38CA] ">
                        {game.gameName}
                      </p>
                    </Link>
                    <p className="text-gray-400">
                      {dayjs(game.gameLaunchers[0].dateRelease).format(
                        'MMM DD'
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={twMerge(baseStyles, className)}>
          <div className="w-full max-w-sm">
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
                      <p className="text-white font-sans lg:text-base lg:font-normal xl:text-lg font-medium hover:text-[#7A38CA]">
                        {game.gameName}
                      </p>
                    </Link>
                    <p className="text-gray-400">
                      {dayjs(game.gameLaunchers[0].dateRelease).format(
                        'MMM DD'
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
