import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useSearch } from "../context/searchbarContext";
import { useNavigate } from "react-router-dom";
import { useSongData } from "../context/songContext";
import axios from "axios";

const server = "https://api.imanargha.shop/song";

export default function SearchOverlay() {
  const {
    isSearchOpen,
    openSearch,
    closeSearch,
    searchQuery,
    setSearchQuery,
    songs,
    albums,
    loading,
    searchHistory,
  } = useSearch();

  const { setSongAndPlay } = useSongData();
  const [showWave, setShowWave] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        openSearch();
      } else if (event.key === "/") {
        event.preventDefault();
        openSearch();
      } else if (event.key === "Escape") {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch, closeSearch]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "auto";
  }, [isSearchOpen]);

  // Show wave animation on typing
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowWave(true);
    setTimeout(() => setShowWave(false), 400);
  };

  // Handle song play
  const handleSongPlay = async (song: any) => {
    try {
      const response = await axios.get(`${server}/api/v1/song/${song.id}`, {
        headers: { token: localStorage.getItem("token") }
      });
      setSongAndPlay(response.data);
      closeSearch();
    } catch (error) {
      console.error('Error fetching song data:', error);
    }
  };

  // Handle album navigation
  const handleAlbumClick = (albumId: string) => {
    closeSearch();
    navigate(`/album/${albumId}`);
    // Force reload to ensure fresh data
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center"
          onClick={closeSearch}
        >
          <motion.div
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white w-full max-w-md sm:max-w-lg mx-4 p-6 rounded-xl shadow-2xl border border-indigo-500/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeSearch}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Search Input */}
            <div className="mt-2 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search songs or albums..."
                className="w-full bg-gray-800 placeholder-gray-400 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />
              {showWave && (
                <motion.div
                  className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 h-1 w-3/4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: "center" }}
                />
              )}
            </div>

            {/* Loader */}
            {loading && (
              <div className="mt-4 text-center text-sm text-indigo-400 animate-pulse">
                Searching...
              </div>
            )}

            {/* Search Results */}
            {!loading && (songs.length > 0 || albums.length > 0) && (
              <div className="mt-6 space-y-6 text-sm max-h-96 overflow-y-auto pr-4">
                {songs.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-indigo-400">
                      Songs
                    </h2>
                    <ul className="space-y-2">
                      {songs.map((song) => (
                        <motion.li
                          key={song.id}
                          className="flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded transition duration-200"
                          whileHover={{ scale: 1.03 }}
                          onClick={() => handleSongPlay(song)}
                        >
                          <img
                            src={song.thumbnail || '/music.png'}
                            alt={song.title}
                            className="w-12 h-12 rounded-md object-cover shadow-md"
                          />
                          <div className="ml-4">
                            <p className="font-medium">{song.title}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {albums.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-pink-400">
                      Albums
                    </h2>
                    <ul className="space-y-2">
                      {albums.map((album) => (
                        <motion.li
                          key={album.id}
                          className="flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded transition duration-200"
                          whileHover={{ scale: 1.03 }}
                          onClick={() => handleAlbumClick(album.id)}
                        >
                          <img
                            src={album.thumbnail}
                            alt={album.title}
                            className="w-12 h-12 rounded-md object-cover shadow-md"
                          />
                          <div className="ml-4">
                            <p className="font-medium">{album.title}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Search History */}
            {!loading &&
              searchQuery.trim() === "" &&
              searchHistory.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2 text-gray-300">
                    Recent Searches
                  </h2>
                  <ul className="space-y-2">
                    {searchHistory.map((query, index) => (
                      <motion.li
                        key={index}
                        onClick={() => setSearchQuery(query)}
                        className="cursor-pointer text-gray-300 px-2 py-1 rounded transition hover:bg-gray-800 relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="typewriter">
                          {query}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
