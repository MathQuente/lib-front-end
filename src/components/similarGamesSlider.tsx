import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { SimilarGamesSliderProps } from '../interfaces/games'
import { focusRing } from '../styles/focus'
import { GameCard } from './gamesComponents/gameCard'
import { SectionHeading } from './sectionHeading'

export function SimilarGamesSlider({ SimilarGames }: SimilarGamesSliderProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const games = SimilarGames.similarGames

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: games.length > 5, align: 'start', dragFree: true },
    prefersReducedMotion
      ? []
      : [
          Autoplay({
            delay: 2500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies(games.length): games.length só dispara o efeito, o carrossel reinicia quando a quantidade de jogos muda
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
                className={`block rounded-lg ${focusRing}`}
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
