"use client";
import { useState } from "react";
import RequireRole from "@/components/RequireRole";
import PropertyForm from "@/components/PropertyForm";
import { createProperty, uploadPropertyImages } from "@/lib/api";
import { useRouter } from "next/navigation";

function Inner() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  const router = useRouter();

  async function handleSubmit(form: any, images: File[]) {
    setBusy(true); setErr(null);
    try {
      const created = await createProperty(form);
      if (images.length) await uploadPropertyImages(created.id, images);
      alert("Listing submitted for approval.");
      router.push("/agent/listings");
    } catch (e:any) {
      setErr(e?.response?.data?.error || e?.message || "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Listing</h1>
      {err && <div className="text-red-600">{err}</div>}
      <PropertyForm onSubmit={handleSubmit} submitting={busy} />
    </div>
  );
}

export default function Page() {
  return (
    <RequireRole roles={["agent","agency_admin","super_admin"]}>
      <Inner/>
    </RequireRole>
  );
}
