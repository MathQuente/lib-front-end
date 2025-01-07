import {
  IoGameController,
  IoLogOut,
  IoHomeSharp,
  IoCloseSharp,
  IoMenu,
  IoLibrary,
} from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
// import wheelSpinner from '../assets/wheelSpinner.svg'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/auth/authContext'

export function SideBar() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    auth.logout()
    navigate('/auth')
  }
  return (
    <div className="flex">
      <div
        className={`fixed flex flex-col   top-0 left-0 h-full lg:w-36 bg-[#272932] transition-width duration-300 text-white ${isOpen ? 'w-28 sm:w-44 md:w-48' : 'w-20'}`}
      >
        <div
          className={`flex ${isOpen ? 'justify-between' : 'justify-center'} items-center px-4 pt-2`}
        >
          <h2
            className={`text-xl font-bold lg:block ${isOpen ? 'block' : 'hidden'}`}
          >
            Logo
          </h2>
          <button
            type="button"
            className="block lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoCloseSharp size={24} /> : <IoMenu size={24} />}
          </button>
        </div>

        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <Link
                className={`flex  ${isOpen ? 'items-center' : 'justify-center'}`}
                to="/"
              >
                <IoHomeSharp size={24} />
                <span
                  className={`ml-4 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Home
                </span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <Link
                to="/userLibrary"
                className={`flex  ${isOpen ? 'items-center' : 'justify-center'}`}
              >
                <IoLibrary size={24} />
                <span
                  className={`ml-4 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Library
                </span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <Link
                to="/games"
                className={`flex  ${isOpen ? 'items-center' : 'justify-center'}`}
              >
                <IoGameController size={24} />
                <span
                  className={`ml-4 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Games
                </span>
              </Link>
            </li>
            <hr
              className={`w-12 lg:w-28 mx-auto ${isOpen ? 'w-28' : 'w-12'}`}
            />
            <li
              className={`flex p-4 hover:bg-gray-700 cursor-pointer ${isOpen ? 'items-center' : 'justify-center'}`}
            >
              <button className="flex" type="button" onClick={handleLogout}>
                <IoLogOut size={24} />
                <span
                  className={`ml-4 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
