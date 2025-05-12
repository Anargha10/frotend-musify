import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/userContext";
import { motion } from "framer-motion";


const navBtnStyle =
  "relative bg-white text-black px-4 py-1 rounded-full cursor-pointer text-[15px] font-medium transition overflow-hidden";

const btnVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1 + 0.3,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const hoverEffect = {
  scale: 1.05,
  boxShadow: "0 0 15px rgba(0, 255, 255, 0.35)",
  transition: {
    type: "spring",
    stiffness: 250,
    damping: 15,
  },
};

const pulseTrail = (
  <motion.div
    className="absolute inset-0 rounded-full z-[-1] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-md"
    initial={{ opacity: 0.15, scale: 0.95 }}
    animate={{ opacity: [0.2, 0.35, 0.2], scale: [0.95, 1.05, 0.95] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth,logoutUser } = useUserData();
   const logoutUserHandler=()=>{
    logoutUser(); 
  navigate("/login"); 
   }

  const openInstagram = () => {
    window.open("https://www.instagram.com/anargha_sings?igsh=czhzYWp1M2FiNGFp", "_blank");
  };
 
  const openYoutube = () => {
    window.open("https://www.youtube.com/results?search_query=podcast+on+singing", "_blank");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full z-30 px-4 py-4 rounded-2xl shadow-lg border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden relative"
    >
      
      <motion.div
        className="absolute inset-0 z-[-2] bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-40 blur-2xl"
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Top Row */}
      <div className="w-full flex justify-between items-center font-semibold flex-wrap gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <motion.img
            src="/left_arrow.png"
            alt="back"
            className="w-9 h-9 bg-black p-2 rounded-2xl cursor-pointer transition"
            onClick={()=>navigate(-1)}
            whileHover={{
              scale: 1.15,
              boxShadow: "0px 0px 10px rgba(255,255,255,0.4)",
            }}
          />

          <motion.img
            src="/right_arrow.png"
            alt="forward"
            className="w-9 h-9 bg-black p-2 rounded-2xl cursor-pointer transition"
            onClick={()=>navigate(+1)}
            whileHover={{
              scale: 1.15,
              boxShadow: "0px 0px 10px rgba(255,255,255,0.4)",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {["Explore Premium", "Install App"].map((label, i) => (
            <motion.div
              key={label}
              className={`${navBtnStyle} hidden md:block`}
              custom={i}
              variants={btnVariants}
              initial="hidden"
              animate="visible"
              whileHover={hoverEffect}
              onClick={openInstagram}
            >
              {pulseTrail}
              {label}
            </motion.div>
          ))}

          <motion.div
            className={navBtnStyle}
            custom={2}
            variants={btnVariants}
            initial="hidden"
            animate="visible"
            whileHover={hoverEffect}
          >
            {pulseTrail}
            {isAuth ?
             <button onClick={logoutUserHandler}>Logout</button> 
             : 
             <button onClick={() => navigate("/login")}>Login</button>}
          </motion.div>
        </div>
      </div>

      {/* Category Tags */}
      <div className="flex items-center gap-3 mt-4 flex-wrap relative z-10">
        {["All", "Music", "Podcast"].map((label, i) => (
          <motion.div
            key={label}
            className={`${navBtnStyle} ${label !== "All" ? "hidden md:block" : ""}`}
            custom={i}
            variants={btnVariants}
            initial="hidden"
            animate="visible"
            whileHover={hoverEffect}
            onClick={openYoutube}
          >
            {pulseTrail}
            {label}
          </motion.div>
        ))}

        <motion.div
          className={`${navBtnStyle} md:hidden`}
          onClick={openInstagram}
          custom={4}
          variants={btnVariants}
          initial="hidden"
          animate="visible"
          whileHover={hoverEffect}
        >
          {pulseTrail}
          Playlist
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;
