"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProperty, getSimilar } from "@/lib/api";
import { Property } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import Modal from "@/components/Modal";
import LeadForm from "@/components/LeadForm";
import VisitForm from "@/components/VisitForm";
import { useSaved } from "@/lib/useSaved";
import { logContact } from "@/lib/api";
import Script from "next/script";

export default function PropertyPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [p, setP] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadOpen, setLeadOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const { isSaved, toggle } = useSaved();

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const prop = await getProperty(id);
      setP(prop ?? null);
      const sim = await getSimilar(id);
      setSimilar(sim);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!p) return <div>Not found</div>;

  <Script id="schema-listing" type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context":"https://schema.org",
      "@type":"Offer",
      "itemOffered": {
        "@type":"Apartment",
        "name": p.title,
        "address": `${p.area || ""}, ${p.city || ""}`,
        "floorSize": { "@type":"QuantitativeValue", "value": p.areaSqft, "unitCode":"FTK" },
        "numberOfRooms": p.beds
      },
      "price": p.price,
      "priceCurrency": "NPR",
      "availability": "https://schema.org/InStock",
      "url": typeof window !== 'undefined' ? window.location.href : ""
    })
  }}
/>

  // safe to read p.id below this line
  const saved = isSaved.has(p.id);

  const prefill = `Hi, I'm interested in ${p.title} (${p.id}).`;
  const wa = `https://wa.me/9779812345678?text=${encodeURIComponent(prefill)}`;
  const img = p.imageUrls?.[0];

  return (
    <div className="space-y-6">
      <div
        className="aspect-video bg-gray-200 rounded-2xl"
        style={{
          backgroundImage: img ? `url(${img})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <div className="text-gray-600">
            {p.city} • {p.area}
          </div>
          <div className="mt-2">
            {p.beds} beds • {p.baths} baths • {p.areaSqft} sqft
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="text-2xl font-bold">Rs. {Number(p.price).toLocaleString()}</div>

          <button
            onClick={() => toggle(p.id)}
            className={`inline-block px-4 py-2 rounded-xl border ${
              saved ? "border-red-500 text-red-600" : "border-gray-300"
            }`}
            title={saved ? "Unsave" : "Save"}
          >
            {saved ? "♥ Saved" : "♡ Save"}
          </button>

          <a
  href={wa}
  onClick={async (e)=>{ e.preventDefault(); try { await logContact(p.id, 'whatsapp'); } finally { window.open(wa, '_blank'); } }}
  target="_blank"
  className="block bg-green-600 text-white px-4 py-2 rounded-xl"
>
  WhatsApp Agent
</a>

          <button
            onClick={() => setLeadOpen(true)}
            className="block bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Request Info
          </button>

          <button
            onClick={() => setVisitOpen(true)}
            className="block bg-indigo-600 text-white px-4 py-2 rounded-xl"
          >
            Schedule Visit
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Similar properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similar.map((sp) => (
            <ListingCard key={sp.id} p={sp} />
          ))}
        </div>
      </section>

      <Modal open={leadOpen} onClose={() => setLeadOpen(false)}>
        <LeadForm propertyId={p.id} onDone={() => setLeadOpen(false)} />
      </Modal>

      <Modal open={visitOpen} onClose={() => setVisitOpen(false)}>
        <VisitForm propertyId={p.id} onDone={() => setVisitOpen(false)} />
      </Modal>
    </div>
  );
}
