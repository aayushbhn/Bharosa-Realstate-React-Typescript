"use client";
import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { setAuth } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { token, user } = await login({ email, password });
      setAuth(user, token);
      router.push(next);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  // form JSX unchanged...

  return (
    <form onSubmit={submit} className="max-w-md mx-auto space-y-3 bg-white border rounded-2xl p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="Email" className="w-full border rounded-xl px-3 py-2"/>
      <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full border rounded-xl px-3 py-2"/>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button disabled={busy} className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full">{busy? "Logging in…":"Login"}</button>
    </form>
  );
}
