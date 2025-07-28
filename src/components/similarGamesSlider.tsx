import type { SimilarGamesResponse } from '../types/games'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/autoplay'
import { Link } from 'react-router-dom'
import { GameCard } from './gamesComponents/gameCard'

interface SimilarGamesSliderProps {
  SimilarGames: SimilarGamesResponse
}

export function SimilarGamesSlider({ SimilarGames }: SimilarGamesSliderProps) {
  return (
    <div className="w-full lg:max-w-5xl md:max-w-2xl">
      <Swiper
        slidesPerView={3}
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
            slidesPerView: 4
          }
        }}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false
        }}
        spaceBetween={15}
        loop={true}
        modules={[Autoplay]}
        className="h-60"
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
