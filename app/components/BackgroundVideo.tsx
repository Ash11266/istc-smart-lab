"use client";

import { usePathname } from "next/navigation";

export default function BackgroundVideo() {
  const pathname = usePathname();
  
  // Apply blur if we are not on the home page
  const shouldBlur = pathname !== "/";

  return (
    <>
      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ${
          shouldBlur ? "blur-3xl scale-110" : ""
        }`}
      >
        <source src="/animation.mp4" type="video/mp4" />
      </video>

      {/* 🔥 DARK OVERLAY */}
      <div className={`absolute inset-0 z-0 transition-colors duration-700 ${
        shouldBlur ? "bg-black/70" : "bg-black/60"
      }`}></div>
    </>
  );
}
