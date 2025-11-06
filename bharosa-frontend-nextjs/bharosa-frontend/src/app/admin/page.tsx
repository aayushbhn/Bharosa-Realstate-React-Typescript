"use client";
import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import { pendingListings, approveListing } from "@/lib/api";
import { Property } from "@/lib/types";

function Inner() {
  const [list, setList] = useState<Property[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(){ setList(await pendingListings()); }
  useEffect(()=>{ load(); }, []);

  async function approve(id:string){
    setBusyId(id);
    await approveListing(id);
    await load();
    setBusyId(null);
  }

  if (!list) return <div>Loading…</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Moderate Listings</h1>
      {list.length === 0 ? <div>No pending listings 🎉</div> :
        <div className="space-y-3">
          {list.map(p=>(
            <div key={p.id} className="bg-white border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.city}{p.area?` • ${p.area}`:""} — Rs. {p.price.toLocaleString()}</div>
              </div>
              <button disabled={busyId===p.id}
                onClick={()=>approve(p.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-50">
                {busyId===p.id? "Approving…" : "Approve"}
              </button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

export default function AdminPage(){
  return (
    <RequireRole roles={["agency_admin","super_admin"]}>
      <Inner/>
    </RequireRole>
  );
}
