import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { useSongData } from "../context/songContext";
import React, { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdVolumeUp, MdVolumeOff, MdVolumeDown, MdVolumeMute } from "react-icons/md";

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setisPlaying,
    prevSong,
    nextSong,
    audioRef,
  } = useSongData();

  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const currentAudio = audioRef.current;
    if (!currentAudio) return;

    const handleLoadedMetadata = () => {
      setDuration(currentAudio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setProgress(currentAudio.currentTime || 0);
    };

    currentAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
    currentAudio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      currentAudio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      currentAudio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef.current, song]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setisPlaying(!isPlaying);
  };

  const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newDuration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <MdVolumeOff />;
    if (volume < 0.3) return <MdVolumeMute />;
    if (volume < 0.7) return <MdVolumeDown />;
    return <MdVolumeUp />;
  };

  useEffect(() => {
    fetchSingleSong();
  }, [selectedSong, fetchSingleSong]);

  return (
    <div className="w-full">
      {song && (
        <div className="h-[90px] bg-gradient-to-r from-black via-gray-900 to-black text-white px-2 sm:px-4 md:px-6 py-3 shadow-2xl flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4 min-w-[80px] sm:min-w-[120px] md:min-w-[200px]">
            <img
              src={song.thumbnail || "/music.png"}
              alt={song.title}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-cover rounded-md"
            />
            <div className="hidden md:block">
              <p className="font-semibold text-lg truncate max-w-[150px]">{song.title}</p>
              <p className="text-sm text-gray-400 truncate max-w-[150px]">{song.description?.slice(0, 30)}...</p>
            </div>
          </div>

          <div className="flex flex-col items-center w-full max-w-[600px] px-1 sm:px-2">
            {song.audio && (
              <audio
                ref={audioRef}
                src={song.audio}
                autoPlay={isPlaying}
                preload="auto"
                onLoadedMetadata={() => {
                  if (audioRef.current) {
                    setDuration(audioRef.current.duration || 0);
                  }
                }}
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    setProgress(audioRef.current.currentTime || 0);
                  }
                }}
              />
            )}

            <div className="flex items-center gap-2 sm:gap-4">
              <span
                className="cursor-pointer hover:text-green-400 transition-all"
                title="Previous"
                onClick={prevSong}
              >
                <GrChapterPrevious size={18} className="sm:text-[22px]" />
              </span>

              <button
                className="bg-white text-black rounded-full p-2 sm:p-3 hover:scale-110 transition-all"
                onClick={handlePlayPause}
                disabled={!audioRef.current}
              >
                {isPlaying ? <FaPause size={12} className="sm:text-base" /> : <FaPlay size={12} className="sm:text-base" />}
              </button>

              <span
                className="cursor-pointer hover:text-green-400 transition-all"
                title="Next"
                onClick={nextSong}
              >
                <GrChapterNext size={18} className="sm:text-[22px]" />
              </span>

              {isPlaying && (
                <div className="hidden sm:flex items-end gap-[2px] h-6 w-10 ml-2 sm:ml-4">
                  <span className="w-[3px] h-full bg-green-400 animate-wave delay-0"></span>
                  <span className="w-[3px] h-4 bg-green-400 animate-wave delay-150"></span>
                  <span className="w-[3px] h-3 bg-green-400 animate-wave delay-300"></span>
                  <span className="w-[3px] h-5 bg-green-400 animate-wave delay-450"></span>
                  <span className="w-[3px] h-2 bg-green-400 animate-wave delay-600"></span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 w-full mt-1 text-xs sm:text-sm">
              <span className="text-gray-300 w-8 sm:w-10 text-right">
                {formatTime(progress)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                className="progress-bar flex-1 accent-green-400 h-1 sm:h-2"
                value={(progress / duration) * 100 || 0}
                onChange={durationChange}
              />
              <span className="text-gray-300 w-8 sm:w-10 text-left">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 min-w-[60px] sm:min-w-[90px] md:min-w-[120px]">
            <span className="text-lg sm:text-xl">{getVolumeIcon()}</span>
            <input
              type="range"
              className="accent-green-400 w-10 sm:w-16 md:w-full h-1 sm:h-2"
              min="0"
              max="100"
              step="0.1"
              value={volume * 100}
              onChange={volumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;