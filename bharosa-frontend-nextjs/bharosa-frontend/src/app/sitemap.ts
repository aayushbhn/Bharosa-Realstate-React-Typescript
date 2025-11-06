import { api } from "@/lib/api";  // uses NEXT_PUBLIC_API_BASE
import type { Property } from "@/lib/types";

export default async function sitemap() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"}/api/properties`, { next: { revalidate: 3600 }});
    const props: Property[] = await res.json();
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const urls = props.map(p => ({ url: `${base}/property/${p.id}`, lastModified: new Date().toISOString() }));
    return [
      { url: `${base}/`, lastModified: new Date().toISOString() },
      { url: `${base}/agents`, lastModified: new Date().toISOString() },
      ...urls,
    ];
  } catch {
    // fallback minimal
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return [{ url: `${base}/`, lastModified: new Date().toISOString() }];
  }
}
