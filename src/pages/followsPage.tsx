import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserMinus, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useFollowers } from '../hooks/useFollowers'
import { useFollowing } from '../hooks/useFollowing'
import { useFollow } from '../hooks/useFollow'
import { BackButton } from '../components/backButton'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import type { FollowSummary } from '../types/follow'

function FollowerRow({
  user,
  isFollowingBack
}: {
  user: FollowSummary
  isFollowingBack: boolean
}) {
  const { follow, isMutating } = useFollow(user.id)

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-dark-border bg-dark-bg-lighter pl-2 pr-1.5 py-1.5">
      <Link
        to={`/users/${user.id}`}
        className="flex items-center gap-2 min-w-0 flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
      >
        <img
          src={user.profilePicture || userProfilePictureDefault}
          alt=""
          className="size-7 rounded-full object-cover border border-dark-border shrink-0"
        />
        <span className="text-sm text-white truncate hover:text-primary transition-colors">
          {user.userName ?? 'Usuário'}
        </span>
      </Link>
      {!isFollowingBack && (
        <button
          type="button"
          onClick={() => follow()}
          disabled={isMutating}
          title="Seguir de volta"
          aria-label={`Seguir ${user.userName ?? 'usuário'} de volta`}
          className="flex items-center justify-center size-7 rounded-md text-primary hover:bg-dark-bg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50"
        >
          <UserPlus className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function FollowingRow({ user }: { user: FollowSummary }) {
  const { unfollow, isMutating } = useFollow(user.id)

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-dark-border bg-dark-bg-lighter pl-2 pr-1.5 py-1.5">
      <Link
        to={`/users/${user.id}`}
        className="flex items-center gap-2 min-w-0 flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
      >
        <img
          src={user.profilePicture || userProfilePictureDefault}
          alt=""
          className="size-7 rounded-full object-cover border border-dark-border shrink-0"
        />
        <span className="text-sm text-white truncate hover:text-primary transition-colors">
          {user.userName ?? 'Usuário'}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => unfollow()}
        disabled={isMutating}
        title="Deixar de seguir"
        aria-label={`Deixar de seguir ${user.userName ?? 'usuário'}`}
        className="flex items-center justify-center size-7 rounded-md text-gray-400 hover:text-red-400 hover:bg-dark-bg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light disabled:opacity-50"
      >
        <UserMinus className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export function FollowsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'followers' | 'following'>('followers')

  const { followers } = useFollowers(user?.id)
  const { following } = useFollowing(user?.id)

  const followingIds = new Set(following.map(u => u.id))

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-lg transition-colors ${
      active
        ? 'bg-primary text-white font-semibold'
        : 'text-gray-400 hover:text-white'
    }`

  return (
    <>
      <BackButton className="mt-4" />

      <div className="w-full mt-2 flex flex-col gap-4">
        <h1 className="text-lg font-semibold text-white">Seguindo você</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('followers')}
            className={tabClass(tab === 'followers')}
          >
            Seguidores ({followers.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('following')}
            className={tabClass(tab === 'following')}
          >
            Seguindo ({following.length})
          </button>
        </div>

        <div className="bg-dark-bg-light border border-dark-border rounded-lg px-6 py-4">
          {tab === 'followers' ? (
            followers.length === 0 ? (
              <p className="text-sm text-gray-400">
                Ninguém te segue ainda.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {followers.map(follower => (
                  <FollowerRow
                    key={follower.id}
                    user={follower}
                    isFollowingBack={followingIds.has(follower.id)}
                  />
                ))}
              </div>
            )
          ) : following.length === 0 ? (
            <p className="text-sm text-gray-400">
              Você ainda não segue ninguém.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {following.map(followed => (
                <FollowingRow key={followed.id} user={followed} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
