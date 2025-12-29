import { Outlet } from 'react-router-dom'
import { SideBar } from './components/sideBar'

export function Layout() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#1A1C26] px-20 md:px-40 lg:px-20 xl:px-24 2xl:px-80 pt-4">
      <SideBar />
      <Outlet />
    </div>
  )
}
