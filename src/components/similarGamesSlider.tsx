import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Link } from 'react-router-dom'
import { GameCard } from './gamesComponents/gameCard'
import { SectionHeading } from './sectionHeading'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { SimilarGamesSliderProps } from '../interfaces/games'

export function SimilarGamesSlider({ SimilarGames }: SimilarGamesSliderProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const games = SimilarGames.similarGames

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: games.length > 5, align: 'start', dragFree: true },
    prefersReducedMotion
      ? []
      : [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, games.length])

  if (!games.length) return null

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5">
      <SectionHeading>Jogos Similares</SectionHeading>

      <div className="overflow-hidden p-2" ref={emblaRef}>
        <div className="flex -ml-3">
          {games.map(game => (
            <div key={game.igdbId} className="flex-none w-32 pl-3">
              <Link
                to={`/games/${game.igdbId}`}
                className="block rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                <GameCard game={game} size="compact" interactive={false} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
