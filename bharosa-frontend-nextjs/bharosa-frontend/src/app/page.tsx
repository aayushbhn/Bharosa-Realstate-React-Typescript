"use client";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const { user, ready } = useAuth();

  // Show loading state while checking auth
  if (!ready) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Public landing page for non-logged-in users
  if (!user) {
    return <LandingPage />;
  }

  const isAgent = user.role === "agent" || user.role === "agency_admin";
  const isSuperAdmin = user.role === "super_admin";
  const isAdmin = user.role === "agency_admin" || user.role === "super_admin";
  const isCustomer = user.role === "customer";

  // Agent/Agency Admin Dashboard
  if (isAgent) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Agent Dashboard
          </h1>
          <p className="text-gray-600">Manage your listings, leads, and visits</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <DashboardCard
            href="/agent/workspace"
            title="Lead Pipeline"
            description="Track & update stages"
            icon="📊"
            color="from-blue-500 to-blue-600"
          />
          <DashboardCard
            href="/agent/visits"
            title="My Visits"
            description="Status & revisits"
            icon="📅"
            color="from-purple-500 to-purple-600"
          />
          <DashboardCard
            href="/agent/listings"
            title="My Listings"
            description="Your properties"
            icon="🏠"
            color="from-primary-500 to-primary-600"
          />
        </div>
        {isAdmin && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Admin Functions</h2>
            <DashboardCard
              href="/admin"
              title="Moderate Listings"
              description="Approve pending listings"
              icon="✅"
              color="from-green-500 to-green-600"
            />
          </div>
        )}
      </div>
    );
  }

  // Super Admin Dashboard (not an agent)
  if (isSuperAdmin && !isAgent) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage the platform and moderate content</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <DashboardCard
            href="/admin"
            title="Moderate Listings"
            description="Approve pending listings"
            icon="✅"
            color="from-primary-500 to-primary-600"
          />
          <DashboardCard
            href="/agents"
            title="Manage Agents"
            description="View all agents"
            icon="👥"
            color="from-indigo-500 to-indigo-600"
          />
        </div>
      </div>
    );
  }

  // Customer view - Property search
  if (isCustomer) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Find Your Dream Property
          </h1>
          <p className="text-xl text-gray-600">Browse through our curated selection of properties</p>
        </div>
        <HomeSearch />
      </div>
    );
  }

  // Fallback
  return <HomeSearch />;
}

function DashboardCard({ 
  href, 
  title, 
  description, 
  icon, 
  color 
}: { 
  href: string; 
  title: string; 
  description: string; 
  icon: string; 
  color: string;
}) {
  return (
    <Link 
      href={href}
      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
