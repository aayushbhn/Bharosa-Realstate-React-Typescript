"use client";
import { useState } from "react";
import { scheduleVisit } from "@/lib/api";

export default function VisitForm({
  propertyId,
  onDone,
}: { propertyId: string; onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [dateISO, setDateISO] = useState("");
  const [timeHHmm, setTimeHHmm] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResultUrl(null);
    try {
      const { icsUrl } = await scheduleVisit({
        propertyId,
        name,
        email,
        phone,
        notes,
        dateISO,
        timeHHmm,
        meetingLocation,
      });
      setResultUrl(icsUrl);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to schedule visit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="text-lg font-semibold">Schedule a Visit</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="border rounded-xl px-3 py-2" />
        <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="border rounded-xl px-3 py-2" />
        <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (optional)" className="border rounded-xl px-3 py-2 sm:col-span-2" />
        <input required type="date" value={dateISO} onChange={(e)=>setDateISO(e.target.value)} className="border rounded-xl px-3 py-2" />
        <input required type="time" value={timeHHmm} onChange={(e)=>setTimeHHmm(e.target.value)} className="border rounded-xl px-3 py-2" />
        <input value={meetingLocation} onChange={(e)=>setMeetingLocation(e.target.value)} placeholder="Meeting location (optional)" className="border rounded-xl px-3 py-2 sm:col-span-2" />
      </div>
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes (optional)" className="w-full border rounded-xl px-3 py-2" rows={3} />

      {error && <div className="text-sm text-red-600">{error}</div>}
      {resultUrl ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-green-700">Visit scheduled! Add to your calendar:</div>
          <a href={resultUrl} className="bg-emerald-600 text-white px-4 py-2 rounded-xl" target="_blank">Download ICS</a>
        </div>
      ) : (
        <div className="flex justify-end">
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-50">
            {submitting ? "Scheduling..." : "Schedule"}
          </button>
        </div>
      )}
    </form>
  );
}
