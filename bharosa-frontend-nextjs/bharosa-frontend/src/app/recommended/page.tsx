"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import type { Property } from "@/lib/types";
import { recsHome } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function RecommendedPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Property[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await recsHome(); // backend will personalize if token is present
        setList(data);
      } catch (e) {
        console.error("Failed to load recommendations", e);
        setList([]);
      }
    })();
  }, []);

  if (!list) return <div>Loading…</div>;

  const isLoggedIn = !!user;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">
          {isLoggedIn ? "Recommended for you" : "Suggested properties"}
        </h1>
        {!isLoggedIn && (
          <p className="text-sm text-gray-500">
            Login to get personalized recommendations.
          </p>
        )}
      </div>

      {list.length === 0 ? (
        <div>No recommendations yet. Try saving some properties first.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <ListingCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
