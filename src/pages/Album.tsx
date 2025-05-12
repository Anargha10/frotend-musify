import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useSongData } from '../context/songContext';
import { useUserData } from '../context/userContext';
import { useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { Play, MoreVertical, Repeat, Bookmark } from 'lucide-react';

import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import Tilt from 'react-parallax-tilt';
import confetti from 'canvas-confetti';

const Album = () => {
  const {
    fetchAlbumsongs,
    albumSong,
    albumData,
    setisPlaying,
    setselectedSong,
    selectedSong,
    isLooped,
    toggleLoop,
    loading,
    audioRef, // Use the shared audioRef from context
    setSongAndPlay
  } = useSongData();

  const { addToPlaylist, playlist } = useUserData();

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [durations, setDurations] = useState<number[]>([]);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const params = useParams<{ id: string }>();
  
  const audioContextRef = useRef<AudioContext | null>(null);
const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);


  useEffect(() => {
    if (params?.id) fetchAlbumsongs(params.id);
  }, [params?.id]);

  const playSong = (id: string, index: number) => {
    setSongAndPlay(albumSong[index]);
    
    // Visual effects
    const ripple = document.createElement('div');
    ripple.className = 'neon-ripple';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);

    confetti({
      particleCount: 120,
      angle: 90,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#00f6ff', '#ff005c', '#9b5de5', '#00ff87'],
    });

    // Setup visualizer if canvas exists
    const canvas = canvasRefs.current[index];
    if (canvas && audioRef.current) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audioRef.current);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!ctx) return;
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / bufferLength;
        dataArray.forEach((value, i) => {
          const barHeight = (value / 255) * canvas.height;
          const x = i * barWidth;
          const y = canvas.height - barHeight;

          ctx.fillStyle = `hsl(${i * 360 / bufferLength}, 100%, 50%)`;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        });

        requestAnimationFrame(draw);
      };

      draw();
    }
  };
  
  

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  useEffect(() => {
    if (albumSong?.length > 0) {
      const fetchDurations = async () => {
        const promises = albumSong.map((song) => {
          return new Promise<number>((resolve) => {
            const audio = new Audio(song.audio);
            audio.addEventListener('loadedmetadata', () => {
              resolve(audio.duration || 0);
            });
          });
        });
        const allDurations = await Promise.all(promises);
        setDurations(allDurations);
      };
      fetchDurations();
    }
  }, [albumSong]);

  const totalDuration = durations.reduce((sum, dur) => sum + dur, 0);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!e.target.closest('.dropdown-menu') && !e.target.closest('.dropdown-trigger')) {
        setDropdownOpenIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle dropdown positioning
  const handleOpenDropdown = (index: any, e: any) => {
    e.stopPropagation();

    if (dropdownOpenIndex === index) {
      setDropdownOpenIndex(null);
      return;
    }

    // Calculate position
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const position = {
      top: rect.top + window.scrollY - 80, // Add 10px margin
      left: rect.left + window.scrollX-65,
    };

    setDropdownPosition(position);
    setDropdownOpenIndex(index);
  };

  return (
    <Layout>
      <Particles
        id="nebula-particles"
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
      ) : albumData ? (
        <div className="p-4 md:p-10 text-white relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-10"
          >
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-60 md:h-60 rounded-full overflow-hidden cosmic-shadow">
              <div className="absolute inset-0 rounded-full cosmic-glow" />
              <motion.img
                src={albumData.thumbnail || ''}
                alt={albumData.title}
                className="w-full h-full object-cover rounded-full border border-purple-700 shadow-xl relative z-10"
              />
              <div className="floating-particles" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2">{albumData.title}</h1>
              <p className="text-gray-300 mb-4 text-sm sm:text-base max-w-lg mx-auto md:mx-0">{albumData.description}</p>
              <p className="text-xs sm:text-sm text-pink-400">Total duration: {formatDuration(totalDuration)}</p>
            </div>
          </motion.div>

          {/* Songs List */}
          <div className="space-y-4 md:space-y-6">
            {albumSong?.map((songItem, index) => {
              return (
                <Tilt
                  glareEnable
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  scale={1.02}
                  className="rounded-xl neon-glow"
                  key={songItem.id}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 rounded-xl transition-transform duration-300 ${
                      selectedSong === songItem.id
                        ? 'bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-900 scale-[1.02] ring-2 ring-pink-400'
                        : 'bg-gradient-to-r from-zinc-800 to-zinc-900 hover:scale-[1.01]'
                    } ${isLooped(songItem.id) ? 'ring-2 ring-pink-500 animate-glow' : ''}`}
                  >
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                      <img
                        src={songItem.thumbnail || '/music.png'}
                        alt={songItem.title}
                        className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold truncate">{songItem.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">{songItem.description || 'No description'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                      <p className="text-xs sm:text-sm text-gray-400 w-16 text-right">
                        {formatDuration(durations[index] || 0)}
                      </p>
                      <button
                        onClick={() => playSong(songItem.id, index)}
                        className={`p-1.5 sm:p-2 rounded-full shadow-md ${
                          selectedSong === songItem.id
                            ? 'bg-pink-500 ring-2 ring-white animate-pulse'
                            : 'bg-purple-700 hover:bg-pink-600 text-white'
                        }`}
                        aria-label={`Play ${songItem.title}`}
                      >
                        <Play size={16} className="sm:w-5 sm:h-5" />
                      </button>

                      <button
                        onClick={(e) => handleOpenDropdown(index, e)}
                        className="p-1.5 sm:p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 hover:ring-2 hover:ring-purple-400 transition-all dropdown-trigger"
                        aria-label="More options"
                      >
                        <MoreVertical size={16} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </motion.div>
                </Tilt>
              );
            })}
          </div>

          {/* Portalled dropdown menu that appears on top of everything */}
          {dropdownOpenIndex !== null && createPortal(
            <div
              className="fixed dropdown-menu z-[9999]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
            >
              <div className="w-56 bg-zinc-900/95 border-2 border-purple-500 rounded-lg shadow-xl shadow-purple-500/50 backdrop-blur-md">
                <div className="py-1 relative">
                  <button
                    onClick={() => {
                      toggleLoop(albumSong[dropdownOpenIndex].id);
                      setDropdownOpenIndex(null);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-purple-900/60 w-full text-left transition-colors duration-200 group"
                  >
                    <Repeat
                      size={18}
                      className="text-purple-400 group-hover:text-white"
                    />
                    <span className="text-base">
                      {isLooped(albumSong[dropdownOpenIndex].id) ? 'Unloop' : 'Loop Track'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      addToPlaylist(albumSong[dropdownOpenIndex].id);
                      setDropdownOpenIndex(null);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-pink-900/60 w-full text-left transition-colors duration-200 group"
                  >
                    <Bookmark
                      size={18}
                      className="text-pink-400 group-hover:text-white"
                    />
                    <span className="text-base">Save to Playlist</span>
                  </button>

                  {/* Visual separator with pulsing effect */}
                  <div className="border-t border-purple-500/50 my-1 animate-pulse" />
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      ) : (
        <div className="p-6 text-gray-400 text-center">Album not found.</div>
      )}
    </Layout>
  );
};

export default Album;