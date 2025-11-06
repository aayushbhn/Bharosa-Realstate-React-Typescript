import "./globals.css";
import { Providers } from "@/app/providers";
import { AuthProvider } from "@/lib/auth";
import HeaderNav from "@/components/HeaderNav";

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
            <div className="min-h-dvh bg-gray-50 text-gray-900">
              <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                  <div className="text-xl font-semibold">Bharosa</div>
                  <HeaderNav />
                </div>
              </header>
              <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
