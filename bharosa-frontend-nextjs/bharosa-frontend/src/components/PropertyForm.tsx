"use client";
import { useState } from "react";
import type { Property } from "@/lib/types";

type Base = Partial<Property> & { status: "sale"|"rent" };

export default function PropertyForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Base;
  onSubmit: (p: Base, images: File[]) => Promise<void>;
  submitting?: boolean;
}) {
  const [form, setForm] = useState<Base>(initial || { status: "sale" });
  const [images, setImages] = useState<File[]>([]);

  function set<K extends keyof Base>(k: K, v: Base[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <form
      onSubmit={async (e) => { e.preventDefault(); await onSubmit(form, images); }}
      className="space-y-4 bg-white border rounded-2xl p-5"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Title" required
          value={form.title || ""} onChange={e=>set("title", e.target.value)} />
          <textarea
  className="border rounded-xl px-3 py-2 sm:col-span-2 min-h-[100px]"
  placeholder="Describe the property…"
  required
  value={(form as any).description || ""}
  onChange={(e) => set("description" as any, e.target.value)}
/>

        <input className="border rounded-xl px-3 py-2" placeholder="City" required
          value={form.city || ""} onChange={e=>set("city", e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Area / Neighborhood"
          value={form.area || ""} onChange={e=>set("area", e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Price (Rs.)" type="number" required
          value={form.price ?? ""} onChange={e=>set("price", Number(e.target.value))} />
        <input className="border rounded-xl px-3 py-2" placeholder="Beds" type="number"
          value={form.beds ?? ""} onChange={e=>set("beds", Number(e.target.value))} />
        <input className="border rounded-xl px-3 py-2" placeholder="Baths" type="number"
          value={form.baths ?? ""} onChange={e=>set("baths", Number(e.target.value))} />
        <input className="border rounded-xl px-3 py-2" placeholder="Area (sqft)" type="number"
          value={form.areaSqft ?? ""} onChange={e=>set("areaSqft", Number(e.target.value))} />
        <select className="border rounded-xl px-3 py-2" value={form.status}
          onChange={e=>set("status", e.target.value as any)}>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <input className="border rounded-xl px-3 py-2" placeholder="Type (apartment, house, office)"
          value={form.type || ""} onChange={e=>set("type", e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Amenities (comma separated)"
          value={(form.amenities || []).join(", ")}
          onChange={e=>set("amenities", e.target.value.split(",").map(s=>s.trim()).filter(Boolean) as any)} />
        <select className="border rounded-xl px-3 py-2" value={form.furnishing || ""}
          onChange={e=>set("furnishing", e.target.value)}>
          <option value="">Furnishing</option>
          <option value="furnished">Furnished</option>
          <option value="semi">Semi-furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
        <input className="border rounded-xl px-3 py-2" type="date" placeholder="Possession date"
          value={form.possessionDate ? String(form.possessionDate).slice(0,10) : ""}
          onChange={e=>set("possessionDate", e.target.value as any)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Latitude" type="number" step="any"
          value={form.lat ?? ""} onChange={e=>set("lat", Number(e.target.value))} />
        <input className="border rounded-xl px-3 py-2" placeholder="Longitude" type="number" step="any"
          value={form.lng ?? ""} onChange={e=>set("lng", Number(e.target.value))} />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Images</label>
        <input type="file" multiple accept="image/*"
          onChange={(e)=> setImages(Array.from(e.target.files || []))} />
      </div>

      <button disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl">
        {submitting ? "Saving…" : "Save Listing"}
      </button>
    </form>
  );
}
