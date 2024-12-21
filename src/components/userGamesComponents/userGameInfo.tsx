import type { UserGameDlcBase } from '../../types/user'
import { CategoriesDiv } from '../categoriesDiv'
import { PlatformDiv } from '../platformDiv'

import { UserGameForm } from './userGameForm'

export function UserGameInfo({
  afterSave,
  userGame,
}: {
  afterSave: () => void
  userGame: UserGameDlcBase | null
}) {
  if (!userGame) {
    return null
  }

  return (
    <div>
      <div key={userGame.id} className="flex flex-row h-full w-full">
        <div className="flex flex-col items-center justify-start w-2/5">
          <img
            className="rounded-s-lg h-[500px]"
            src={userGame.banner}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-between p-4 w-3/5">
          <div className="flex flex-col items-center gap-1">
            <h1
              className={`${(userGame.name.length || 0) < 20 ? 'text-xl font-bold' : 'text-lg font-bold'}`}
            >
              {userGame.name}
            </h1>
          </div>
          <div className="flex flex-row gap-2 flex-wrap justify-center">
            {(userGame.platforms || []).slice(0, 4).map(platform => (
              <PlatformDiv
                key={platform.id}
                platformName={platform.platformName}
              />
            ))}
            {(userGame.platforms || []).length > 4 && (
              <div>
                <span className="flex flex-row gap-1 text-slate-300 font-semibold">
                  There are
                  <p className="text-[#7A38CA] font-bold">
                    {(userGame.platforms || []).length - 4}
                  </p>
                  additional platforms.
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row gap-x-1 flex-wrap justify-center">
              <h2 className="text-xl font-semibold">Developer:</h2>
              {userGame.gameStudios?.map((gameStudio, index, array) => (
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
              {userGame.publishers?.map((publisher, index, array) => (
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
          <div className="flex flex-row gap-2 flex-wrap justify-center">
            {(userGame.categories || []).slice(0, 3).map(category => (
              <CategoriesDiv
                key={category.id}
                categoryName={category.categoryName}
              />
            ))}
            {(userGame.categories || []).length > 3 && (
              <span className="flex gap-1 text-slate-300 font-semibold">
                There are
                <p className="text-[#7A38CA] font-bold">
                  {(userGame.categories || []).length - 3}
                </p>
                additional categories.
              </span>
            )}
          </div>
          <UserGameForm afterSave={afterSave} item={userGame} />
        </div>
      </div>
    </div>
  )
}
