import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { redirect } from "next/navigation";
import PasswordChangeForm from "./PasswordChangeForm";
import LogoutButton from "../components/LogoutButton";
import { User, Mail, Shield, UserCircle } from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await decrypt(token);
  if (!session || !session.userId) {
    redirect("/login");
  }

  const [users] = await db.query<RowDataPacket[]>(
    "SELECT name, email, is_admin FROM users WHERE id = ?",
    [session.userId]
  );

  if (users.length === 0) {
    redirect("/login");
  }

  const user = users[0];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f0fbfa]/80 to-white/80 backdrop-blur-sm p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Profile Header Block */}
        <div className="bg-[#0B5D57] text-white p-8 rounded-xl shadow-xl border-l-[8px] border-orange-500 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-md border border-white/30 shadow-inner">
              <UserCircle size={48} className="text-orange-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Profile</h1>
              <p className="mt-2 text-teal-100/80 font-medium">Manage your research laboratory account.</p>
            </div>
          </div>
          <div className="relative z-10">
            <LogoutButton />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Account Info Block */}
          <div className="md:col-span-3 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-teal-100 flex flex-col">
            <div className="flex items-center gap-3 mb-8 border-b border-teal-50 pb-4">
              <User className="text-[#0B5D57]" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Account Details</h2>
            </div>

            <div className="space-y-8 flex-1">
              <div className="group transition-all">
                <span className="flex items-center gap-2 text-[#0B5D57] text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                  <User size={14} /> Full Name
                </span>
                <span className="text-slate-900 font-semibold text-xl block bg-slate-50/50 p-3 rounded-xl border border-slate-100 group-hover:border-teal-200 transition-colors">
                  {user.name}
                </span>
              </div>

              <div className="group transition-all">
                <span className="flex items-center gap-2 text-[#0B5D57] text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                  <Mail size={14} /> Email / Username
                </span>
                <span className="text-slate-900 font-semibold text-xl block bg-slate-50/50 p-3 rounded-xl border border-slate-100 group-hover:border-teal-200 transition-colors">
                  {user.email}
                </span>
              </div>

              <div className="group transition-all">
                <span className="flex items-center gap-2 text-[#0B5D57] text-xs font-bold uppercase tracking-widest mb-2 opacity-70">
                  <Shield size={14} /> Access Level
                </span>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-bold shadow-sm ${user.is_admin
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "bg-teal-100 text-teal-700 border border-teal-200"
                    }`}>
                    {user.is_admin ? (
                      <>
                        <Shield size={16} /> Administrator
                      </>
                    ) : (
                      <>
                        <User size={16} /> Authorized User
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}
