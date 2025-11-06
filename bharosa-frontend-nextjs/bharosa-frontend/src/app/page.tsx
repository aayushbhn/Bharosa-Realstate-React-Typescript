"use client";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import HomeSearch from "@/components/HomeSearch"; // your existing home content (or inline)

export default function Home() {
  const { user } = useAuth();
  const isAgent = user?.role === "agent" || user?.role === "agency_admin" || user?.role === "super_admin";
  const isAdmin = user?.role === "agency_admin" || user?.role === "super_admin";

  if (isAgent) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Agent Home</h1>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link className="bg-white border rounded-2xl p-5 hover:shadow" href="/agent/workspace">
            <div className="font-semibold">Lead Pipeline</div><div className="text-sm text-gray-600">Track & update stages</div>
          </Link>
          <Link className="bg-white border rounded-2xl p-5 hover:shadow" href="/agent/visits">
            <div className="font-semibold">My Visits</div><div className="text-sm text-gray-600">Status & revisits</div>
          </Link>
          <Link className="bg-white border rounded-2xl p-5 hover:shadow" href="/agent/listings">
            <div className="font-semibold">My Listings</div><div className="text-sm text-gray-600">Your properties</div>
          </Link>
        </div>
        <hr className="my-4"/>
        <HomeSearch/>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Home</h1>
        <Link className="bg-white border rounded-2xl p-5 inline-block hover:shadow" href="/admin">
          <div className="font-semibold">Moderate Listings</div>
          <div className="text-sm text-gray-600">Approve pending listings</div>
        </Link>
        <hr className="my-4"/>
        <HomeSearch/>
      </div>
    );
  }

  // default customer
  return <HomeSearch/>;
}
