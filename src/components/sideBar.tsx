import { IoGameControllerOutline, IoExit } from 'react-icons/io5'
import { VscLibrary } from 'react-icons/vsc'
import { GoHomeFill } from 'react-icons/go'
import { Link, useNavigate } from 'react-router-dom'
import wheelSpinner from '../assets/wheelSpinner.svg'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth/authContext'

export default function SideBar() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    auth.logout()
    navigate('/auth')
  }

  return (
    <>
      <div className="w-20 sm:w-20 md:w-24 lg:w-24 bg-[#272932] flex flex-col justify-between 
      py-20 items-center fixed h-full 2xl:h-full xl:h-full lg:h-full md:h-full sm:h-full">
        <h2 className="text-[#FFFFFF]">Logo</h2>
        <ul className="flex flex-col justify-center items-center gap-10">
          <Link to="/">
            <li className="">
              <GoHomeFill className="size-8 text-[#8F8F8F]" />
            </li>
          </Link>
          <Link to="/userLibrary">
            <li>
              <VscLibrary className="size-8 text-[#8F8F8F]" />
            </li>
          </Link>
          <Link to="/games">
            <li>
              <IoGameControllerOutline className="size-8 text-[#8F8F8F]" />
            </li>
          </Link>
          <Link to="/roulette">
            <li>
              <img src={wheelSpinner} className="size-8" alt="" />
            </li>
          </Link>

          <hr className="w-12 bg-[#757678]" />

          <li>
            <button type="button">
              <IoExit
                className="size-8 text-[#8F8F8F]"
                onClick={handleLogout}
              />
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}
