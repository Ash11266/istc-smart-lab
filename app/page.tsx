"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to check auth session:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      router.push("/experiments");
    } else {
      router.push("/login");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-full flex-1 flex flex-col items-center justify-center text-center cursor-pointer select-none px-4 relative overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center relative z-10"
      >
        {/* Subtle System Label */}
        <motion.p 
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 0.7, letterSpacing: "0.4em" }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-orange-400 text-xs md:text-sm font-bold uppercase mb-6 drop-shadow-sm"
        >
          {loading ? "System Initializing..." : "Data Acquisition & Monitoring System"}
        </motion.p>

        {/* Main Brand Title */}
        <h1 className="text-white text-7xl md:text-9xl font-black mb-12 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] tracking-tighter leading-none">
          D.A.M.S.
        </h1>

        {/* High-Tech Action Button */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative group mb-16"
        >
          {/* Glowing Aura Background */}
          <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
          
          <div className="relative px-12 py-5 bg-white text-[#0B5D57] text-xl md:text-2xl font-black rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all border-b-4 border-orange-500 hover:border-orange-400 flex items-center gap-4">
            {isLoggedIn ? "ENTER EXPERIMENTS" : "ACCESS SYSTEM"}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Click Anywhere Instruction (The "thing") */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-white/80 text-sm md:text-base font-medium tracking-[0.2em] uppercase">
            {isLoggedIn ? "Click anywhere to continue" : "Click anywhere to enter"}
          </span>
          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        </motion.div>
      </motion.div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-white/10 rounded-tl-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-white/10 rounded-br-3xl pointer-events-none"></div>
    </div>
  );
}