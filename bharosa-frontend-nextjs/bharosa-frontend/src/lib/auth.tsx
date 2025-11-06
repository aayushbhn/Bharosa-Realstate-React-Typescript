"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "agency_admin" | "agent" | "customer";
};

type AuthCtx = {
  user: User | null;
  token: string | null;
  ready: boolean;                 // <-- new
  setAuth: (u: User, t: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);        // <-- new

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setReady(true);                                  // <-- now we know localStorage read finished
  }, []);

  function setAuth(u: User, t: string) {
    setUser(u);
    setToken(t);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
    setReady(true);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setReady(true);
  }

  return (
    <Ctx.Provider value={{ user, token, ready, setAuth, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
