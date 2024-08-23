import axios from 'axios'
import { Cookies } from 'typescript-cookie'
// import { Cookies } from 'typescript-cookie'

interface userDataProps {
  email: string
  password: string
}

interface gameBodyProps {
  gameId: string | undefined
}

interface userBodyProps {
  userName: string
  profilePicture: string
  userBanner: string
}

const baseUrl = 'http://localhost:3333'

// const token = Cookies.get('token')

export function signUp(data: userDataProps) {
  const body = { ...data }
  const response = axios.post(`${baseUrl}/users`, body)
  return response
}

export async function login(data: userDataProps) {
  try {
    const response = await axios.post(`${baseUrl}/users/login`, data)
    const { token } = response.data

    return { token }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw error
  }
}

export async function removeGame(body: gameBodyProps) {
  const userId = localStorage.getItem('userId')

  const response = axios.delete(
    `${baseUrl}/users/${userId}/userGames/${body.gameId}`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`
      }
    }
  )

  return response
}

export function updateUser(body: userBodyProps) {
  const userId = localStorage.getItem('userId')
  const response = axios.put(`${baseUrl}/users/${userId}`, body, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`
    }
  })
  return response
}
