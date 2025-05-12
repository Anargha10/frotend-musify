import React, { useState } from 'react';
import { FaBookmark, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useUserData } from '../context/userContext';
import { useSongData } from '../context/songContext';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const shimmerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0.2, 0.4, 0.6, 1],
    transition: { repeat: Infinity, duration: 0.8 },
  },
};

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { addToPlaylist, isAuth } = useUserData();
  const { setselectedSong, setisPlaying } = useSongData();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  const saveToPlayListhandler = () => {
    addToPlaylist(id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateZ: 1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group min-w-[140px] sm:min-w-[160px] md:min-w-[180px] p-2 px-3 rounded cursor-pointer bg-gradient-to-br from-black to-gray-800 hover:bg-[#ffffff26] shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative"
    >
      <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] rounded overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#222] via-[#333] to-[#222] animate-pulse" />
        )}
        <motion.img
          src={image || '/music.png'}
          alt={name}
          onLoad={() => setLoaded(true)}
          className={clsx(
            'w-full h-full object-cover rounded transition-transform duration-100',
            { hidden: !loaded }
          )}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <p className="font-bold mt-2 mb-1 truncate max-w-[120px] sm:max-w-[140px] md:max-w-[160px] text-white text-sm sm:text-base">
        {name.slice(0, 16)}...
      </p>
      <p className="text-slate-300 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[140px] md:max-w-[160px]">
        {desc.slice(0, 25)}...
      </p>

      {/* Play and Bookmark Buttons - Visible on small screens and tablets, hover on larger screens */}
      <div className="flex gap-2 absolute bottom-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
        <RippleButton
          icon={<FaPlay />}
          onClick={(e) => {
            e.stopPropagation();
            setselectedSong(id);
            setisPlaying(true);
          }}
          className="text-xs sm:text-sm"
        />
        {isAuth && (
          <RippleButton
            icon={<FaBookmark />}
            onClick={(e) => {
              e.stopPropagation();
              saveToPlayListhandler();
            }}
            className="text-xs sm:text-sm"
          />
        )}
      </div>
    </motion.div>
  );
};

const RippleButton = ({
  icon,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-green-500 text-black rounded-full overflow-hidden group shadow hover:scale-105 active:scale-95 transition ${className || ''}`}
    >
      {icon}
      <span className="absolute inset-0 bg-white opacity-20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
    </button>
  );
};

export default SongCard;