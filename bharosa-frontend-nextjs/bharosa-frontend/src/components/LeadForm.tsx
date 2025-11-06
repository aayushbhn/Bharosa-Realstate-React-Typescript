"use client";
import { useState } from "react";
import { createLead } from "@/lib/api";

export default function LeadForm({ propertyId, onDone }:{ propertyId:string; onDone:()=>void }) {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [notes,setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg,setMsg] = useState<string | null>(null);

  async function submit(e:React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      await createLead({ name, email, phone, propertyId, notes });
      setMsg("Thanks! An agent will contact you shortly.");
      setTimeout(onDone, 1000);
    } catch (e:any) {
      setMsg(e?.response?.data?.error || "Failed to submit lead.");
    } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="text-lg font-semibold">Request Info</h3>
      <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"
        className="w-full border rounded-xl px-3 py-2" />
      <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
        className="w-full border rounded-xl px-3 py-2" />
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone (optional)"
        className="w-full border rounded-xl px-3 py-2" />
      <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes (optional)"
        className="w-full border rounded-xl px-3 py-2" rows={3}/>
      {msg && <div className="text-sm">{msg}</div>}
      <div className="flex justify-end gap-2">
        <button type="submit" disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50">
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
