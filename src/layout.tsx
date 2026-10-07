import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Footer } from './components/footer'
import { SideBar } from './components/sideBar'

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg mx-auto w-full max-w-[1920px] overflow-x-clip px-4 sm:px-6 lg:px-10 2xl:px-16 pt-4 pb-8">
      <SideBar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer theme="dark" />
    </div>
  )
}
