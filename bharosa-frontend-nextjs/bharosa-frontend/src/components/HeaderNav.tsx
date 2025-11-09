"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export default function HeaderNav() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAgent = user?.role === "agent" || user?.role === "agency_admin" || user?.role === "super_admin";
  const isAdmin = user?.role === "agency_admin" || user?.role === "super_admin";
  const isCustomer = user?.role === "customer";

  return (
    <nav className="flex items-center gap-2">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1">
        <NavLink href="/">Home</NavLink>
        
        {/* Only show Agents link to public and customers */}
        {(!user || isCustomer) && (
          <NavLink href="/agents">Agents</NavLink>
        )}
        
        {/* Only show Saved to logged-in customers */}
        {isCustomer && (
          <NavLink href="/saved">Saved</NavLink>
        )}

        {/* Agent-specific links */}
        {isAgent && (
          <>
            <NavLink href="/agent/workspace">Workspace</NavLink>
            <NavLink href="/agent/visits">Visits</NavLink>
            <NavLink href="/agent/listings">Listings</NavLink>
            <NavLink href="/agent/listings/new" className="bg-primary-600 text-white hover:bg-primary-700">
              + New Listing
            </NavLink>
          </>
        )}
        
        {/* Admin link */}
        {isAdmin && (
          <NavLink href="/admin" className="bg-primary-100 text-primary-700 hover:bg-primary-200">
            Admin
          </NavLink>
        )}
      </div>

      {/* User Menu */}
      {user ? (
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center text-white text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
              <span className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-2 ml-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-medium text-white gradient-green rounded-lg hover:shadow-green transition-all duration-200 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            
            {(!user || isCustomer) && (
              <MobileNavLink href="/agents" onClick={() => setIsMenuOpen(false)}>Agents</MobileNavLink>
            )}
            
            {isCustomer && (
              <MobileNavLink href="/saved" onClick={() => setIsMenuOpen(false)}>Saved</MobileNavLink>
            )}

            {isAgent && (
              <>
                <MobileNavLink href="/agent/workspace" onClick={() => setIsMenuOpen(false)}>Workspace</MobileNavLink>
                <MobileNavLink href="/agent/visits" onClick={() => setIsMenuOpen(false)}>Visits</MobileNavLink>
                <MobileNavLink href="/agent/listings" onClick={() => setIsMenuOpen(false)}>Listings</MobileNavLink>
                <MobileNavLink href="/agent/listings/new" onClick={() => setIsMenuOpen(false)}>New Listing</MobileNavLink>
              </>
            )}

            {isAdmin && (
              <MobileNavLink href="/admin" onClick={() => setIsMenuOpen(false)}>Admin</MobileNavLink>
            )}

            {user ? (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="px-3 py-2 text-sm text-gray-600">
                  {user.name} • {user.role.replace('_', ' ')}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-white gradient-green rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 ${className}`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
    >
      {children}
    </Link>
  );
}
