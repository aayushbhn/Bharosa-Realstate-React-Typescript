"use client";
import { useState } from "react";
import { register, login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [err,setErr]=useState<string|null>(null); const [busy,setBusy]=useState(false);
  const router = useRouter(); const { setAuth } = useAuth();

  async function submit(e:React.FormEvent){ e.preventDefault(); setBusy(true); setErr(null);
    try { await register({ name, email, password }); const { token, user } = await login({ email, password }); setAuth(user, token); router.push("/"); }
    catch(e:any){ setErr(e?.response?.data?.error || "Register failed"); } finally{ setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto space-y-3 bg-white border rounded-2xl p-6">
      <h1 className="text-2xl font-bold">Create account</h1>
      <input value={name} onChange={e=>setName(e.target.value)} required placeholder="Full name" className="w-full border rounded-xl px-3 py-2"/>
      <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full border rounded-xl px-3 py-2"/>
      <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full border rounded-xl px-3 py-2"/>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full">{busy? "Creating…":"Create account"}</button>
    </form>
  );
}
