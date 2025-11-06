"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchSaved, saveProperty, unsaveProperty, getProperty, type Property } from "./api";

export function useSaved() {
  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // watch token
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (token) {
        const data = await fetchSaved();
        setIds(data.map((d) => d.property.id));
      } else {
        const raw = localStorage.getItem("savedIds");
        setIds(raw ? JSON.parse(raw) : []);
      }
      setLoading(false);
    })();
  }, [token]);

  const isSaved = useMemo(() => new Set(ids), [ids]);

  async function toggle(id: string) {
    if (token) {
      if (isSaved.has(id)) await unsaveProperty(id);
      else await saveProperty(id);
      const data = await fetchSaved();
      setIds(data.map((d) => d.property.id));
    } else {
      const next = new Set(ids);
      if (next.has(id)) next.delete(id); else next.add(id);
      const arr = Array.from(next);
      setIds(arr);
      localStorage.setItem("savedIds", JSON.stringify(arr));
    }
  }

  async function getSavedProperties(): Promise<Property[]> {
    if (token) {
      const data = await fetchSaved();
      return data.map((d) => d.property);
    }
    const raw = localStorage.getItem("savedIds");
    const arr: string[] = raw ? JSON.parse(raw) : [];
    const items = await Promise.all(arr.map((id) => getProperty(id)));
    return items.filter(Boolean) as Property[];
  }

  return { loading, ids, isSaved, toggle, getSavedProperties };
}
