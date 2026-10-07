import type { ReactNode } from 'react'
import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

const factButton =
  'rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light'

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <>
      <b className="font-semibold tabular-nums text-white">{value}</b> {label}
    </>
  )
}

interface ProfileHeaderProps {
  userName: string
  profilePicture?: string | null
  bannerUrl?: string | null
  gamesAmount: number
  totalHoursPlayed: number
  followersCount: number
  followingCount: number
  onFollowersClick: () => void
  onFollowingClick: () => void
  actions?: ReactNode
}

export function ProfileHeader({
  userName,
  profilePicture,
  bannerUrl,
  gamesAmount,
  totalHoursPlayed,
  followersCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
  actions,
}: ProfileHeaderProps) {
  return (
    <header className="border-b border-dark-border pb-5">
      {bannerUrl && (
        <div className="-mx-4 h-32 overflow-hidden sm:mx-0 sm:h-44 sm:rounded-b-lg lg:h-56">
          <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div
        className={`flex flex-wrap items-end gap-x-5 gap-y-3 ${bannerUrl ? '' : 'pt-6'}`}
      >
        <img
          src={profilePicture || userProfilePictureDefault}
          alt={`Foto de perfil de ${userName}`}
          className={`relative size-16 flex-none rounded-full border-4 border-dark-bg bg-dark-bg object-cover lg:size-20 ${bannerUrl ? '-mt-6' : ''}`}
        />

        <div className={`min-w-0 flex-1 basis-48 ${bannerUrl ? 'pt-3' : ''}`}>
          <h1 className="truncate font-display text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
            {userName}
          </h1>
          <p className="mt-1 flex flex-wrap gap-x-5 gap-y-0.5 text-sm text-gray-400">
            <span>
              <Fact
                value={gamesAmount.toLocaleString('pt-BR')}
                label={gamesAmount === 1 ? 'jogo' : 'jogos'}
              />
            </span>
            {totalHoursPlayed > 0 && (
              <span>
                <Fact
                  value={`${Number(totalHoursPlayed.toFixed(1)).toLocaleString('pt-BR')} h`}
                  label="jogadas"
                />
              </span>
            )}
            <button
              type="button"
              onClick={onFollowersClick}
              className={factButton}
            >
              <Fact
                value={followersCount.toLocaleString('pt-BR')}
                label={followersCount === 1 ? 'seguidor' : 'seguidores'}
              />
            </button>
            <button
              type="button"
              onClick={onFollowingClick}
              className={factButton}
            >
              <Fact
                value={followingCount.toLocaleString('pt-BR')}
                label="seguindo"
              />
            </button>
          </p>
        </div>

        {actions && (
          <div className={`flex flex-wrap gap-2 ${bannerUrl ? 'pt-3' : ''}`}>
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
