import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PlaylistCard from "./PlaylistCard";
import { useUserData } from "../context/userContext";
import { Menu, X } from "lucide-react"; // You can install lucide-react if needed
import { useSearch } from "../context/searchbarContext";

const SideBar = () => {
  const navigate = useNavigate();
  const { isAuth } = useUserData();
  const [isOpen, setIsOpen] = useState(false);
  const {user}=useUserData()
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { openSearch } = useSearch();
  
  const openYoutube = () => {
    window.open("https://www.youtube.com/results?search_query=podcast+on+singing", "_blank");
  };
  return (
    <>
      {/* Toggle Button for small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#1c1c1c] p-2 rounded-full text-white shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-full w-64 bg-[#0d0d0d] text-white p-4 flex flex-col gap-4 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* === NAV LINKS === */}
        <div className="bg-[#1c1c1c] rounded-xl p-4 flex flex-col gap-4 shadow-md">
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-[#2a2a2a] px-4 py-2 rounded-lg transition"
            onClick={() => {
              navigate("/");
              setIsOpen(false); // close on navigation
            }}
          >
            <img src="/home.png" alt="Home" className="w-5" />
            <p className="font-semibold text-sm">Home</p>
          </div>

          <div
  
          className="flex items-center gap-3 cursor-pointer hover:bg-[#2a2a2a] px-4 py-2 rounded-lg transition"
            onClick={() => {
              openSearch();
              setIsOpen(false); // close sidebar if on mobile
            }}
          >
            <img src="/search.png" alt="Search" className="w-5" />
            <p className="font-semibold text-sm">Search</p>
            </div>
        </div>

        {/* === LIBRARY SECTION === */}
        <div className="bg-[#1c1c1c] rounded-xl p-4 flex flex-col gap-4 shadow-md flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/stack.png" className="w-6" alt="Library" />
              <p className="font-semibold text-sm">Your Library</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/arrow.png" className="w-5 cursor-pointer" alt="Arrow" />
              <img src="/plus.png" className="w-5 cursor-pointer" alt="Add" />
            </div>
          </div>

          {/* Playlist Card */}
          {isAuth && (
            <div
              className="cursor-pointer hover:scale-[1.01] transition-transform"
              onClick={() => {
                navigate("/playlist");
                setIsOpen(false);
              }}
            >
              <PlaylistCard />
            </div>
          )}

          {/* Podcast Promo Box */}
          <div className="bg-[#292929] p-4 rounded-xl text-sm flex flex-col gap-2 mt-4 shadow-inner">
            <h2 className="font-bold">Let’s find some podcasts to follow</h2>
            <p className="text-gray-300">We’ll keep you updated on new episodes.</p>
            <button className="mt-3 px-4 py-1.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition "
            onClick={openYoutube} >
              Browse Podcasts
            </button>
          </div>

         {user && user.role==='admin'&& <button onClick={()=>navigate('/admin/dashboard')} className="mt-3 px-4 py-1.5 bg-white cursor-pointer text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition">
              Admin Dashboard
            </button>}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
