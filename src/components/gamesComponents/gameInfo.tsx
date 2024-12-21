import type { GameDlcBase } from '../../types/games'
import { CategoriesDiv } from '../categoriesDiv'
import { PlatformDiv } from '../platformDiv'
import { GameForm } from './gameForm'

export function GameInfo({
  afterSave,
  gameAndDlc,
}: {
  afterSave: () => void
  gameAndDlc: GameDlcBase | null
}) {
  if (!gameAndDlc) {
    return null
  }

  return (
    <div key={gameAndDlc.id} className="flex flex-row h-full w-full">
      <div className="flex flex-col items-center justify-start w-2/5">
        <img
          className="rounded-s-lg h-[500px]"
          src={gameAndDlc.banner}
          alt=""
        />
      </div>
      <div className="flex flex-col justify-between p-4 w-3/5">
        <div className="flex flex-col items-center gap-2">
          <h1
            className={`${(gameAndDlc.name.length || 0) < 30 ? 'text-xl font-bold' : 'text-lg font-bold'}`}
          >
            {gameAndDlc.name}
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {(gameAndDlc.platforms || []).slice(0, 4).map(platform => (
            <PlatformDiv
              key={platform.id}
              platformName={platform.platformName}
            />
          ))}
          {(gameAndDlc.platforms || []).length > 4 && (
            <div>
              <span className="flex flex-row gap-1 text-slate-300 font-semibold">
                There are
                <p className="text-[#7A38CA] font-bold">
                  {(gameAndDlc.platforms || []).length - 4}
                </p>
                additional platforms.
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-x-1 flex-wrap justify-center">
            <h2 className="text-xl font-semibold">Developer:</h2>
            {gameAndDlc.gameStudios?.map((gameStudio, index, array) => (
              <p
                className="text-xl font-bold text-slate-400"
                key={gameStudio.id}
              >
                {gameStudio.studioName}
                {index < array.length - 1 && (
                  <span className="text-lg text-white">, </span>
                )}
              </p>
            ))}
          </div>
          <div className="flex flex-row gap-x-1 flex-wrap justify-center">
            <h2 className="text-xl font-semibold">Publisher:</h2>
            {gameAndDlc.publishers?.map((publisher, index, array) => (
              <p
                className="text-xl font-bold text-slate-400"
                key={publisher.id}
              >
                {publisher.publisherName}
                {index < array.length - 1 && (
                  <span className="text-xl text-white">, </span>
                )}
              </p>
            ))}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {(gameAndDlc.categories || []).slice(0, 3).map(category => (
            <CategoriesDiv
              key={category.id}
              categoryName={category.categoryName}
            />
          ))}
          {(gameAndDlc.categories || []).length > 3 && (
            <span className="flex gap-1 text-slate-300 font-semibold">
              There are
              <p className="text-[#7A38CA] font-bold">
                {(gameAndDlc.categories || []).length - 3}
              </p>
              additional categories.
            </span>
          )}
        </div>
        <GameForm afterSave={afterSave} item={gameAndDlc} />
      </div>
    </div>
  )
}
