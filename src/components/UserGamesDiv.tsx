import { Link } from 'react-router-dom';
import { PiGameControllerBold } from 'react-icons/pi';
import { UserGameCard } from './userGamesComponents/userGameCard';
import { TotalPerStatus, UserGameDlcBase } from '../types/user';

interface GameStatus {
    userGames: UserGameDlcBase[]
    totalPerStatus: TotalPerStatus[]
    statusMap: any
}

export function UserGamesDiv ({ userGames, totalPerStatus, statusMap } : GameStatus) {
  console.log(userGames)
  // Agrupa os jogos por status
  const gamesByStatus = userGames.reduce((groups: any , game) => {
    const status = game.UserGamesStatus.status;
    if (!groups[status]) {
      groups[status] = []
    }
    groups[status].push(game)
    return groups
  }, {});


  return (
    <div className="space-y-8">
      {Object.entries<UserGameDlcBase[]>(gamesByStatus).map(([status, games]) => {
        const statusId = statusMap[status];
        const total = totalPerStatus.find(t => t.statusId === statusId)?.totalGames || 0;

        return (
          <div key={status} className="mt-8 bg-[#272932] lg:bg-black lg:ml-28 lg:mr-8">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white capitalize">
                  {status}
                </h2>
                <PiGameControllerBold className="text-white w-6 h-6" />
                <span className="text-white font-bold">{total}</span>
              </div>
              
              {games.length > 0 && (
                <Link to={`/userLibrary/${status}Games`} className="text-[#7A38CA] font-bold">
                  Show all
                </Link>
              )}
            </div>

            {games.length > 0 ? (
              <div className="px-4">
                <div className="grid grid-cols-6 gap-4">
                  <UserGameCard userGamesAndDlcs={games.slice(0, 6)} />
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <h2 className="text-black text-xl font-bold">
                  Sem jogos adicionados. Procure jogos{' '}
                  <Link to="/games" className="text-red-500">aqui</Link>.
                </h2>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
