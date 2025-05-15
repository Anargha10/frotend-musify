import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce"; 
import { useUserData } from "./userContext";

const SONG_URL = "https://api.imanargha.shop/song/api/v1/songs/search";
const ALBUM_URL = "https://api.imanargha.shop/song/api/v1/albums/search";
const HISTORY_URL = "https://api.imanargha.shop/user/api/v1/user";

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
}

interface SearchContextType {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  songs: SearchResult[];
  albums: SearchResult[];
  searchHistory: string[];
  loading: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<SearchResult[]>([]);
  const [albums, setAlbums] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300); // optional debounce
  const { user, isAuth } = useUserData();
  const token = localStorage.getItem("token");

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSongs([]);
    setAlbums([]);
  };

  // 🔍 Real-time search fetcher
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery || !token) return;

      setLoading(true);
      try {
        console.log(typeof debouncedQuery);
        const headers = { token };


        const [songRes, albumRes] = await Promise.all([
          axios.get(`${SONG_URL}?q=${debouncedQuery}`, { headers }),
          axios.get(`${ALBUM_URL}?q=${debouncedQuery}`, { headers }),
        ]);

        


        
        
        setSongs(songRes.data.songs || []);
        setAlbums(albumRes.data.albums || []);
      } catch (error) {
        console.error("Error fetching search results", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, token]);

  // 📜 Fetch search history (once on mount if user is authenticated)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuth || !user?._id || !token) return;

      try {
        const res = await axios.get(
          `${HISTORY_URL}/${user._id}/search-history1`,
          {
            headers: { token },
          }
        );

        console.log("I think it works here")

        setSearchHistory(res.data.searchHistory || []);
      } catch (err) {
        console.error("Error fetching search history", err);
      }
    };

    fetchHistory();
  }, [user, isAuth, token]);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        openSearch,
        closeSearch,
        searchQuery,
        setSearchQuery,
        songs,
        albums,
        searchHistory,
        loading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
