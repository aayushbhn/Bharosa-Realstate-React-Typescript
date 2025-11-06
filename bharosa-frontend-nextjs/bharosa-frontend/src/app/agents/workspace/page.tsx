"use client";
import { useEffect, useState } from "react";
import RequireRole from "@/components/RequireRole";
import { api, Lead, LeadStage, myLeads, updateLeadStage } from "@/lib/api";

const STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "visit_scheduled",
  "revisit",
  "negotiation",
  "won",
  "lost",
];

function WorkspaceInner() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setLeads(await myLeads());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function changeStage(id: string, stage: LeadStage) {
    await updateLeadStage(id, stage);
    setLeads((arr) => arr.map((l) => (l.id === id ? { ...l, stage } : l)));
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lead Pipeline</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STAGES.slice(0, 6).map((stage) => (
          <div key={stage} className="bg-white border rounded-2xl">
            <div className="px-4 py-2 border-b font-semibold capitalize">
              {stage.replace("_", " ")}
            </div>
            <div className="p-3 space-y-3">
              {leads
                .filter((l) => l.stage === stage)
                .map((l) => (
                  <div key={l.id} className="border rounded-xl p-3">
                    <div className="font-medium">
                      {l.customer?.name}{" "}
                      <span className="text-xs text-gray-500">
                        ({l.customer?.email})
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {l.property?.title}
                    </div>
                    <div className="mt-2">
                      <select
                        value={l.stage}
                        onChange={(e) =>
                          changeStage(l.id, e.target.value as LeadStage)
                        }
                        className="border rounded-lg px-2 py-1 text-sm"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 flex gap-2 items-center">
  
                          <button
                            className="text-xs underline"
                            onClick={async ()=>{
                              const value = prompt("Deal value (Rs.)") || "0";
                              const commission = prompt("Commission (Rs.)") || "0";
                              const status = (prompt("won or lost?") || "won").toLowerCase();
                              const notes = prompt("Notes (optional)") || "";
                              await api.post('/api/deals', { leadId: l.id, value, commission, status, notes });
                              // optimistically move card
                              setLeads(arr=>arr.map(x=>x.id===l.id? {...x, stage: status==='won'?'won':'lost'}:x));
                            }}
                          >Close Deal…</button>
                        </div>

                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="md:col-span-1 bg-white border rounded-2xl">
          <div className="px-4 py-2 border-b font-semibold">Closed</div>
          <div className="p-3 space-y-3">
            {leads
              .filter((l) => l.stage === "won" || l.stage === "lost")
              .map((l) => (
                <div key={l.id} className="border rounded-xl p-3">
                  <div className="font-medium">{l.customer?.name}</div>
                  <div className="text-sm text-gray-600">
                    {l.property?.title}
                  </div>
                  <div className="text-xs uppercase mt-1">{l.stage}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <RequireRole roles={["agent", "agency_admin", "super_admin"]}>
      <WorkspaceInner />
    </RequireRole>
  );
}
