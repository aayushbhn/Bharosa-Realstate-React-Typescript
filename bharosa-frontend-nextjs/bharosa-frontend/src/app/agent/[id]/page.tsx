"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAgent, type AgentWithListings } from "@/lib/api";
import ListingCard from "@/components/ListingCard";

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export default function AgentProfilePage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [data, setData] = useState<AgentWithListings | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setErr(null);
      setData(null);
      setLoading(true);

      if (!UUID_RE.test(id)) {
        setErr("Invalid agent id.");
        setLoading(false);
        return;
      }

      try {
        const d = await getAgent(id);
        setData(d);
      } catch (e: any) {
        setErr(e?.response?.data?.error || e?.message || "Failed to load agent");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (err) return <div className="text-red-600">{err}</div>;
  if (!data) return <div>Not found</div>;

  const { agent, listings } = data;
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-5">
        <div className="text-2xl font-bold">{agent.user?.name || "Agent"}</div>
        <div className="text-sm text-gray-600">{agent.bio}</div>
        <div className="text-sm text-gray-600">
          Total Sales: {agent.totalSales} • Total Rent: {agent.totalRent}
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Active Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((p) => <ListingCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}
