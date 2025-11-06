"use client";
import { useEffect, useState } from "react";
import { useSaved } from "@/lib/useSaved";
import ListingCard from "@/components/ListingCard";
import type { Property } from "@/lib/types";

export default function SavedPage() {
  const { getSavedProperties } = useSaved();
  const [list, setList] = useState<Property[] | null>(null);

  useEffect(() => { (async ()=> setList(await getSavedProperties()))(); }, []);
  if (!list) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Saved Properties</h1>
      {list.length === 0 ? <div>No saved properties yet.</div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p)=> <ListingCard key={p.id} p={p} />)}
        </div>}
    </div>
  );
}
