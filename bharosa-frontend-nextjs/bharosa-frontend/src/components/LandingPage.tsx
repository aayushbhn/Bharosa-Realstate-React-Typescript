"use client";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-16 space-y-8">
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
            Welcome to Bharosa Real Estate
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in finding the perfect property. Explore thousands of 
            listings and connect with experienced real estate professionals.
          </p>
        </div>
        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/register"
              className="px-8 py-4 text-lg font-semibold text-white gradient-green rounded-xl hover:shadow-green-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 text-lg font-semibold text-primary-700 border-2 border-primary-300 rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center text-4xl">
            🏠
          </div>
          <h3 className="font-bold text-xl mb-3 text-gray-900">Wide Selection</h3>
          <p className="text-gray-600 leading-relaxed">
            Browse through thousands of properties across multiple cities and neighborhoods.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center text-4xl">
            🤝
          </div>
          <h3 className="font-bold text-xl mb-3 text-gray-900">Expert Agents</h3>
          <p className="text-gray-600 leading-relaxed">
            Connect with certified real estate agents who understand your needs.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center text-4xl">
            ✨
          </div>
          <h3 className="font-bold text-xl mb-3 text-gray-900">AI Recommendations</h3>
          <p className="text-gray-600 leading-relaxed">
            Get personalized property recommendations powered by advanced AI.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-3xl p-10 space-y-6 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">About Bharosa</h2>
        <div className="text-gray-600 space-y-4 text-lg leading-relaxed">
          <p>
            Bharosa Real Estate is a leading platform that connects property buyers, 
            sellers, and agents through an intelligent digital ecosystem. We make 
            property discovery, lead management, and real estate transactions seamless 
            and efficient.
          </p>
          <p>
            Our platform combines cutting-edge technology with personalized service to 
            help you find your dream property or grow your real estate business.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-10 shadow-green-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Create an account to start browsing properties and get personalized recommendations.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 text-lg font-semibold bg-white text-primary-700 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </section>
      )}

      {/* Browse Properties Link (for logged in customers) */}
      {user?.role === "customer" && (
        <section className="text-center py-8">
          <Link
            href="/properties"
            className="inline-block px-10 py-4 text-lg font-semibold text-white gradient-green rounded-xl hover:shadow-green-lg transition-all duration-300 transform hover:scale-105"
          >
            Browse Properties
          </Link>
        </section>
      )}
    </div>
  );
}
