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
        className={`fixed flex flex-col top-0 left-0 h-full lg:w-36 xl:bg-[#272932] transition-width duration-300 text-white ${isOpen ? 'w-28 sm:w-44 md:w-40 bg-[#272932]' : 'w-0 md:w-0 md:left-4 lg:-left-4'}`}
      >
        <div
          className={`flex ${isOpen ? 'justify-between' : 'justify-center'} items-center px-4 pt-2`}
        >
          <h2
            className={`text-xl font-bold xl:block ${isOpen ? 'block' : 'hidden'}`}
          >
            Logo
          </h2>
          <button
            type="button"
            className="block xl:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoCloseSharp size={24} /> : <IoMenu size={24} />}
          </button>
        </div>

        <nav className={'mt-4'}>
          <ul>
            <Link className="" to="/">
              <li
                className={`flex  ${isOpen ? 'items-center' : 'justify-center'} p-4 hover:bg-gray-700 cursor-pointer`}
              >
                <IoHomeSharp size={24} />
                <span
                  className={`ml-4 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Home
                </span>
              </li>
            </Link>
            <Link to="/userLibrary">
              <li
                className={`flex  ${isOpen ? 'items-center' : 'justify-center'} p-4 hover:bg-gray-700 cursor-pointer`}
              >
                <IoLibrary size={24} />
                <span
                  className={`ml-4 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Library
                </span>
              </li>
            </Link>
            <Link to="/games">
              <li
                className={`flex  ${isOpen ? 'items-center' : 'justify-center'} p-4 hover:bg-gray-700 cursor-pointer`}
              >
                <IoGameController size={24} />
                <span
                  className={`ml-4 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Games
                </span>
              </li>
            </Link>
            <hr
              className={`w-12 lg:w-28 mx-auto ${isOpen ? 'w-20' : 'w-12 hidden'}`}
            />
            <button
              className="flex px-5 py-4 w-full hover:bg-gray-700 "
              type="button"
              onClick={handleLogout}
            >
              <li
                className={`flex cursor-pointer ${isOpen ? 'items-center' : 'justify-center hidden'}`}
              >
                <IoLogOut size={24} />
                <span
                  className={`ml-2 lg:block ${isOpen ? 'block' : 'hidden'}`}
                >
                  Logout
                </span>
              </li>
            </button>
          </ul>
        </nav>
      </div>
    </div>
  )
}
