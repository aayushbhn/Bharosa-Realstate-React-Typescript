"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listAgents, type AgentProfile } from "@/lib/api";

export default function AgentsPage() {
  const [list, setList] = useState<AgentProfile[] | null>(null);

  useEffect(() => { (async () => setList(await listAgents()))(); }, []);
  if (!list) return <div>Loading…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Find My Agent</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((a) => (
          <Link key={a.id} href={`/agent/${a.id}`} className="bg-white border rounded-2xl p-4 hover:shadow">
            <div className="font-semibold">{a.user?.name || "Agent"}</div>
            <div className="text-sm text-gray-600">
              Sales: {a.totalSales} • Rent: {a.totalRent}
            </div>
            {a.languages?.length ? (
              <div className="text-xs text-gray-500 mt-1">{a.languages.join(", ")}</div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
