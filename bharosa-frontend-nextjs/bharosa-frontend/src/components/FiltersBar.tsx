"use client";
import { useState, useEffect } from "react";

export interface Filters {
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  status?: "sale" | "rent";
  type?: "apartment" | "house" | "land" | "office" | "villa";
  sort?: 'newest' | 'price_asc' | 'price_desc';
}
export default function FiltersBar({ value, onChange }:{ value: Filters; onChange:(f:Filters)=>void }) {
  const [f, setF] = useState<Filters>(value || {});
  useEffect(()=>onChange(f), [f]); // emit on change

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input type="number" placeholder="Min Price" className="border rounded-xl px-3 py-2 bg-white w-36"
        value={f.minPrice ?? ""} onChange={e=>setF({...f, minPrice: e.target.value ? Number(e.target.value) : undefined})}/>
      <input type="number" placeholder="Max Price" className="border rounded-xl px-3 py-2 bg-white w-36"
        value={f.maxPrice ?? ""} onChange={e=>setF({...f, maxPrice: e.target.value ? Number(e.target.value) : undefined})}/>
      <input type="number" placeholder="Beds" className="border rounded-xl px-3 py-2 bg-white w-28"
        value={f.beds ?? ""} onChange={e=>setF({...f, beds: e.target.value ? Number(e.target.value) : undefined})}/>
      <input type="number" placeholder="Baths" className="border rounded-xl px-3 py-2 bg-white w-28"
        value={f.baths ?? ""} onChange={e=>setF({...f, baths: e.target.value ? Number(e.target.value) : undefined})}/>
      <select className="border rounded-xl px-3 py-2 bg-white" value={f.status ?? ""} onChange={e=>setF({...f, status: (e.target.value||undefined) as any})}>
        <option value="">Status</option><option value="sale">Sale</option><option value="rent">Rent</option>
      </select>
      <select className="border rounded-xl px-3 py-2 bg-white" value={f.type ?? ""} onChange={e=>setF({...f, type: (e.target.value||undefined) as any})}>
        <option value="">Type</option>
        <option value="apartment">Apartment</option><option value="house">House</option>
        <option value="land">Land</option><option value="office">Office</option><option value="villa">Villa</option>
      </select>
      <select className="border rounded-xl px-3 py-2 bg-white"
    value={f.sort ?? 'newest'}
    onChange={e=>setF({...f, sort: e.target.value as any})}>
    <option value="newest">Newest</option>
    <option value="price_asc">Price ↑</option>
    <option value="price_desc">Price ↓</option>
  </select>
    </div>
  );
}
