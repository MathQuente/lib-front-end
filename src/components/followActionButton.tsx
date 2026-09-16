import { UserPlus, UserCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useFollow } from '../hooks/useFollow'
import { Button } from './button'

export function FollowActionButton({ userId }: { userId: string }) {
  const { user } = useAuth()
  const { isFollowing, isLoading, follow, unfollow, isMutating } =
    useFollow(userId)

  if (!user?.id || user.id === userId || isLoading) return null

  if (isFollowing) {
    return (
      <Button
        type="button"
        variant="cancel"
        onClick={() => unfollow()}
        loading={isMutating}
        title="Deixar de seguir"
      >
        <UserCheck className="size-4 mr-1.5" aria-hidden="true" />
        Seguindo
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="primary"
      onClick={() => follow()}
      loading={isMutating}
    >
      <UserPlus className="size-4 mr-1.5" aria-hidden="true" />
      Seguir
    </Button>
  )
}
