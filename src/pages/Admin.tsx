import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/userContext";
import { useSongData } from "../context/songContext";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete, MdAdd, MdHome, MdAudiotrack, MdAlbum } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const server = "http://16.170.214.70:7000";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [activeForm, setActiveForm] = useState<"album" | "song">("album");

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setPreviewUrl(null);
    setAlbum("");
    
    // Reset file input
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input: any) => {
      input.value = "";
    });
  };

  const addAlbumHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a thumbnail image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      await fetchAlbums();
      resetForm();
    } catch (error: any) {
      console.error("Upload error:", error);

      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setBtnLoading(false);
    }
  };

  const addSongHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an audio file");
      return;
    }

    if (!album) {
      toast.error("Please select an album");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("album", album);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/new`, 
        formData, 
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      await fetchSongs();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setBtnLoading(false);
    }
  };

  const addThumbnailHandler = async (id: string) => {
    if (!file) {
      toast.error("Please select a thumbnail image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      await fetchSongs();
      setFile(null);
      setPreviewUrl(null);
      
      // Reset file input
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input: any) => {
        input.value = "";
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setBtnLoading(true);
      try {
        const { data } = await axios.delete(`${server}/api/v1/album/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        await Promise.all([fetchSongs(), fetchAlbums()]);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setBtnLoading(true);
      try {
        const { data } = await axios.delete(`${server}/api/v1/song/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        await fetchSongs();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setBtnLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500 opacity-20 blur-[180px] rounded-full top-[-100px] left-[-100px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-green-500 opacity-20 blur-[150px] rounded-full bottom-[-50px] right-[-50px] animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={"/"}
              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-green-500/30 transition-all duration-300"
            >
              <MdHome size={20} /> Go to Home
            </Link>
          </motion.div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
            Admin Dashboard
          </h1>
        </div>

        {/* Form Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-full p-1 flex">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 py-2 px-6 rounded-full transition-all duration-300 ${
                activeForm === "album" 
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveForm("album")}
            >
              <MdAlbum /> Album
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 py-2 px-6 rounded-full transition-all duration-300 ${
                activeForm === "song" 
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setActiveForm("song")}
            >
              <MdAudiotrack /> Song
            </motion.button>
          </div>
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          {activeForm === "album" ? (
            <motion.div
              key="albumForm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Add New Album</h2>
              <form
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto"
                onSubmit={addAlbumHandler}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-1">
                    <div>
                      <label className="text-sm block mb-1 text-gray-300">Album Title</label>
                      <input
                        type="text"
                        placeholder="Enter album title"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm block mb-1 text-gray-300">Description</label>
                      <textarea
                        placeholder="Enter album description"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm block mb-1 text-gray-300">Album Cover</label>
                      <input
                        type="file"
                        onChange={fileChangeHandler}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600 transition-all duration-300"
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center md:col-span-1">
                    {previewUrl ? (
                      <div className="relative group">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-48 h-48 object-cover rounded-lg border border-white/20 shadow-lg" 
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-lg">
                          <p className="text-white text-sm">Album Preview</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400 text-sm text-center px-4">Upload an image to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                    disabled={btnLoading}
                    type="submit"
                  >
                    {btnLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MdAdd size={20} /> Add Album
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="songForm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Add New Song</h2>
              <form
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto"
                onSubmit={addSongHandler}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-1">
                    <div>
                      <label className="text-sm block mb-1 text-gray-300">Song Title</label>
                      <input
                        type="text"
                        placeholder="Enter song title"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm block mb-1 text-gray-300">Description</label>
                      <textarea
                        placeholder="Enter song description"
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:col-span-1">
                    <div>
                      <label className="text-sm block mb-1 text-gray-300">Select Album</label>
                      {albums && albums.length > 0 ? (
                        <select
                          className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                          value={album}
                          onChange={(e) => setAlbum(e.target.value)}
                          required
                        >
                          <option className="text-black" value="">Choose Album</option>
                          {albums.map((e: any, i: number) => (
                            <option className="text-black" value={e.id} key={i}>
                              {e.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-amber-400">
                          No albums available. Please create an album first.
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm block mb-1 text-gray-300">Audio File</label>
                      <input
                        type="file"
                        onChange={fileChangeHandler}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600 transition-all duration-300"
                        accept="audio/*"
                        required
                      />
                    </div>
                    {file && file.type.startsWith('audio/') && (
                      <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
                        <MdAudiotrack className="text-green-400" size={24} />
                        <div className="truncate">
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                    disabled={btnLoading || albums?.length === 0}
                    type="submit"
                  >
                    {btnLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MdAdd size={20} /> Add Song
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Albums List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
            Albums
          </h3>
          {albums && albums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {albums.map((album: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={album.thumbnail} 
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={album.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        disabled={btnLoading}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                        onClick={() => deleteAlbum(album.id)}
                      >
                        <MdDelete size={20} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white truncate">{album.title}</h4>
                    <p className="text-gray-400 text-sm line-clamp-2">{album.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-400">No albums added yet. Create your first album above!</p>
            </div>
          )}
        </motion.div>

        {/* Songs List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
            Songs
          </h3>
          {songs && songs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {songs.map((song: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl group"
                >
                  {song.thumbnail ? (
                    <div className="relative overflow-hidden">
                      <img 
                        src={song.thumbnail} 
                        className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={song.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          disabled={btnLoading}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                          onClick={() => deleteSong(song.id)}
                        >
                          <MdDelete size={20} />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-center h-40 bg-white/5 rounded-lg">
                        <MdAudiotrack size={48} className="text-gray-400" />
                      </div>
                      <input
                        type="file"
                        onChange={fileChangeHandler}
                        className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-green-500 file:text-white file:text-xs hover:file:bg-green-600 transition-all duration-300"
                        accept="image/*"
                      />
                      {previewUrl && (
                        <div className="relative">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-20 object-cover rounded-lg" 
                          />
                        </div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center justify-center gap-1 bg-gradient-to-r from-green-400 to-green-600 text-white text-sm py-2 px-4 rounded-lg shadow-lg hover:shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                        disabled={btnLoading || !file}
                        onClick={() => addThumbnailHandler(song.id)}
                      >
                        {btnLoading ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <MdAdd size={16} /> Add Thumbnail
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white truncate">{song.title}</h4>
                    <p className="text-gray-400 text-sm line-clamp-2">{song.description}</p>
                    {!song.thumbnail && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        disabled={btnLoading}
                        className="mt-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                        onClick={() => deleteSong(song.id)}
                      >
                        <MdDelete size={16} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-400">No songs added yet. Add your first song above!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Admin;