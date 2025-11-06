"use client";
import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import { myListings } from "@/lib/api";
import { Property } from "@/lib/types";
import ListingCard from "@/components/ListingCard";

function Inner() {
  const [list, setList] = useState<Property[] | null>(null);
  useEffect(()=>{ (async()=> setList(await myListings()))(); }, []);
  if (!list) return <div>Loading…</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(p => <ListingCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

export default function Page(){
  return (
    <RequireRole roles={["agent","agency_admin","super_admin"]}>
      <Inner/>
    </RequireRole>
  );
}
