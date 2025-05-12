import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import Player from "./Player";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "./searchOverlay";
import { useSearch } from "../context/searchbarContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const {isSearchOpen}= useSearch();
  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Track mouse position for interactive elements
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-[#050510] text-white flex flex-col overflow-hidden relative">
      {/* Dynamic background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute -top-24 -left-24 w-[40vw] h-[40vw] bg-[#00ff9d]/20 blur-[100px] rounded-full"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[35vw] h-[35vw] bg-[#ff00c8]/15 blur-[80px] rounded-full"
          animate={{
            x: [0, -20, 0],
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-[40%] right-[20%] w-[25vw] h-[25vw] bg-[#0047ff]/10 blur-[120px] rounded-full"
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-[0.03] mix-blend-overlay" />
        
        {/* Scanlines effect */}
        <div className="absolute inset-0 bg-[url('/scanlines.png')] bg-repeat opacity-[0.04] pointer-events-none" />
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden z-10 relative">
        {/* Sidebar */}
        <AnimatePresence>
          <SideBar />
        </AnimatePresence>

              {/* 🔍 Global SearchOverlay */}
              <AnimatePresence>
  {isSearchOpen && <SearchOverlay />}
  </AnimatePresence>

        {/* Main content */}
        <motion.main 
          className="flex-1 overflow-y-auto px-4 pt-6 pb-32 lg:px-10 lg:pt-8 lg:pb-20 transition-all duration-300 ease-in-out relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          
          {/* Glass content card with enhanced effects */}
          <motion.section 
            className={`mt-6 w-full rounded-2xl bg-[#0c1118]/80 border border-[#ffffff15] shadow-[inset_0_0_1px_rgba(255,255,255,0.2),0_8px_40px_rgba(0,0,0,0.5)] p-5 lg:p-8 backdrop-blur-md relative overflow-hidden ${scrolled ? 'border-[#00ffa330]' : ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 
                          inset 0 0 0 1px rgba(255, 255, 255, 0.07),
                          0 0 ${mousePosition.x / 100}px rgba(0, 255, 170, 0.1),
                          0 0 ${mousePosition.y / 100}px rgba(255, 0, 200, 0.1)`
            }}
          >
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ffa330] via-[#ff00c830] to-[#00ffa330] opacity-0 hover:opacity-20 transition-opacity duration-700" />
            </div>
            
            {/* Texture overlay for realism */}
            <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-[0.04] pointer-events-none z-0" />
            
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[url('/cyber-grid.png')] bg-repeat opacity-[0.03] mix-blend-overlay pointer-events-none" />
            
            {/* Content container */}
            <motion.div 
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {children}
            </motion.div>
          </motion.section>
        </motion.main>
      </div>

      {/* Player footer with enhanced styling */}
      <motion.footer 
        className="h-[10%] w-full bg-[#080812]/90 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] border-t border-[#ffffff10] backdrop-blur-lg z-20 relative overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Horizontal light streak animation */}
        <motion.div 
          className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#00ffa380] to-transparent w-full top-0"
          animate={{
            left: ["-100%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 5
          }}
        />
        
        <Player />
      </motion.footer>
    </div>
  );
};

export default Layout;
