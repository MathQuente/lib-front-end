import { LIBRARY_STATUS_BADGES } from '../gamesComponents/gameCard'

const ROW_SIZE = 14

const BAR_SEQUENCE = [
  'PLAYED',
  'PLAYING',
  'BACKLOG',
  'WISHLIST',
  'PLAYED',
  'BACKLOG',
  'PLAYED',
  'PLAYING',
  'WISHLIST',
  'BACKLOG',
  'PLAYED',
]

const ROWS = [
  { id: 'top', className: '', motion: '' },
  {
    id: 'middle',
    className: '',
    motion: '[animation-direction:reverse] [animation-duration:110s]',
  },
  {
    id: 'bottom',
    className: 'hidden lg:flex',
    motion: '[animation-duration:75s]',
  },
]

function buildRow(covers: string[], rowIndex: number) {
  return Array.from({ length: ROW_SIZE }, (_, i) => {
    const position = rowIndex * ROW_SIZE + i
    return {
      position,
      url: covers.length > 0 ? covers[position % covers.length] : null,
      bar: LIBRARY_STATUS_BADGES[
        BAR_SEQUENCE[(position + rowIndex * 3) % BAR_SEQUENCE.length]
      ].barColor,
    }
  })
}

export function CoverWall({ covers }: { covers: string[] }) {
  const hasCovers = covers.length > 0

  return (
    <div className="flex flex-col gap-2.5" aria-hidden="true">
      {ROWS.map((row, rowIndex) => {
        const tiles = buildRow(covers, rowIndex)
        return (
          <div key={row.id} className={`flex ${row.className}`}>
            <div
              className={`flex w-max gap-2.5 pr-2.5 ${
                hasCovers
                  ? `animate-wall-slide motion-reduce:animate-none ${row.motion}`
                  : ''
              }`}
            >
              {['a', 'b'].flatMap(copy =>
                tiles.map(tile => (
                  <div
                    key={`${copy}-${tile.position}`}
                    className="relative aspect-[3/4] w-24 flex-none overflow-hidden rounded-md bg-dark-bg-light lg:w-36"
                  >
                    {tile.url && (
                      <>
                        <img
                          src={tile.url}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover"
                        />
                        <span
                          className={`absolute inset-x-0 bottom-0 h-1 ${tile.bar}`}
                        />
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
