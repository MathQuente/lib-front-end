import { SideBar } from './components/sideBar'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useApi } from './hooks/useApi'

import { Link } from 'react-router-dom'

import { Autoplay } from 'swiper/modules'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { useAuth } from './hooks/useAuth'

import userLibrary from './assets/Screenshot From 2025-07-03 18-09-08.png'
import { Button } from './components/button'
import { GameListSection } from './components/gameListSection'
import { GameCard } from './components/gamesComponents/gameCard'
import { useUserGames } from './hooks/useUserGames'
import type {
  GamesFromHomePageResponse,
  GameToDisplayResponse
} from './types/games'
import { useGames } from './hooks/useGames'

export function App() {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const isLogged = !!userId

  const api = useApi()

  const { data: GamesResponse2 } = useQuery<GamesFromHomePageResponse>({
    queryKey: ['games', '', ''],
    queryFn: async () => api.getGamesFeatured(),
    placeholderData: keepPreviousData
  })

  const { data: GamesToDisplay } = useQuery<GameToDisplayResponse>({
    queryKey: ['games', userId],
    queryFn: async () => api.getGamesToDisplay(),
    placeholderData: keepPreviousData,
    enabled: Boolean(userId)
  })

  const { UserGamesResponse } = useUserGames()
  const { GamesResponse } = useGames(1, '', 'gameName', 'asc')

  if (!GamesResponse2) return null

  if (!GamesResponse) return null

  return (
    <>
      <div className="flex flex-col w-full min-h-screen bg-[#1A1C26]">
        <SideBar />
        <div className="flex flex-col items-center justify-center max-w-6xl md:ml-40 md:mr-20 lg:ml-60 lg:mr-44 xl:ml-96 xl:mr-40 px-4">
          {isLogged ? (
            <>
              <div className="flex flex-col items-center gap-2 pt-4">
                <span className="flex flex-row gap-1">
                  <p className="text-2xl lg:text-5xl text-white">
                    Welcome back to Lib
                  </p>
                  <p className="text-2xl lg:text-5xl text-[#7A38CA]">
                    {user?.userName}
                  </p>
                </span>
                <div className="flex flex-col items-center mt-6">
                  <p className="text-gray-400 mb-2">
                    {GamesToDisplay?.message}
                  </p>
                  <Link to={`/games/${GamesToDisplay?.game.id}`}>
                    <GameCard size="medium" game={GamesToDisplay?.game} />
                  </Link>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-zinc-200">Profile stats</p>

                  <div className="grid grid-cols-2 gap-x-3 items">
                    <div className="flex flex-col items-center">
                      <p className="text-zinc-400">Played</p>
                      <p className="text-zinc-400 font-semibold">
                        {UserGamesResponse?.userGames?.PLAYED
                          ? UserGamesResponse?.userGames?.PLAYED.length
                          : 0}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-zinc-400">Playing</p>
                      <p className="text-zinc-400 font-semibold">
                        {UserGamesResponse?.userGames?.PLAYING
                          ? UserGamesResponse?.userGames?.PLAYING.length
                          : 0}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-zinc-400">Backlog</p>
                      <p className="text-zinc-400 font-semibold">
                        {UserGamesResponse?.userGames?.BACKLOG
                          ? UserGamesResponse?.userGames?.BACKLOG.length
                          : 0}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-zinc-400">Wishlist</p>
                      <p className="text-zinc-400 font-semibold">
                        {UserGamesResponse?.userGames?.WISHLIST
                          ? UserGamesResponse?.userGames?.WISHLIST.length
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-between w-full mx-auto">
              <div className="flex flex-col items-center gap-4 pt-4">
                <h1 className="text-4xl lg:text-6xl text-white">
                  Welcome to Lib
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-lg text-gray-300">
                    Don't have an account?
                  </p>
                  <Link to="/auth">
                    <Button variant="secondary" size="sm">
                      Sign up now
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center w-full gap-4 mt-12">
                <h1 className="text-white text-3xl text-start">
                  A little about the Lib project
                </h1>
                <p className="text-gray-300">
                  Lib is an web application to track your games and maybe
                  discover others. It's a project that I started to learn and
                  improve my programming skills. My idea was to work on
                  something I'm passionate about, making the development process
                  more enjoyable. Is under progressive process and i hope you
                  enjoy!
                </p>
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <img
                    className="md:w-[450px] md:h-[250px] lg:w-[450px] lg:h-[250px] xl:w-[500px] xl:h-[300px] 2xl:w-[550px] 2xl:h-[350px] border-2 border-gray-600 border-solid rounded-sm"
                    src={userLibrary}
                    alt=""
                  />

                  <div>
                    <h1 className="text-2xl text-white">
                      Track all your every game
                    </h1>
                    <p className="text-gray-500">
                      You can log any game you've played or you are playing in
                      this moment and wish to play. More details of platforms
                      and time tracking will be add soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center pb-10 mt-8 max-w-6xl lg:ml-60 lg:mr-44 xl:ml-96 xl:mr-40 px-4">
          <h1 className="text-2xl lg:text-4xl text-[#7A38CA] font-medium">
            Recently releases
          </h1>

          <div className="w-full lg:max-w-6xl md:max-w-2xl">
            <Swiper
              slidesPerView={2} // Valor padrão para mobile
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 0
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 50
                },
                1280: {
                  slidesPerView: 5
                }
              }}
              autoplay={{
                delay: 1500,
                disableOnInteraction: false
              }}
              spaceBetween={20} // Valor padrão para mobile
              loop={true}
              modules={[Autoplay]}
              className="h-60"
            >
              {GamesResponse2.recentGames.map(game => (
                <SwiperSlide
                  key={game.id}
                  className="!flex !items-center !justify-center"
                >
                  <Link to={`/games/${game.id}`}>
                    <GameCard game={game} size="larger" />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:max-w-4xl xl:max-w-6xl md:ml-40 md:mr-20 lg:ml-60 lg:mr-44 xl:ml-96 xl:mr-40 px-4 mb-6">
          <GameListSection
            games={GamesResponse2.futureGames}
            seeMore
            title="Coming Soon"
          />

          <GameListSection
            games={GamesResponse2.mostBeatedsGames}
            title="Most Beateds"
            className="lg:ml-5"
          />

          <GameListSection
            games={GamesResponse2.mostBeatedsGames}
            title="Trending Games"
          />
        </div>
      </div>
    </>
  )
}
