import type { Game } from '../../types/games'
import { GameForm } from './gameForm'

export function GameInfo({
  afterSave,
  game,
}: {
  afterSave: () => void
  game: Game | null
}) {
  if (!game) {
    return null
  }

  return (
    <div key={game.id} className="flex flex-row h-full w-full">
      <div className="flex flex-col items-center justify-start w-full">
        <img
          className="rounded-s-lg justify-start w-full h-[500px]"
          src={game.gameBanner}
          alt=""
        />
      </div>
      <div className="flex flex-col justify-between p-4 w-full">
        <div className="flex flex-col items-center">
          <h1
            className={`${game.gameName.length < 20 ? 'text-xl font-bold' : 'text-lg font-bold'}`}
          >
            {game.gameName}
          </h1>
          {game?.platforms.length <= 2 ? (
            <div className="flex justify-center pt-2">
              {game.platforms.map(platform => (
                <div
                  className="bg-zinc-900 rounded-xl p-2 flex justify-center "
                  key={platform.id}
                >
                  <p className="text-gray-600 text-xl font-normal">
                    {platform.platformName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-2 pt-2">
              {game.platforms.map(platform => (
                <div
                  className="bg-zinc-900 rounded-2xl p-2 flex justify-center"
                  key={platform.id}
                >
                  <p className="text-gray-600 text-xl font-normal">
                    {platform.platformName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          {game?.platforms.length <= 2 ? (
            <div className="flex gap-2 justify-center pt-2">
              {game.categories.map(category => (
                <div
                  className="bg-gray-500 rounded-xl p-2 flex justify-center"
                  key={category.id}
                >
                  <p className="text-white text-xl font-normal">
                    {category.categoryName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-2 gap-y-2 pt-2">
              {game.categories.map(category => (
                <div
                  className="bg-gray-500 rounded-2xl p-2 flex justify-center"
                  key={category.id}
                >
                  <p className="text-white text-xl font-normal">
                    {category.categoryName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-2">
            <h2 className="text-xl font-semibold">Developer:</h2>
            {game?.gameStudios.map(gameStudio => (
              <p className="text-xl font-bold" key={gameStudio.id}>
                {gameStudio.studioName}
              </p>
            ))}
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-2">
            <h2 className="text-xl font-semibold">Publisher:</h2>
            {game?.publishers.map((publisher, index, array) => (
              <p className="text-xl font-bold" key={publisher.id}>
                {publisher.publisherName}
                {index < array.length - 1 && (
                  <span className="text-xl">, </span>
                )}
              </p>
            ))}
          </div>
        </div>
        <GameForm afterSave={afterSave} game={game} />
      </div>
    </div>
  )
}
