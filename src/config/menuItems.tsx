import {
  IoGameController,
  IoHome,
  IoLibrary,
  IoLogInSharp
} from 'react-icons/io5'
import type { MenuItem } from '../types/sidebar'

export const menuItems: MenuItem[] = [
  { key: 'home', icon: <IoHome size={20} />, to: '/', text: 'Home' },
  {
    key: 'games',
    icon: <IoGameController size={20} />,
    to: '/games',
    text: 'Games'
  },
  {
    key: 'userLibrary',
    icon: <IoLibrary size={20} />,
    to: '/userLibrary',
    text: 'userLibrary',
    requiresAuth: true
  }
]

export const loginItem: MenuItem = {
  key: 'login',
  to: '/auth',
  icon: <IoLogInSharp className="text-[#7A38CA]" size={20} />,
  text: 'Entrar'
}
