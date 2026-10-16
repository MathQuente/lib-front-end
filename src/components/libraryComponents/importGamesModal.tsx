import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '../../hooks/useUserProfile'
import { PsnImportSection } from '../userGamesComponents/psnImportSection'
import { SteamImportSection } from '../userGamesComponents/steamImportSection'
import { UserProfileModal } from '../userGamesComponents/userProfileModal'
import { XboxImportSection } from '../userGamesComponents/xboxImportSection'

export function ImportGamesModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { UserProfileResponse } = useUserProfile()
  const user = UserProfileResponse?.user
  const navigate = useNavigate()

  function viewLibrary() {
    onOpenChange(false)
    navigate('/userLibrary')
  }

  return (
    <UserProfileModal
      open={open}
      onOpenChange={onOpenChange}
      title="Importar jogos"
      description="Conecte uma conta para importar seus jogos"
    >
      <div className="flex flex-col gap-3 p-6">
        <SteamImportSection
          steamId={user?.steamId ?? null}
          steamPersonaName={user?.steamPersonaName ?? null}
          onViewLibrary={viewLibrary}
        />
        <PsnImportSection
          psnOnlineId={user?.psnOnlineId ?? null}
          onViewLibrary={viewLibrary}
        />
        <XboxImportSection
          xboxGamertag={user?.xboxGamertag ?? null}
          onViewLibrary={viewLibrary}
        />
      </div>
    </UserProfileModal>
  )
}
