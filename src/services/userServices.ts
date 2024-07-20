import axios from 'axios'
import { Cookies } from 'typescript-cookie'
// import { Cookies } from 'typescript-cookie'

interface Data {
  email: string
  password: string
}

const baseUrl = 'http://localhost:3333'

// const token = Cookies.get('token')

export function signUp(data: Data) {
  const body = { ...data }
  const response = axios.post(`${baseUrl}/users`, body)
  return response
}

export async function login(data: Data) {
  try {
    const response = await axios.post(`${baseUrl}/users/login`, data)
    const { token, userId } = response.data

    // Armazenar o token e o userId
    Cookies.set('token', token)
    localStorage.setItem('userId', userId)

    return { token, userId }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw error
  }
}
