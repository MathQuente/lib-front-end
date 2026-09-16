import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import userProfilePictureDefault from '../assets/Default_pfp.svg.png'
import type { FollowSummary } from '../types/follow'

export function FollowList({
  users,
  emptyMessage = 'Ninguém por aqui ainda.',
  renderAction
}: {
  users: FollowSummary[]
  emptyMessage?: string
  renderAction?: (user: FollowSummary) => ReactNode
}) {
  if (users.length === 0) {
    return <p className="text-sm text-gray-400">{emptyMessage}</p>
  }

  return (
    <div className="flex flex-col divide-y divide-dark-border">
      {users.map(user => (
        <div key={user.id} className="flex items-center gap-3 py-2.5">
          <Link
            to={`/users/${user.id}`}
            className="flex items-center gap-2.5 min-w-0 flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light rounded-sm"
          >
            <img
              src={user.profilePicture || userProfilePictureDefault}
              alt=""
              className="size-8 rounded-full object-cover border border-dark-border shrink-0"
            />
            <span className="text-sm text-gray-200 truncate hover:text-primary transition-colors">
              {user.userName ?? 'Usuário'}
            </span>
          </Link>
          {renderAction?.(user)}
        </div>
      ))}
    </div>
  )
}
