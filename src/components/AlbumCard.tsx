import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      onClick={() => navigate('/album/' + id)}
      whileHover={{ scale: 1.05, rotateZ: 1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] p-2 px-3 rounded cursor-pointer bg-gradient-to-br from-black to-gray-800 hover:bg-[#ffffff26] shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
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
    </motion.div>
  );
};

export default AlbumCard;
