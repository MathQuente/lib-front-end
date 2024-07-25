import React from 'react'
import ReactDOM from 'react-dom/client'
// import { App } from './app'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Authetication } from './pages/authetication'
import { App } from './app'
import { Games } from './pages/games'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserLibrary } from './pages/userLibrary'
import { PlayingGamesPage } from './pages/playingGamesPage'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Authetication />
  },
  {
    path: '/',
    element: <App />
  },
  {
    path: '/games',
    element: <Games />
  },
  {
    path: '/userLibrary',
    element: <UserLibrary />
  },
  {
    path: '/userLibrary/playingGames',
    element: <PlayingGamesPage />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
