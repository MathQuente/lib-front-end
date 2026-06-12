import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { GameCard } from './gamesComponents/gameCard'
import type { SimilarGamesSliderProps } from '../interfaces/games'

export function SimilarGamesSlider({ SimilarGames }: SimilarGamesSliderProps) {
  if (!SimilarGames.similarGames.length) return null

  return (
    <div className="bg-[#1F2029] border border-[#2A2B36] rounded-lg p-5">
      <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-[#7A38CA] pl-3 uppercase tracking-wide mb-4">
        Jogos Similares
      </h2>

      <Swiper
        slidesPerView={3}
        spaceBetween={12}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 12 },
          768: { slidesPerView: 4, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 20 }
        }}
        modules={[Autoplay]}
        className="h-52"
      >
        {SimilarGames.similarGames.map(game => (
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
  )
}
