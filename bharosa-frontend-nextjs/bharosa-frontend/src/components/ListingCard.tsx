"use client";
import Link from "next/link";
import { Property } from "@/lib/types";
import { useSaved } from "@/lib/useSaved";

export default function ListingCard({ p }: { p: Property }) {
  const { isSaved, toggle } = useSaved();
  const img = p.imageUrls?.[0];
  const saved = isSaved.has(p.id);

  return (
    <div className="rounded-2xl border bg-white p-4 hover:shadow transition relative">
      <button
        onClick={(e) => { e.preventDefault(); toggle(p.id); }}
        className={`absolute right-5 top-5 rounded-full border bg-white/90 px-3 py-1 text-xs ${saved ? "border-red-500 text-red-600" : "border-gray-300 text-gray-700"}`}
        aria-label="Save"
        title={saved ? "Unsave" : "Save"}
      >
        {saved ? "♥ Saved" : "♡ Save"}
      </button>

      <div
        className="aspect-video rounded-xl bg-gray-100 mb-3"
        style={{ backgroundImage: img ? `url(${img})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 max-w-[70%]">
          <Link href={`/property/${p.id}`} className="font-semibold hover:underline truncate block">{p.title}</Link>
          <div className="text-sm text-gray-600 truncate">{p.city}{p.area ? ` • ${p.area}` : ""}</div>
          <div className="text-sm text-gray-600">{p.beds} beds • {p.baths} baths • {p.areaSqft} sqft</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold">Rs. {Number(p.price).toLocaleString()}</div>
          <div className="text-xs uppercase text-gray-500">{p.status}</div>
        </div>
      </div>
    </div>
  );
}
