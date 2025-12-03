"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProperty, getSimilar, getImageUrl } from "@/lib/api";
import { Property } from "@/lib/types";
import ListingCard from "@/components/ListingCard";
import Modal from "@/components/Modal";
import LeadForm from "@/components/LeadForm";
import VisitForm from "@/components/VisitForm";
import { useSaved } from "@/lib/useSaved";
import { logContact } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Script from "next/script";
import Link from "next/link";

export default function PropertyPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [p, setP] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadOpen, setLeadOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const { isSaved, toggle } = useSaved();
  const { user } = useAuth();
  
  // Only customers can request info and schedule visits
  const isCustomer = user?.role === "customer";
  const isLoggedIn = !!user;

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

  const saved = isSaved.has(p.id);
  const prefill = `Hi, I'm interested in ${p.title} (${p.id}).`;
  const wa = `https://wa.me/9779812345678?text=${encodeURIComponent(prefill)}`;
  const img = getImageUrl(p.imageUrls?.[0]);  // 👈 use helper

  return (
    <>
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
      <div className="space-y-6 animate-fade-in">
        <div
          className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-lg"
          style={{
            backgroundImage: img ? `url("${img}")` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!img && (
            <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
              🏠
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{p.title}</h1>
            <div className="flex items-center text-gray-600 mb-3">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg">{p.city} • {p.area}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{p.beds}</span>
                <span>bed{p.beds !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{p.baths}</span>
                <span>bath{p.baths !== 1 ? 's' : ''}</span>
              </div>
              {p.areaSqft && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{p.areaSqft}</span>
                  <span>sqft</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right space-y-3">
            <div className="text-3xl font-bold text-primary-600">Rs. {Number(p.price).toLocaleString()}</div>
            
            <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[200px]">
              {/* Save button - show to all logged-in users */}
              {isLoggedIn && (
                <button
                  onClick={() => toggle(p.id)}
                  className={`px-4 py-2.5 rounded-xl border-2 font-medium transition-all duration-200 ${
                    saved 
                      ? "border-primary-500 text-primary-600 bg-primary-50 hover:bg-primary-100" 
                      : "border-gray-300 text-gray-700 hover:border-primary-300 hover:text-primary-600"
                  }`}
                  title={saved ? "Unsave" : "Save"}
                >
                  {saved ? "❤️ Saved" : "🤍 Save"}
                </button>
              )}

              {/* WhatsApp - show to all */}
              <a
                href={wa}
                onClick={async (e)=>{ e.preventDefault(); try { await logContact(p.id, 'whatsapp'); } finally { window.open(wa, '_blank'); } }}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#25D366] text-white px-4 py-2.5 rounded-xl hover:bg-[#20BA5A] transition-all duration-200 font-medium text-center shadow-sm hover:shadow-md"
              >
                💬 WhatsApp Agent
              </a>

              {/* Request Info - ONLY for customers */}
              {isCustomer ? (
                <button
                  onClick={() => setLeadOpen(true)}
                  className="block w-full bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  📧 Request Info
                </button>
              ) : !isLoggedIn ? (
                <Link
                  href={`/login?next=${encodeURIComponent(`/property/${p.id}`)}`}
                  className="block w-full bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-all duration-200 font-medium text-center shadow-sm hover:shadow-md"
                >
                  📧 Login to Request Info
                </Link>
              ) : null}

              {/* Schedule Visit - ONLY for customers */}
              {isCustomer ? (
                <button
                  onClick={() => setVisitOpen(true)}
                  className="block w-full gradient-green text-white px-4 py-2.5 rounded-xl hover:shadow-green transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  📅 Schedule Visit
                </button>
              ) : !isLoggedIn ? (
                <Link
                  href={`/login?next=${encodeURIComponent(`/property/${p.id}`)}`}
                  className="block w-full gradient-green text-white px-4 py-2.5 rounded-xl hover:shadow-green transition-all duration-200 font-medium text-center shadow-sm hover:shadow-md"
                >
                  📅 Login to Schedule Visit
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Property description */}
        {p.description && (
          <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed text-lg">{p.description}</p>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Similar Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((sp) => (
              <ListingCard key={sp.id} p={sp} />
            ))}
          </div>
        </section>

        {/* Modals - only show if user is customer */}
        {isCustomer && (
          <>
            <Modal open={leadOpen} onClose={() => setLeadOpen(false)}>
              <LeadForm propertyId={p.id} onDone={() => setLeadOpen(false)} />
            </Modal>

            <Modal open={visitOpen} onClose={() => setVisitOpen(false)}>
              <VisitForm propertyId={p.id} onDone={() => setVisitOpen(false)} />
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
