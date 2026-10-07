import { useState } from 'react'
import { Button } from '../components/button'
import { EmptyLibrary } from '../components/libraryComponents/emptyLibrary'
import { ImportGamesModal } from '../components/libraryComponents/importGamesModal'
import { LibraryShelves } from '../components/libraryComponents/libraryShelves'
import { UserProfileDisplay } from '../components/userGamesComponents/userProfileDisplay'
import { usePlatformLinkResult } from '../hooks/usePlatformLinkResult'
import { useUserGames } from '../hooks/useUserGames'

const SKELETON_SHELVES = ['a', 'b', 'c']

export function UserLibrary() {
  usePlatformLinkResult()
  const [importOpen, setImportOpen] = useState(false)
  const {
    UserGamesResponse,
    isErrorUserGames,
    refetchUserGames,
    gamesByStatus,
    totalPerStatus,
  } = useUserGames(undefined, undefined, undefined, 'desc', 'completedAt')

  const openImport = () => setImportOpen(true)
  const isEmpty = UserGamesResponse?.total === 0

  return (
    <>
      <UserProfileDisplay
        onImport={UserGamesResponse && !isEmpty ? openImport : undefined}
      />

      {!UserGamesResponse &&
        (isErrorUserGames ? (
          <div className="mt-8 flex flex-col items-start gap-3">
            <p className="text-gray-400">
              Não foi possível carregar sua biblioteca agora.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetchUserGames()}
            >
              Tentar de novo
            </Button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-8" aria-busy="true">
            {SKELETON_SHELVES.map(key => (
              <div key={key} className="h-56 rounded-lg bg-dark-bg-light" />
            ))}
          </div>
        ))}

      {UserGamesResponse &&
        (isEmpty ? (
          <EmptyLibrary onImport={openImport} />
        ) : (
          <LibraryShelves
            games={gamesByStatus}
            totalPerStatus={totalPerStatus}
          />
        ))}

      <ImportGamesModal open={importOpen} onOpenChange={setImportOpen} />
    </>
  )
}
