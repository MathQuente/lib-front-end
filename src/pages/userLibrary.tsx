// import { useState } from 'react'
import Navbar from '../components/navBar'
import SideBar from '../components/sideBar'

// import StatusFinished from '../../components/GamesByStatus/StatusFinished'
// import StatusPlaying from '../../components/GamesByStatus/StatusPlaying'
// import StatusPaused from '../../components/GamesByStatus/StatusPaused'

export default function UserLibrary() {
  // const [userGames, setUserGames] = useState([])

  // const playingGames = userGames
  //   .filter(game => game?.gameStatus?.status === 'playing')
  //   .slice(0, 5)

  // const playing = userGames?.filter(
  //   game => game?.gameStatus?.status === 'playing'
  // )

  // const finishedGames = userGames
  //   ?.filter(game => game?.gameStatus?.status === 'finished')
  //   .slice(0, 5)

  // const finished = userGames?.filter(
  //   game => game?.gameStatus?.status === 'finished'
  // )

  // const pausedGames = userGames
  //   ?.filter(game => game?.gameStatus?.status === 'paused')
  //   .slice(0, 5)

  // const paused = userGames?.filter(
  //   game => game?.gameStatus?.status === 'paused'
  // )

  return (
    <>
      <div className="flex flex-row w-full min-h-dvh bg-[#1A1C26] ">
        <SideBar />

        <Navbar />

        <div className=" flex flex-col place-items-stretch mt-40 mx-64 gap-4 2xl:h-full xl:h-full lg:h-full md:h-full">
          {/* <StatusPlaying playing={playing} playingGames={playingGames} />
          <StatusFinished finished={finished} finishedGames={finishedGames} />
          <StatusPaused paused={paused} pausedGames={pausedGames} /> */}
        </div>
      </div>
    </>
  )
}
