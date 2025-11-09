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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by keyword, area, city…"
              className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <FiltersBar value={filters} onChange={setFilters} />
        </div>
      </div>

      {(isLoading || isFetching) && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">Loading properties…</p>
          </div>
        </div>
      )}

      {(!isLoading && !isFetching && (data?.length ?? 0) === 0) && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-lg text-gray-600">No properties found.</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((p) => (
          <ListingCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
