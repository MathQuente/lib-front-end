export function UserInfo({
  userName,
  gamesAmount,
  totalHoursPlayed,
  followersCount,
  followingCount,
  onFollowersClick,
  onFollowingClick
}: {
  userName: string
  gamesAmount: number
  totalHoursPlayed: number
  followersCount?: number
  followingCount?: number
  onFollowersClick?: () => void
  onFollowingClick?: () => void
}) {
  return (
    <div className="min-w-0">
      <p className="text-white font-semibold truncate">{userName}</p>
      <p className="text-gray-400 text-sm">
        {gamesAmount.toLocaleString()} {gamesAmount === 1 ? 'jogo' : 'jogos'}
        {totalHoursPlayed > 0 &&
          ` · ${Number(totalHoursPlayed.toFixed(1)).toLocaleString()}h jogadas`}
        {followersCount !== undefined && (
          <>
            {' · '}
            <button
              type="button"
              onClick={onFollowersClick}
              className="text-gray-400 hover:text-primary hover:underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
            >
              {followersCount.toLocaleString()}{' '}
              {followersCount === 1 ? 'seguidor' : 'seguidores'}
            </button>
          </>
        )}
        {followingCount !== undefined && (
          <>
            {' · '}
            <button
              type="button"
              onClick={onFollowingClick}
              className="text-gray-400 hover:text-primary hover:underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
            >
              {followingCount.toLocaleString()} seguindo
            </button>
          </>
        )}
      </p>
    </div>
  )
}
