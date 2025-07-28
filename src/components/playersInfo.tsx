import { IoGameController, IoLibrary } from 'react-icons/io5'
import type { GameResponse } from '../types/games'
import { FaGift, FaPlay, FaStar } from 'react-icons/fa'

interface PlayerInfosProps {
  GameResponse: GameResponse
}

export function PlayersInfo({ GameResponse }: PlayerInfosProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <div className="flex w-full justify-between">
          <span className="flex items-center gap-1">
            <IoGameController className="w-5 h-5 text-gray-500" />
            <p className="text-gray-500 font-medium">Played</p>
          </span>
          <p className="text-gray-300 font-medium">
            {GameResponse.game.userGames.PLAYED || 0}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <span className="flex items-center gap-1">
            <FaPlay className="w-5 h-4 text-gray-500" />
            <p className="text-gray-500 font-medium">Playing</p>
          </span>
          <p className="text-gray-300 font-medium">
            {GameResponse.game.userGames.PLAYING || 0}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <span className="flex items-center gap-1">
            <IoLibrary className="w-5 h-4 text-gray-500" />
            <p className="text-gray-500 font-medium">Backlog</p>
          </span>
          <p className="text-gray-300 font-medium">
            {GameResponse.game.userGames.BACKLOCK || 0}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <span className="flex items-center gap-1">
            <FaGift className="w-5 h-4 text-gray-500" />
            <p className="text-gray-500 font-medium">Wishlist</p>
          </span>
          <p className="text-gray-300 font-medium">
            {GameResponse.game.userGames.WISHLIST || 0}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <span className="flex items-center gap-1">
            <FaStar className="w-5 h-4 text-gray-500" />
            <p className="text-gray-500 font-medium">Ratings</p>
          </span>
          <p className="text-gray-300 font-medium">
            {GameResponse.game.amountOfRatings}
          </p>
        </div>
      </div>
    </div>
  )
}
