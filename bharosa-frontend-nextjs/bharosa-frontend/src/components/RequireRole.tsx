"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

type Props = {
  roles: Array<"agent" | "agency_admin" | "super_admin" | "customer">;
  redirectTo?: string; // defaults to /login?next=<current>
  children: React.ReactNode;
};

export default function RequireRole({ roles, redirectTo, children }: Props) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!ready) return; // wait until auth state is loaded
    const next = redirectTo || `/login?next=${encodeURIComponent(path)}`;
    // no user -> go login
    if (!user) {
      router.replace(next);
      return;
    }
    // has user but not allowed -> home
    if (!roles.includes(user.role)) {
      router.replace("/");
    }
  }, [ready, user, roles, router, path, redirectTo]);

  if (!ready) return <div>Checking access…</div>;
  if (!user) return null;                  // redirecting
  if (!roles.includes(user.role)) return null; // redirecting

  return <>{children}</>;
}
