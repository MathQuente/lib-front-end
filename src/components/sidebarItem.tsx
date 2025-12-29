import { Link } from 'react-router-dom'
import type { MenuItem } from '../types/sidebar'

interface SideBarItemProps extends MenuItem {
  active: boolean
  // expanded: boolean
}

export function SideBarItem({
  to,
  text,
  icon,
  alert,
  active
}: // expanded
SideBarItemProps) {
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-[#7A38CA]'
          : 'hover:bg-indigo-50 text-gray-600'
      }`}
    >
      <Link to={to} className="flex items-center w-full">
        {icon}
        <span className={`overflow-hidden transition-all ${'w-52 ml-3'}`}>
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${''}`}
          />
        )}
      </Link>
      {/* {!expanded && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-[#7A38CA] text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )} */}
    </li>
  )
}
