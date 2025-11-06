"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProperties } from "@/lib/api";
import ListingCard from "@/components/ListingCard";
import FiltersBar, { type Filters } from "@/components/FiltersBar";

export default function HomeSearch() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Filters>({ sort: "newest" });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["props", q, filters],
    queryFn: () => listProperties(q, filters),
  });

  useEffect(() => {
    const t = setTimeout(() => refetch(), 250); // debounce
    return () => clearTimeout(t);
  }, [q, filters, refetch]);

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-4">
        <div className="flex flex-col gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by keyword, area, city…"
            className="w-full border rounded-xl px-4 py-2.5 bg-white"
          />
          <FiltersBar value={filters} onChange={setFilters} />
        </div>
      </div>

      {(isLoading || isFetching) && (
        <div className="text-sm text-gray-500">Loading…</div>
      )}

      {(!isLoading && !isFetching && (data?.length ?? 0) === 0) && (
        <div className="text-sm text-gray-600">No properties found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((p) => (
          <ListingCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
