"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCare } from "@/context/CareContext";
import {
  Heart,
  Pill,
  Calendar,
  Mic,
  GraduationCap,
  FileText,
  Settings,
  PhoneCall,
  Volume2,
  VolumeX,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { EnvironmentBanner } from "@/components/EnvironmentBanner";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activePatient, events, adherence, signOut } = useCare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const navItems = [
    { name: "Home", href: "/patient/dashboard", icon: Heart },
    { name: "My Medications", href: "/patient/medications", icon: Pill },
    { name: "Appointments", href: "/patient/appointments", icon: Calendar },
    { name: "CareVoice", href: "/patient/assistant", icon: Mic },
    { name: "Health Academy", href: "/patient/academy", icon: GraduationCap },
    { name: "My Health Records", href: "/patient/health-records", icon: FileText },
    { name: "Settings", href: "/patient/settings", icon: Settings },
  ];

  const handleSpeakOverview = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const pendingCount = events.filter((e) => e.status === "unconfirmed").length;
      const text = `Hello ${activePatient.full_name}. Today is ${today}. You have ${events.length} scheduled medicines, and ${pendingCount} are waiting for confirmation. You can use the large buttons on your screen to confirm when you take your medicines.`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <EnvironmentBanner />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile Header */}
        <header className="md:hidden bg-teal-800 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-teal-800 flex items-center justify-center font-black text-lg">
              EV
            </div>
            <div>
              <h2 className="font-black text-base leading-tight">{activePatient.full_name}</h2>
              <span className="text-xs text-teal-200">Patient Companion</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakOverview}
              className="p-2.5 rounded-xl bg-teal-700 text-white hover:bg-teal-600"
              aria-label="Read schedule aloud"
            >
              {speaking ? <VolumeX className="w-6 h-6 text-amber-300" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-teal-700 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Accessible Patient Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:flex flex-col w-full md:w-80 bg-teal-900 text-white border-r border-teal-800 p-6 md:min-h-screen justify-between shrink-0 z-30`}
        >
          <div className="space-y-6">
            {/* Brand Card */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-teal-800/80">
              <div className="w-12 h-12 rounded-2xl bg-white text-teal-900 flex items-center justify-center shadow-sm">
                <Heart className="w-7 h-7 text-teal-800 fill-teal-800" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">MediMate</h1>
                <span className="text-xs font-bold text-teal-300 tracking-wide uppercase">
                  CareOS Patient Companion
                </span>
              </div>
            </div>

            {/* Patient Identity Badge */}
            <div className="p-4 rounded-2xl bg-teal-800/60 border border-teal-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xl border-2 border-teal-500">
                  {activePatient.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-black text-lg text-white leading-tight">
                    {activePatient.full_name}
                  </h3>
                  <span className="text-xs text-teal-300 font-semibold">
                    {activePatient.blood_group || "Blood Group O+"} • Age 78
                  </span>
                </div>
              </div>
            </div>

            {/* Accessible Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-lg transition-all ${
                      isActive
                        ? "bg-white text-teal-950 shadow-md ring-2 ring-teal-400"
                        : "text-teal-100 hover:bg-teal-800/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className={`w-6 h-6 ${isActive ? "text-teal-800" : "text-teal-300"}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-5 h-5 text-teal-800" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Emergency Lifeline Action */}
          <div className="pt-6 space-y-3 border-t border-teal-800/80 mt-6">
            <a
              href={`tel:${activePatient.emergency_contact_phone || "112"}`}
              className="w-full py-4 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-md flex items-center justify-center gap-3 transition-colors touch-target"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>Call Emergency Help</span>
            </a>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl text-teal-300 hover:text-white hover:bg-teal-800/50 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Patient Header */}
          <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-5 items-center justify-between sticky top-0 z-20 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Personal Healthcare Companion
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Good day, {activePatient.full_name}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Voice Read-Aloud Action */}
              <button
                onClick={handleSpeakOverview}
                className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base flex items-center gap-2.5 shadow-sm transition-colors touch-target"
              >
                {speaking ? (
                  <>
                    <VolumeX className="w-5 h-5 text-amber-300" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Read Aloud</span>
                  </>
                )}
              </button>

              <Link
                href="/patient/assistant"
                className="px-5 py-3 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-base border border-emerald-300 flex items-center gap-2 transition-colors"
              >
                <Mic className="w-5 h-5 text-emerald-700" />
                <span>Ask CareVoice</span>
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

