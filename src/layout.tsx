import { useEffect } from 'react'
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { EmailVerificationNotice } from './components/emailVerificationNotice'
import { Footer } from './components/footer'
import { SideBar } from './components/sideBar'
import { useFocusOnRouteChange } from './hooks/useFocusOnRouteChange'
import { parsePage } from './utils/parsePage'

export function Layout() {
  useFocusOnRouteChange()
  const { pathname, hash, search } = useLocation()
  const navigationType = useNavigationType()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(search)
    const raw = params.get('page')
    if (raw === null) return

    const page = parsePage(raw)
    if (String(page) === raw) return

    if (page === 1) params.delete('page')
    else params.set('page', String(page))
    const next = params.toString()
    navigate({ search: next ? `?${next}` : '' }, { replace: true })
  }, [search, navigate])

  useEffect(() => {
    if (navigationType !== 'POP' && !hash) window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg mx-auto w-full max-w-[1920px] overflow-x-clip px-4 sm:px-6 lg:px-10 2xl:px-16 pt-4 pb-8">
      <SideBar />
      <EmailVerificationNotice />
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer theme="dark" />
    </div>
  )
}
