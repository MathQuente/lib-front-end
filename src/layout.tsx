import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SideBar } from './components/sideBar'

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg px-4 sm:px-24 md:px-50 xl:px-60 2xl:px-72 pt-4 pb-8">
      <SideBar />
      <Outlet />
      <ToastContainer theme="dark" />
    </div>
  )
}
