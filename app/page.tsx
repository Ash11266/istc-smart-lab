"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="h-full w-full relative">

      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      >
        <source src="/animation.mp4" type="video/mp4" />
      </video>

      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-white/20"></div>

      {/* CENTER TEXT */}
      <div
        onClick={() => setShowLogin(true)}
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
      >
        <p className="mt-6 text-xl md:text-2xl font-semibold text-white animate-pulse tracking-wide drop-shadow-lg">
          Click anywhere to login
        </p>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">

          <div className="bg-[#eaf4fb] border-2 border-orange-400 p-8 rounded-xl w-80 shadow-xl">

            <h2 className="text-[#2c3e50] text-xl mb-4 text-center font-semibold">
              Login
            </h2>

            {/* USERNAME */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-3 p-2 bg-white border border-gray-300 rounded outline-none text-black focus:border-orange-400"
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-2 bg-white border border-gray-300 rounded outline-none text-black focus:border-orange-400"
            />

            {/* LOGIN BUTTON */}
            <button
              onClick={() => {
                if (username === "twst1234" && password === "123456789") {
                  setShowLogin(false);
                  router.push("/experiments");
                } else {
                  alert("Invalid Username or Password");
                }
              }}
              className="w-full bg-orange-400 hover:bg-orange-500 py-2 rounded text-white font-semibold transition"
            >
              Login
            </button>

          </div>

        </div>
      )}

    </div>
  );
}