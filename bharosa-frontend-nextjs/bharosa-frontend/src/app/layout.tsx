import "./globals.css";
import { Providers } from "@/app/providers";
import { AuthProvider } from "@/lib/auth";
import HeaderNav from "@/components/HeaderNav";
import Link from "next/link";

export const metadata = {
  title: "Bharosa Real Estate",
  description: "Find properties, contact agents, schedule visits.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <div className="min-h-dvh bg-gradient-to-br from-gray-50 via-white to-green-50/30 text-gray-900">
              <header className="sticky top-0 z-50 border-b border-green-100/50 bg-white/95 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2 group">
                      <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center shadow-green group-hover:shadow-green-lg transition-all duration-300 transform group-hover:scale-105">
                        <span className="text-white text-xl font-bold">B</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                        Bharosa
                      </span>
                    </Link>
                    <HeaderNav />
                  </div>
                </div>
              </header>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
