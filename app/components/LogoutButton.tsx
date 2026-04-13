"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="text-sm font-semibold uppercase hover:underline underline-offset-4 tracking-wider text-slate-300 hover:text-white transition-colors"
    >
      Logout
    </button>
  );
}
