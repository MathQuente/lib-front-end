import { IoGameControllerOutline, IoPerson, IoExit } from 'react-icons/io5'
import { GoHomeFill } from 'react-icons/go'
import { FaGear } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import wheelSpinner from '../assets/wheelSpinner.svg'
// import { useEffect } from 'react'

export default function SideBar() {
  // useEffect(() => {
  //   if (Cookies.get('token')) {
  //     findUserLogged()
  //   }
  // }, [])

  // const navigate = useNavigate()

  // function signout() {
  //   Cookies.remove('token')
  //   navigate('/auth')
  // }

  return (
    <>
      <div className="w-[126px]  bg-[#272932] flex flex-col justify-between py-20 items-center fixed 2xl:h-full xl:h-full lg:h-full md:h-full sm:h-full">
        <h2 className="text-[#FFFFFF]">Logo</h2>
        <ul className="flex flex-col justify-center items-center gap-10">
          <Link to="/">
            <li className="">
              <GoHomeFill className="size-8 text-[#8F8F8F]" />
            </li>
          </Link>
          <Link to="/library">
            <li>
              <IoPerson className="size-8 text-[#8F8F8F]" />
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

          <Link to="/profile">
            <li>
              <FaGear className="size-8 text-[#8F8F8F]" />
            </li>
          </Link>
          <Link to="/auth">
            <li>
              <IoExit className="size-8 text-[#8F8F8F]" />
            </li>
          </Link>
        </ul>
      </div>
    </>
  )
}
