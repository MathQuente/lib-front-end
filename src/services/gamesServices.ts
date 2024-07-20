// services/gamesServices.ts
import axios, { AxiosResponse } from 'axios'
import { Game } from '../types'
import { Cookies } from 'typescript-cookie'

const baseUrl = 'http://localhost:3333'

interface Body {
  gameId: string | undefined
  status: number
}

export async function fetchGames(): Promise<Game[]> {
  try {
    const response: AxiosResponse<Game[]> = await axios.get(`${baseUrl}/games`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    throw error
  }
}

export function addGame(body: Body) {
  const userId = localStorage.getItem('userId')

  const response = axios.post(
    `${baseUrl}/users/${userId}/userGames/${body.gameId}/${body.status}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      }
    }
  )

  return response
}

export function updateGameStatus(body: Body) {
  const userId = localStorage.getItem('userId')

  const response = axios.patch(
    `${baseUrl}/userGamesStatus/${userId}/${body.gameId}/${body.status}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      }
    }
  )

  return response
}

export function getGamesStatus() {
  const response = axios.get(`${baseUrl}/games/gameStatus`)
  return response
}
