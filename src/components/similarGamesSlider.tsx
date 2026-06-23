import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { GameCard } from './gamesComponents/gameCard'
import type { SimilarGamesSliderProps } from '../interfaces/games'

export function SimilarGamesSlider({ SimilarGames }: SimilarGamesSliderProps) {
  if (!SimilarGames.similarGames.length) return null

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
      <h2 className="text-sm font-semibold text-gray-400 border-l-2 border-primary pl-3 uppercase tracking-wide mb-4">
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
        className="h-60"
      >
        {SimilarGames.similarGames.map(game => (
          <SwiperSlide
            key={game.igdbId}
            className="!flex !items-center !justify-center"
          >
            <Link to={`/games/${game.igdbId}`}>
              <GameCard game={game} size="larger" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
