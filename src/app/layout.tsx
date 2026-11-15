import type { Metadata } from "next";
import "./globals.css";
import { CareProvider } from "@/context/CareContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CareOS - AI-Powered Elderly Healthcare & Medication Management",
  description:
    "An intelligent elderly care ecosystem connecting MediMate, FamilyCare, CareSync, PillGuard, Health Academy, and CareVoice into one unified healthcare platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-100 selection:text-teal-900">
        <CareProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">CareOS Ecosystem</span>
                <span>•</span>
                <span>HIPAA & WCAG 2.1 Compliant Architecture</span>
              </div>
              <div className="text-slate-400">
                Non-diagnostic medical compliance platform. Real-time patient & family synchrony.
              </div>
            </div>
          </footer>
        </CareProvider>
      </body>
    </html>
  );
}
