import { FaMusic } from "react-icons/fa"
import { useUserData } from "../context/userContext"

const PlaylistCard = () => {
  const {user, isAuth}= useUserData()
  return (
    <div className="flex items-center p-3 sm:p-4 rounded-lg shadow-md cursor-pointer
    hover:bg-[#ffffff26] transition-all duration-300 w-full max-w-[400px] mx-auto">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 flex items-center justify-center rounded-md flex-shrink-0">
            <FaMusic className="text-white text-lg sm:text-xl"/>
        </div>
        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
            <h2 className="text-gray-400 text-xs sm:text-sm truncate">
                PlayList • {isAuth? <span>{user?.name}</span>: <span>{"User"}</span>}
            </h2>
        </div>
    </div>
  )
}

export default PlaylistCard