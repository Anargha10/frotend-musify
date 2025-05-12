import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  MutableRefObject,
} from "react";

const server = "http://16.170.214.70:8000";

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album: string;
  duration?: number;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface SongContextType {
  song: Song | null;
  songs: Song[];
  isPlaying: boolean;
  setisPlaying: (value: boolean) => void;
  loading: boolean;
  selectedSong: string | null;
  setselectedSong: (id: string) => void;
  albums: Album[];
  fetchSingleSong: () => Promise<void>;
  nextSong: () => void;
  prevSong: () => void;
  albumSong: Song[];
  albumData: Album | null;
  fetchAlbumsongs: (id: string) => Promise<void>;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  loopedSongs: Set<string>;
  toggleLoop: (id: string) => void;
  isLooped: (id: string) => boolean;
  setSongAndPlay: (song: Song) => void;
  fetchAlbums: () => Promise<void>;
  fetchSongs: () => Promise<void>;
}

const SongContext = createContext<SongContextType>({
  song: null,
  songs: [],
  isPlaying: false,
  setisPlaying: () => {},
  loading: true,
  selectedSong: null,
  setselectedSong: () => {},
  albums: [],
  fetchSingleSong: async () => {},
  nextSong: () => {},
  prevSong: () => {},
  albumSong: [],
  albumData: null,
  fetchAlbumsongs: async () => {},
  audioRef: { current: null },
  loopedSongs: new Set<string>(),
  toggleLoop: () => {},
  isLooped: () => false,
  setSongAndPlay: () => {},
  fetchAlbums: async () => {},
  fetchSongs: async () => {},
});

interface SongProviderProps {
  children: React.ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [selectedSong, setselectedSong] = useState<string | null>(null);
  const [isPlaying, setisPlaying] = useState<boolean>(false);
  const [albums, setalbums] = useState<Album[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [albumSong, setalbumSong] = useState<Song[]>([]);
  const [albumData, setalbumData] = useState<Album | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load looped songs from localStorage on mount
  const [loopedSongs, setLoopedSongs] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("loopedSongs");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleLoop = useCallback((id: string) => {
    setLoopedSongs((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  }, []);

  const isLooped = useCallback(
    (id: string) => {
      return loopedSongs.has(id);
    },
    [loopedSongs]
  );

  // Persist loopedSongs to localStorage
  useEffect(() => {
    localStorage.setItem("loopedSongs", JSON.stringify([...loopedSongs]));
  }, [loopedSongs]);

  const fetchSongs = useCallback(async () => {
    setloading(true);
    try {
      const { data } = await axios.get<Song[]>(`${server}/api/v1/song/all`);
      setSongs(data);
      if (data.length > 0) {
        setselectedSong(data[0].id);
        setIndex(0);
        setisPlaying(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }, []);

  const fetchalbums = useCallback(async () => {
    setloading(true);
    try {
      const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`);
      setalbums(data);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }, []);

  const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;
    try {
      const { data } = await axios.get<Song>(`${server}/api/v1/song/${selectedSong}`);
      setSong(data);
  
      if (audioRef.current) {
        audioRef.current.crossOrigin = "anonymous";
        audioRef.current.src = data.audio;
        audioRef.current.load(); // load the new source
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);
  
  

  const fetchAlbumsongs = useCallback(async (id: string) => {
    setloading(true);
    try {
      const { data } = await axios.get<{ songs: Song[]; album: Album }>(
        `${server}/api/v1/album/${id}`
      );
      setalbumData(data.album);
      setalbumSong(data.songs);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }, []);

  const nextSong = useCallback(() => {
    const source = albumSong.length > 0 ? albumSong : songs;
    if (source.length === 0) return;

    const currentIdx = source.findIndex((s) => s.id === selectedSong);
    const nextIdx = (currentIdx + 1) % source.length;

    const next = source[nextIdx];
    setselectedSong(next.id);
    setIndex(nextIdx);

    if (audioRef.current) {
      audioRef.current.src = next.audio;
      audioRef.current.play().catch(console.error);
      setisPlaying(true);
    }
  }, [songs, albumSong, selectedSong]);

  const prevSong = useCallback(() => {
    const source = albumSong.length > 0 ? albumSong : songs;
    if (source.length === 0) return;

    const currentIdx = source.findIndex((s) => s.id === selectedSong);
    const prevIdx = currentIdx > 0 ? currentIdx - 1 : source.length - 1;

    const prev = source[prevIdx];
    setselectedSong(prev.id);
    setIndex(prevIdx);

    if (audioRef.current) {
      audioRef.current.src = prev.audio;
      audioRef.current.play().catch(console.error);
      setisPlaying(true);
    }
  }, [songs, albumSong, selectedSong]);


  const setSongAndPlay = (song: Song) => {
    if (!song.audio) return;
  
    setselectedSong(song.id);
    setSong(song);
  
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = song.audio;
      audioRef.current.load();
      audioRef.current.currentTime = 0;
  
      // Play the audio and handle the promise
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setisPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          setisPlaying(false);
        }
      };
  
      // Try to play immediately if ready
      if (audioRef.current.readyState >= 2) {
        playAudio();
      } else {
        // Wait for the audio to be ready
        audioRef.current.oncanplay = () => {
          playAudio();
          audioRef.current!.oncanplay = null; // Clean up the event listener
        };
      }
    }
  };
  

  // Update isPlaying state based on audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setisPlaying(true);
    const handlePause = () => setisPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    fetchSongs();
    fetchalbums();
  }, []);

  return (
    <SongContext.Provider
      value={{
        song,
        songs,
        isPlaying,
        setisPlaying,
        loading,
        selectedSong,
        setselectedSong,
        albums,
        fetchSingleSong,
        nextSong,
        prevSong,
        albumSong,
        albumData,
        fetchAlbumsongs,
        audioRef,
        loopedSongs,
        toggleLoop,
        isLooped,
        setSongAndPlay,
        fetchAlbums: fetchalbums,
        fetchSongs: fetchSongs,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongData must be used within a SongProvider");
  }
  return context;
};