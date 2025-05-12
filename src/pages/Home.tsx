import AlbumCard from "../components/AlbumCard"
import Layout from "../components/Layout"
import SongCard from "../components/SongCard"
import { useSongData } from "../context/songContext"
import Loading from "../components/Loading"

const Home = () => {
  const {albums,songs, loading}= useSongData()
  return (
    <div className="w-full">
    { loading? <Loading/>: <Layout>
      <div className="mb-6 md:mb-8 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="my-4 md:my-5 font-bold text-xl md:text-2xl lg:text-3xl">
            Featured Albums
        </h1>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-6 scrollbar-hide" >
            {
              albums.map((e,i)=>{
                return <AlbumCard key={i} image={e.thumbnail} name={e.title} desc={e.description} id={e.id} />
              })
            }
          </div>
      </div>

      <div className="mb-6 md:mb-8 px-4 md:px-6 max-w-7xl mx-auto">
        <h1 className="my-4 md:my-5 font-bold text-xl md:text-2xl lg:text-3xl">
            Today's hit songs
        </h1>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-6 scrollbar-hide" >
            {
              songs.map((e,i)=>{
                return <SongCard key={i} image={e.thumbnail} name={e.title} desc={e.description} id={e.id} />
              })
            }
          </div>
      </div>

      </Layout>}
    </div>
  )
}

export default Home