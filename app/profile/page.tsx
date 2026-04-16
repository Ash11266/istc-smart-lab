import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { redirect } from "next/navigation";
import PasswordChangeForm from "./PasswordChangeForm";
import LogoutButton from "../components/LogoutButton";

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
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">

      {/* Profile Header Block */}
      <div className="bg-[#003366] text-white p-6 rounded-lg shadow-sm border-l-4 border-amber-500 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
          <p className="mt-2 text-slate-300">Manage your account credentials.</p>
        </div>
        <LogoutButton />
      </div>

      {/* Account Info Block */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Account details</h2>

        <div className="space-y-4">
          <div>
            <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Full Name</span>
            <span className="text-slate-900 font-medium text-lg">{user.name}</span>
          </div>

          <div>
            <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Email / Username</span>
            <span className="text-slate-900 font-medium text-lg">{user.email}</span>
          </div>

          <div>
            <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Role Type</span>
            <span className="inline-flex py-1 px-3 mt-1 rounded text-sm font-semibold bg-slate-100 text-[#003366] border border-slate-300">
              {user.is_admin ? "Administrator" : "User"}
            </span>
          </div>
        </div>
      </div>

      <PasswordChangeForm />

    </div>
  );
}
