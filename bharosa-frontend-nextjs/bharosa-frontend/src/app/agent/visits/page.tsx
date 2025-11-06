"use client";
import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import { api } from "@/lib/api";
import type { Property } from "@/lib/types";

type Visit = { id:string; dateTime:string; status:'scheduled'|'completed'|'no_show'; isRevisit:boolean; revisitReason?:string; property: Property };

function Inner() {
  const [list,setList] = useState<Visit[]|null>(null);
  const [err,setErr] = useState<string|null>(null);

  async function load(){ setErr(null);
    try { const { data } = await api.get<Visit[]>(`/api/visits/my`); setList(data); }
    catch(e:any){ setErr(e?.message || "Failed to load"); }
  }
  useEffect(()=>{ load(); }, []);

  async function setStatus(id:string, status:Visit["status"]){ await api.patch(`/api/visits/${id}/status`, { status }); await load(); }
  async function revisit(id:string){ const reason = prompt("Reason?") || ""; const when = prompt("New date/time (YYYY-MM-DD HH:mm)?");
    if (!when) return; const [d,t] = when.split(" "); const [Y,M,D]=d.split("-").map(Number); const [h,m]=t.split(":").map(Number);
    const dt = new Date(Y,(M-1),D,h,m).toISOString(); await api.patch(`/api/visits/${id}/revisit`, { reason, newDateTimeISO: dt }); await load();
  }

  if (!list) return <div>Loading…</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Visits</h1>
      {err && <div className="text-red-600">{err}</div>}
      <div className="space-y-3">
        {list.map(v=>(
          <div key={v.id} className="bg-white border rounded-xl p-4">
            <div className="font-semibold">{v.property.title}</div>
            <div className="text-sm text-gray-600">{new Date(v.dateTime).toLocaleString()} • {v.status}{v.isRevisit? " • Revisit":""}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>setStatus(v.id,'completed')} className="px-3 py-1 rounded-lg border">Mark Completed</button>
              <button onClick={()=>setStatus(v.id,'no_show')} className="px-3 py-1 rounded-lg border">No-show</button>
              <button onClick={()=>revisit(v.id)} className="px-3 py-1 rounded-lg border">Revisit…</button>
            </div>
          </div>
        ))}
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
