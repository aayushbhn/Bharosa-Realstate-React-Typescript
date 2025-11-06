"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function HeaderNav() {
  const { user, logout } = useAuth();
  const isAgent = user?.role === "agent" || user?.role === "agency_admin" || user?.role === "super_admin";
  const isAdmin = user?.role === "agency_admin" || user?.role === "super_admin";

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/agents" className="hover:underline">Agents</Link>
      <Link href="/saved" className="hover:underline">Saved</Link>

      {isAgent && (
        <>
          <Link href="/agent/workspace" className="hover:underline">Workspace</Link>
          <Link href="/agent/visits" className="hover:underline">Visits</Link>
          <Link href="/agent/listings" className="hover:underline">My Listings</Link>
          <Link href="/agent/listings/new" className="hover:underline">New Listing</Link>
        </>
      )}
      {isAdmin && <Link href="/admin" className="hover:underline">Admin</Link>}

      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{user.name} • {user.role.replace('_',' ')}</span>
          <button onClick={logout} className="underline">Logout</button>
        </div>
      ) : (
        <>
          <Link href="/login" className="underline">Login</Link>
          <Link href="/register" className="underline">Register</Link>
        </>
      )}
    </div>
  );
}
