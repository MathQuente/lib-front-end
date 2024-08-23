import { Navbar } from './components/navBar'
import SideBar from './components/sideBar'

export function App() {
  return (
    <>
      <div className="bg-[#1A1C26] h-screen ">
        <Navbar />
        <SideBar />
      </div>
    </>
  )
}
