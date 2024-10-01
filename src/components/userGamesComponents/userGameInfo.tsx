import * as Collapsible from '@radix-ui/react-collapsible'

import { useState } from 'react'

import { RxCross1, RxRowSpacing } from 'react-icons/rx'
import type { UserGame } from '../../types/user'

import { UserGameForm } from './userGameForm'

export function UserGameInfo({
  afterSave,
  userGame,
}: {
  afterSave: () => void
  userGame: UserGame | null
}) {
  const [open, setOpen] = useState(false)

  if (!userGame) {
    return null
  }

  return (
    <div key={userGame.game.id} className="flex flex-row h-full w-full">
      <div className="flex flex-col items-center justify-start w-full">
        <div className="flex justify-start w-full h-[500px]">
          <img
            className="rounded justify-start w-full h-[550px]"
            src={userGame.game.gameBanner}
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-col justify-between p-4 w-full">
        <div className="flex flex-col items-center">
          <h1
            className={`${userGame.game.gameName.length < 20 ? 'text-xl font-bold' : 'text-lg font-bold'}`}
          >
            {userGame.game.gameName}
          </h1>
          <Collapsible.Root className="pt-3" open={open} onOpenChange={setOpen}>
            {userGame.game.platforms.length === 1 && (
              <div className="flex justify-center">
                <h2 className="text-white text-xl font-semibold">Platforms</h2>
              </div>
            )}
            {userGame.game.platforms.length > 2 && (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-white text-xl font-semibold">Platforms</h2>
                <Collapsible.Trigger asChild>
                  <button
                    type="button"
                    className="rounded-full size-7 flex items-center justify-center text-violet-500 outline-none
                     data-[state=closed]:bg-white data-[state=open]:bg-violet-700 data-[state=open]:text-white
                      hover:bg-violet-700 "
                  >
                    {open ? <RxCross1 /> : <RxRowSpacing />}
                  </button>
                </Collapsible.Trigger>
              </div>
            )}

            <div
              className={`${
                userGame.game.platforms.length === 1
                  ? 'flex justify-center pt-1'
                  : 'grid grid-cols-2 gap-x-8 gap-y-1 pt-2'
              }`}
            >
              {userGame.game.platforms.slice(0, 2).map((platform, index) => (
                <div
                  className="bg-gradient-to-t from-[#4D23A5] to-[#783FCF] rounded-2xl p-1  flex justify-center w-40"
                  key={`visible-${index}-${platform.platformName}`}
                >
                  <p className="text-white text-xl font-normal">
                    {platform.platformName}
                  </p>
                </div>
              ))}
            </div>

            <Collapsible.Content
              className={`${
                userGame.game.platforms.length === 1
                  ? 'flex justify-center'
                  : 'grid grid-cols-2 gap-x-8 gap-y-1 mt-1'
              } bg-[#272932]`}
            >
              {userGame.game.platforms.slice(2).map((platform, index) => (
                <div
                  className="bg-gradient-to-t from-[#4D23A5] to-[#783FCF] rounded-2xl p-1 flex justify-center w-40"
                  key={`hidden-${index}-${platform.platformName}`}
                >
                  <p className="text-white text-xl font-normal">
                    {platform.platformName}
                  </p>
                </div>
              ))}
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div>
            <h1 className="text-xl font-bold">Tags</h1>
          </div>
          <div className="grid  grid-cols-2 gap-2 mt-1">
            {userGame?.game.categories.map((category, index) => (
              <span
                className="bg-black rounded-2xl flex justify-center items-center p-2"
                key={`category-${index}-${category.id}`}
              >
                <p className="text-white font-semibold text-lg">
                  {category.categoryName}
                </p>
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-2">
            <h2 className="text-xl font-semibold">Developer:</h2>
            <p className="text-xl font-bold">
              {userGame.game.gameStudio.studioName}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <h2 className="text-xl font-semibold">Publisher:</h2>
            <p className="text-xl font-bold">
              {userGame.game.publisher.publisherName}
            </p>
          </div>
        </div>
        <UserGameForm afterSave={afterSave} userGame={userGame} />
      </div>
    </div>
  )
}
