import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { PostLoginRedirect } from './components/postLoginRedirect'
import { RouteError } from './components/routeError'
import { AuthProvider } from './contexts/auth/authProvider'
import { RequireAuth } from './contexts/auth/requireAuth'
import { Layout } from './layout'
import { AboutPage } from './pages/aboutPage'
import { Authentication } from './pages/authentication'
import { ComingSoonPage } from './pages/comingSoonPage'
import { ContactPage } from './pages/contactPage'
import { ForgotPasswordPage } from './pages/forgotPasswordPage'
import { GamePage } from './pages/gamePage'
import { GameReviewsPage } from './pages/gameReviewsPage'
import { Games } from './pages/games'
import { Home } from './pages/home'
import { NotFoundPage } from './pages/notFoundPage'
import { PrivacyPage } from './pages/privacyPage'
import { ResetPasswordPage } from './pages/resetPasswordPage'
import { SearchResults } from './pages/searchResults'
import { TermsPage } from './pages/termsPage'
import { UserGamesPageByStatus } from './pages/userGamesPages'
import { UserLibrary } from './pages/userLibrary'
import { UserProfilePage } from './pages/userProfilePage'
import { VerifyEmailPage } from './pages/verifyEmailPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: query => query.state.status !== 'error',
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status && status >= 400 && status < 500) return false
        return failureCount < 3
      },
    },
  },
})

const router = createBrowserRouter([
  {
    element: (
      <>
        <PostLoginRedirect />
        <Layout />
      </>
    ),
    children: [
      {
        errorElement: <RouteError />,
        children: [
          {
            path: '/auth',
            element: <Authentication />,
          },
          {
            path: '/forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: '/reset-password',
            element: <ResetPasswordPage />,
          },
          {
            path: '/verify-email',
            element: <VerifyEmailPage />,
          },
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/search/:query',
            element: <SearchResults />,
          },
          {
            path: '/games',
            element: <Games />,
          },
          {
            path: '/games/comingSoon',
            element: <ComingSoonPage />,
          },
          {
            path: '/games/:igdbId',
            element: <GamePage />,
          },
          {
            path: '/games/:igdbId/reviews',
            element: <GameReviewsPage />,
          },
          {
            path: '/users/:userId',
            element: <UserProfilePage />,
          },
          {
            path: '/userLibrary',
            element: (
              <RequireAuth>
                <UserLibrary />
              </RequireAuth>
            ),
          },
          {
            path: '/userLibrary/:status',
            element: (
              <RequireAuth>
                <UserGamesPageByStatus />
              </RequireAuth>
            ),
          },
          {
            path: '/termos',
            element: <TermsPage />,
          },
          {
            path: '/privacidade',
            element: <PrivacyPage />,
          },
          {
            path: '/sobre',
            element: <AboutPage />,
          },
          {
            path: '/contato',
            element: <ContactPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
