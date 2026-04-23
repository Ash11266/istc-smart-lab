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
      className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer select-none"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-tight">
          {loading ? (
            <span className="opacity-50">Checking status...</span>
          ) : isLoggedIn ? (
            "Click Anywhere to Continue"
          ) : (
            "Click Anywhere to Login"
          )}
        </h1>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-2xl font-black rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all"
        >
          {isLoggedIn ? "Enter Experiments" : "Enter System"}
        </motion.div>

        <p className="mt-6 text-white/60 text-sm font-medium tracking-[0.2em] uppercase">
          {isLoggedIn ? "Welcome back to Smart Lab" : "Access the Research Interface"}
        </p>
      </motion.div>
    </div>
  );
}