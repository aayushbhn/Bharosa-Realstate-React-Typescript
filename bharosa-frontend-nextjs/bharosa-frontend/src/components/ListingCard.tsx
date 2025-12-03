"use client";
import Link from "next/link";
import { Property } from "@/lib/types";
import { useSaved } from "@/lib/useSaved";
import { useAuth } from "@/lib/auth";
import { getImageUrl } from "@/lib/api";   // 👈 import it

export default function ListingCard({ p }: { p: Property }) {
  const { isSaved, toggle } = useSaved();
  const { user } = useAuth();

  const img = getImageUrl(p.imageUrls?.[0]);   // 👈 use helper here
  const saved = isSaved.has(p.id);
  const isLoggedIn = !!user;

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1 relative">
      {isLoggedIn && (
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(p.id);
          }}
          className={`absolute right-4 top-4 z-10 rounded-full border-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-sm transition-all duration-200 ${
            saved
              ? "border-primary-500 text-primary-600 bg-primary-50 hover:bg-primary-100"
              : "border-gray-300 text-gray-700 hover:border-primary-300 hover:text-primary-600"
          }`}
          aria-label="Save"
          title={saved ? "Unsave" : "Save"}
        >
          {saved ? "❤️ Saved" : "🤍 Save"}
        </button>
      )}

      <Link href={`/property/${p.id}`}>
        <div
          className="aspect-video rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-0 overflow-hidden relative"
          style={{
            backgroundImage: img ? `url("${img}")` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!img && (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
              🏠
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                p.status === "sale"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {p.status === "sale" ? "For Sale" : "For Rent"}
            </span>
          </div>
        </div>
      </Link>

      {/* rest of your card unchanged */}
      <div className="p-5 space-y-3">
        <div>
          <Link href={`/property/${p.id}`} className="block">
            <h3 className="font-bold text-lg text-gray-900 hover:text-primary-600 transition-colors line-clamp-1 mb-1">
              {p.title}
            </h3>
          </Link>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">
              {p.city}
              {p.area ? ` • ${p.area}` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">{p.beds}</span>
            <span>bed{p.beds !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{p.baths}</span>
            <span>bath{p.baths !== 1 ? "s" : ""}</span>
          </div>
          {p.areaSqft && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{p.areaSqft}</span>
              <span>sqft</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-2xl font-bold text-primary-600">
            Rs. {Number(p.price).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
