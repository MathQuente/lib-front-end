import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SideBar } from './components/sideBar'

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      <SideBar />
      <Outlet />
      <ToastContainer theme="dark" />
    </div>
  )
}
