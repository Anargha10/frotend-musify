import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { Song, useSongData } from "../context/songContext";
import { useUserData } from "../context/userContext";
import { FaBookmark, FaPlay, FaRedo, FaEllipsisV } from "react-icons/fa";
import Loading from "../components/Loading";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const PlayList = () => {
  const { songs, setisPlaying, setselectedSong, loading, audioRef, selectedSong, isLooped, setSongAndPlay } = useSongData();
  const { user, addToPlaylist } = useUserData();
  const [myPlayList, setMyPlayList] = useState<Song[]>([]);
  const [durations, setDurations] = useState<number[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [loopingSongs, setLoopingSongs] = useState<Set<string>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize canvas refs when playlist changes
  useEffect(() => {
    if (myPlayList?.length > 0) {
      canvasRefs.current = new Array(myPlayList.length).fill(null);
    }
  }, [myPlayList]);

  // Keep the original logic for filtering songs
  useEffect(() => {
    if (songs && user?.playlist) {
      const filteredSongs = songs.filter((song) =>
        user.playlist.includes(song.id.toString())
      );
      setMyPlayList(filteredSongs);
    }
  }, [songs, user]);

  // Fetch song durations
  useEffect(() => {
    if (myPlayList?.length > 0) {
      const fetchDurations = async () => {
        const promises = myPlayList.map((song) => {
          return new Promise<number>((resolve) => {
            const audio = new Audio(song.audio);
            audio.addEventListener('loadedmetadata', () => {
              resolve(audio.duration || 0);
            });
            audio.addEventListener('error', () => resolve(0));
          });
        });
        const allDurations = await Promise.all(promises);
        setDurations(allDurations);
      };
      fetchDurations();
    }
  }, [myPlayList]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const totalDuration = durations.reduce((sum, dur) => sum + dur, 0);

  const toggleLoop = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoopingSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
        if (audioRef.current && selectedSong === songId) {
          audioRef.current.loop = false;
        }
      } else {
        newSet.add(songId);
        if (audioRef.current && selectedSong === songId) {
          audioRef.current.loop = true;
        }
      }
      return newSet;
    });
  };

  const toggleDropdown = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(prev => prev === songId ? null : songId);
  };
  
  const handlePlay = (song: Song, index: number) => {
    setSongAndPlay(song);
    
    // Visual effects
    const ripple = document.createElement('div');
    ripple.className = 'neon-ripple';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);

    confetti({
      particleCount: 100,
      angle: 90,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#00f6ff', '#ff005c', '#9b5de5', '#00ff87'],
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <Layout>
      <Particles
        id="playlist-particles"
        init={loadSlim}
        options={{
          fullScreen: { enable: true, zIndex: 0 },
          background: { color: { value: '#000000' } },
          particles: {
            number: { value: 80 },
            size: { value: { min: 1, max: 3 } },
            color: { value: ['#9b5de5', '#00f6ff', '#ff005c'] },
            move: { enable: true, speed: 1 },
            opacity: { value: 0.6 },
            links: { enable: true, distance: 100, color: '#ffffff', opacity: 0.05 },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
              onClick: { enable: true, mode: 'repulse' },
            },
            modes: {
              grab: { distance: 120, links: { opacity: 0.5 } },
              repulse: { distance: 150 },
            },
          },
        }}
      />

      {loading ? (
        <Loading />
      ) : (
        <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex gap-4 md:gap-8 flex-col md:flex-row md:items-center mt-4 md:mt-6 mb-6 md:mb-10"
          >
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-lg overflow-hidden cosmic-shadow">
              <div className="absolute inset-0 rounded-lg cosmic-glow" />
              <motion.img
                src={ '/music.png'}
                alt="Playlist Cover"
                className="w-full h-full object-cover rounded-lg border border-purple-700 shadow-xl relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="floating-particles" />
            </div>

            <div className="flex flex-col text-center md:text-left">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-pink-400 font-medium text-sm sm:text-base"
              >
                PlayList
              </motion.p>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent"
              >
                {user?.name}'s PlayList
              </motion.h2>
              <motion.h4 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-sm sm:text-base"
              >
                Your Favorite songs
              </motion.h4>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-xs sm:text-sm text-gray-400"
              >
                <img src="/logo.png" className="inline-block w-4 sm:w-6 mr-2" alt="" />
                {myPlayList.length} songs · {formatDuration(totalDuration)}
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 mb-4 px-3 sm:px-4 py-2 sm:py-3 text-gray-400 font-medium bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 rounded-t-lg backdrop-blur-sm text-xs sm:text-sm"
          >
            <p><span className="mr-2 sm:mr-4">#</span> Title</p>
            <p className="hidden sm:block">Description</p>
            <p className="text-center">Duration</p>
            <p className="text-center hidden md:block">Actions</p>
          </motion.div>

          <div className="space-y-2 relative">
            {/* Dropdown container */}
            {openDropdown && myPlayList && (
              <div className="fixed inset-0 z-[999] pointer-events-none">
                {myPlayList.map((song) => (
                  openDropdown === song.id && (
                    <div 
                      key={`dropdown-${song.id}`} 
                      className="absolute pointer-events-auto"
                      style={{
                        right: "calc(50% - 120px)",
                        top: "50%",
                        transform: "translateY(-50%)"
                      }}
                    >
                      <div className="w-40 sm:w-48 bg-zinc-800 rounded-md shadow-lg animate-glow neon-border">
                        <div className="py-1">
                          <button
                            className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-200 hover:bg-zinc-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToPlaylist(song.id);
                              setOpenDropdown(null);
                            }}
                          >
                            <FaBookmark size={12} className={`mr-2 ${
                              user?.playlist?.includes(song.id.toString()) 
                                ? 'text-pink-400' 
                                : 'text-white'
                            }`} />
                            {user?.playlist?.includes(song.id.toString()) 
                              ? 'Unsave from Playlist' 
                              : 'Save to Playlist'}
                          </button>
                          <button
                            className="flex items-center w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-200 hover:bg-zinc-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLoop(song.id, e);
                              setOpenDropdown(null);
                            }}
                          >
                            <FaRedo size={12} className={`mr-2 ${
                              loopingSongs.has(song.id) 
                                ? 'text-pink-400' 
                                : 'text-white'
                            }`} />
                            {loopingSongs.has(song.id) ? 'Disable Loop' : 'Enable Loop'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {myPlayList && myPlayList.length > 0 ? (
              myPlayList.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{
                    scale: 1.015,
                    boxShadow: "0 10px 20px rgba(255, 0, 140, 0.2)",
                    backgroundColor: "rgba(255, 20, 147, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transform-gpu transition-all duration-300 ${
                    selectedSong === song.id
                      ? 'bg-gradient-to-r from-indigo-800/90 via-purple-700/90 to-indigo-900/90 scale-[1.01] ring-2 ring-pink-400'
                      : `bg-gradient-to-r from-zinc-900/70 to-zinc-800/70 hover:from-zinc-800/90 hover:to-zinc-700/90 ${
                          index % 4 === 0 ? 'ring-1 ring-blue-400/50' :
                          index % 4 === 1 ? 'ring-1 ring-purple-400/50' :
                          index % 4 === 2 ? 'ring-1 ring-green-400/50' :
                          'ring-1 ring-orange-400/50'
                        }`
                  }`}
                  style={{
                    perspective: "1000px"
                  }}
                >
                  <div className="flex items-center">
                    <span className="w-4 sm:w-6 text-gray-400 text-xs sm:text-sm">{index + 1}</span>
                    <div className="flex items-center ml-2">
                      <img
                        src={song.thumbnail ? song.thumbnail : "/music.png"}
                        className="w-8 h-8 sm:w-12 sm:h-12 mr-2 sm:mr-3 rounded object-cover"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-xs sm:text-sm truncate">{song.title}</p>
                        <p className="text-xs text-gray-400 md:hidden truncate">
                          {song.description && song.description.length > 15
                            ? song.description.slice(0, 15) + "..."
                            : song.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-400 hidden sm:flex items-center truncate">
                    {song.description && song.description.length > 50
                      ? song.description.slice(0, 50) + "..."
                      : song.description}
                  </p>
                  
                  <div className="flex justify-center items-center">
                    <span className="text-xs sm:text-sm text-gray-400">
                      {formatDuration(durations[index] || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-center items-center gap-2 sm:gap-4 mt-2 md:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-1.5 sm:p-2 rounded-full ${
                        selectedSong === song.id
                          ? 'bg-pink-500 ring-2 ring-pink-300 animate-pulse'
                          : 'bg-purple-700/80 hover:bg-pink-600/80'
                      }`}
                      onClick={() => handlePlay(song, index)}
                      aria-label={`Play ${song.title}`}
                    >
                      <FaPlay size={12} className="sm:w-4 sm:h-4" />
                    </motion.button>
                    
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 sm:p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 text-white"
                        onClick={(e) => toggleDropdown(song.id, e)}
                        aria-label="More options"
                      >
                        <FaEllipsisV size={12} className="sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 sm:p-10 text-center"
              >
                <div className="bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 p-6 sm:p-8 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Your playlist is empty</h3>
                  <p className="text-gray-400 mb-6 text-sm sm:text-base">
                    Add some tracks to create your personal collection
                  </p>
                  <button onClick={()=>navigate('/')} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg text-sm sm:text-base">
                    Browse Music
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlayList;