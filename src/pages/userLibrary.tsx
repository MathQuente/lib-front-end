import { ToastContainer } from "react-toastify";

import { SideBar } from "../components/sideBar";

import { UserProfileDisplay } from "../components/userGamesComponents/userProfileDisplay";
import { UserGamesDiv } from "../components/UserGamesDiv";
import { useUserGames } from "../hooks/useUserGames";

export function UserLibrary() {
  const { UserGamesResponse } = useUserGames();

  if (!UserGamesResponse) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg-[#1A1C26] ">
        <SideBar />
        <div className="flex flex-col items-center mt-4">
          <div className="lg:ml-16">
            <UserProfileDisplay />
          </div>

          <UserGamesDiv
            Games={UserGamesResponse.games}
            totalPerStatus={UserGamesResponse.totalPerStatus}
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
