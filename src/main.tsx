import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Authentication } from './pages/authentication'
import { Home } from './pages/home'
import { Games } from './pages/games'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserLibrary } from './pages/userLibrary'
import { AuthProvider } from './contexts/auth/authProvider'
import { RequireAuth } from './contexts/auth/requireAuth'
import { GamePage } from './pages/gamePage'
import { UserGamesPageByStatus } from './pages/userGamesPages'
import { SearchResults } from './pages/searchResults'
import { ComingSoonPage } from './pages/comingSoonPage'
import { UserProfilePage } from './pages/userProfilePage'
import { GameReviewsPage } from './pages/gameReviewsPage'
import { FollowsPage } from './pages/followsPage'
import { Layout } from './layout'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/auth',
        element: <Authentication />
      },
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/search/:query',
        element: <SearchResults />
      },
      {
        path: '/games',
        element: <Games />
      },
      {
        path: '/games/comingSoon',
        element: <ComingSoonPage />
      },
      {
        path: '/games/:igdbId',
        element: <GamePage />
      },
      {
        path: '/games/:igdbId/reviews',
        element: <GameReviewsPage />
      },
      {
        path: '/follows',
        element: (
          <RequireAuth>
            <FollowsPage />
          </RequireAuth>
        )
      },
      {
        path: '/users/:userId',
        element: <UserProfilePage />
      },
      {
        path: '/userLibrary',
        element: (
          <RequireAuth>
            <UserLibrary />
          </RequireAuth>
        )
      },
      {
        path: '/userLibrary/:status',
        element: (
          <RequireAuth>
            <UserGamesPageByStatus />
          </RequireAuth>
        )
      }
    ]
  }
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
