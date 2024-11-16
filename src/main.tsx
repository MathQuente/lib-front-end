import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Authentication } from './pages/authentication'
import { App } from './app'
import { Games } from './pages/games'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserLibrary } from './pages/userLibrary'
import { PlayingGamesPage } from './pages/playingGamesPage'
import { FinishedGamesPage } from './pages/finishedGamesPage'
import { PausedGamesPage } from './pages/pausedGamesPage'
import { RouletteWheel } from './pages/rouletteWheel'
import { AuthProvider } from './contexts/auth/authProvider'
import { RequireAuth } from './contexts/auth/requireAuth'
import { GamePage } from './pages/gamePage'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Authentication />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
  },
  {
    path: '/games',
    element: (
      <RequireAuth>
        <Games />
      </RequireAuth>
    ),
  },
  {
    path: '/games/:gameId',
    element: (
      <RequireAuth>
        <GamePage />
      </RequireAuth>
    ),
  },
  {
    path: '/roulette',
    element: <RouletteWheel />,
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
    path: '/userLibrary/playingGames',
    element: (
      <RequireAuth>
        <PlayingGamesPage />
      </RequireAuth>
    ),
  },
  {
    path: '/userLibrary/finishedGames',
    element: (
      <RequireAuth>
        <FinishedGamesPage />
      </RequireAuth>
    ),
  },
  {
    path: '/userLibrary/pausedGames',
    element: (
      <RequireAuth>
        <PausedGamesPage />
      </RequireAuth>
    ),
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
