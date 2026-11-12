import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { SectionHeading } from './sectionHeading'
import type { GameScreenshot, GameVideo } from '../types/games'
import { focusRing } from '../styles/focus'

function youtubeThumbUrl(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

function useCarouselKeyboardNav(
  isOpen: boolean,
  onPrev: () => void,
  onNext: () => void
) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onPrev, onNext])
}

function useRovingTabIndex(count: number) {
  const [active, setActive] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)
  const current = Math.min(active, Math.max(count - 1, 0))

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    const items = stripRef.current?.querySelectorAll<HTMLButtonElement>(
      ':scope > button'
    )
    if (!items || items.length === 0) return
    const last = items.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = Math.min(current + 1, last)
    else if (e.key === 'ArrowLeft') next = Math.max(current - 1, 0)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    setActive(next)
    items[next].focus()
  }

  return {
    stripRef,
    onKeyDown,
    tabIndexFor: (index: number) => (index === current ? 0 : -1),
    onItemFocus: (index: number) => setActive(index)
  }
}

function NavArrows({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors ${focusRing}`}
        title="Anterior"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors ${focusRing}`}
        title="Próxima"
        aria-label="Próxima"
      >
        <ChevronRight size={20} />
      </button>
    </>
  )
}

export function GameMediaGallery({
  screenshots = [],
  videos = []
}: {
  screenshots?: GameScreenshot[]
  videos?: GameVideo[]
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)

  const [videosRef] = useEmblaCarousel({ align: 'start', dragFree: true })
  const [screenshotsRef] = useEmblaCarousel({ align: 'start', dragFree: true })
  const videosRoving = useRovingTabIndex(videos.length)
  const screenshotsRoving = useRovingTabIndex(screenshots.length)

  const goPrevScreenshot = () =>
    setLightboxIndex(i =>
      i === null ? null : (i - 1 + screenshots.length) % screenshots.length
    )
  const goNextScreenshot = () =>
    setLightboxIndex(i => (i === null ? null : (i + 1) % screenshots.length))

  const goPrevVideo = () =>
    setActiveVideoIndex(i =>
      i === null ? null : (i - 1 + videos.length) % videos.length
    )
  const goNextVideo = () =>
    setActiveVideoIndex(i => (i === null ? null : (i + 1) % videos.length))

  useCarouselKeyboardNav(lightboxIndex !== null, goPrevScreenshot, goNextScreenshot)
  useCarouselKeyboardNav(activeVideoIndex !== null, goPrevVideo, goNextVideo)

  if (screenshots.length === 0 && videos.length === 0) return null

  return (
    <div className="bg-dark-bg-light border border-dark-border rounded-lg p-5 flex flex-col gap-5">
      {videos.length > 0 && (
        <div>
          <SectionHeading className="mb-3">Trailers</SectionHeading>
          <div className="overflow-hidden" ref={videosRef}>
            <div
              className="flex gap-3"
              ref={videosRoving.stripRef}
              onKeyDown={videosRoving.onKeyDown}
            >
              {videos.map((video, index) => (
                <button
                  key={video.videoId}
                  type="button"
                  tabIndex={videosRoving.tabIndexFor(index)}
                  onFocus={() => videosRoving.onItemFocus(index)}
                  onClick={() => setActiveVideoIndex(index)}
                  className={`group relative flex-none w-56 aspect-video rounded-lg overflow-hidden border border-dark-border ${focusRing}`}
                  title={video.name}
                >
                  <img
                    src={youtubeThumbUrl(video.videoId)}
                    alt={video.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <span className="flex items-center justify-center size-10 rounded-full bg-primary text-white">
                      <Play className="size-4 ml-0.5" fill="currentColor" />
                    </span>
                  </div>
                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-4 pb-1.5 text-left text-xs text-white truncate">
                    {video.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {screenshots.length > 0 && (
        <div>
          <SectionHeading className="mb-3">Screenshots</SectionHeading>
          <div className="overflow-hidden" ref={screenshotsRef}>
            <div
              className="flex gap-3"
              ref={screenshotsRoving.stripRef}
              onKeyDown={screenshotsRoving.onKeyDown}
            >
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.thumbUrl}
                  type="button"
                  tabIndex={screenshotsRoving.tabIndexFor(index)}
                  onFocus={() => screenshotsRoving.onItemFocus(index)}
                  onClick={() => setLightboxIndex(index)}
                  className={`flex-none w-56 aspect-video rounded-lg overflow-hidden border border-dark-border ${focusRing}`}
                  title="Ver em tamanho maior"
                >
                  <img
                    src={screenshot.thumbUrl}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Dialog.Root
        open={activeVideoIndex !== null}
        onOpenChange={open => !open && setActiveVideoIndex(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/80 inset-0 fixed z-40" />
          <Dialog.Title asChild>
            <VisuallyHidden.Root>Trailer</VisuallyHidden.Root>
          </Dialog.Title>
          <Dialog.Description asChild>
            <VisuallyHidden.Root>Vídeo do trailer</VisuallyHidden.Root>
          </Dialog.Description>
          <Dialog.Content className="w-[calc(100vw-2rem)] max-w-3xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
              {activeVideoIndex !== null && (
                <iframe
                  key={videos[activeVideoIndex].videoId}
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${videos[activeVideoIndex].videoId}?autoplay=1`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {videos.length > 1 && (
              <NavArrows onPrev={goPrevVideo} onNext={goNextVideo} />
            )}
            <Dialog.Close
              className={`absolute -top-10 right-0 text-gray-300 hover:text-white transition-colors p-1 rounded-sm ${focusRing}`}
              title="Fechar"
              aria-label="Fechar"
            >
              <X size={22} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={lightboxIndex !== null}
        onOpenChange={open => !open && setLightboxIndex(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/80 inset-0 fixed z-40" />
          <Dialog.Title asChild>
            <VisuallyHidden.Root>Screenshot</VisuallyHidden.Root>
          </Dialog.Title>
          <Dialog.Description asChild>
            <VisuallyHidden.Root>Imagem em tamanho maior</VisuallyHidden.Root>
          </Dialog.Description>
          <Dialog.Content className="w-[calc(100vw-2rem)] max-w-4xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="relative">
              {lightboxIndex !== null && (
                <img
                  src={screenshots[lightboxIndex].fullUrl}
                  alt=""
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                />
              )}
              {screenshots.length > 1 && (
                <NavArrows onPrev={goPrevScreenshot} onNext={goNextScreenshot} />
              )}
            </div>
            <Dialog.Close
              className={`absolute -top-10 right-0 text-gray-300 hover:text-white transition-colors p-1 rounded-sm ${focusRing}`}
              title="Fechar"
              aria-label="Fechar"
            >
              <X size={22} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
