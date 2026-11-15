"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCare } from "@/context/CareContext";
import {
  Activity,
  LayoutDashboard,
  Users,
  CheckSquare,
  Pill,
  Calendar,
  FileText,
  Bell,
  Settings,
  Menu,
  X,
  Shield,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  UserCheck,
  Heart,
  Plus,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function CaretakerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickNoteModal, setQuickNoteModal] = useState(false);

  // Quick note state
  const [noteContent, setNoteContent] = useState("");
  const [vitalsSummary, setVitalsSummary] = useState("BP 124/82, HR 74, SpO2 98%");
  const [quickNoteSaved, setQuickNoteSaved] = useState(false);

  const {
    elderlyProfiles,
    activePatient,
    careTasks,
    events,
    notifications,
    currentUser,
    signOut,
    addClinicalNote,
  } = useCare();

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const pendingTasks = careTasks.filter((t) => t.status !== "completed").length;
  const unconfirmedMeds = events.filter((e) => e.status === "unconfirmed").length;

  const navItems: NavItem[] = [
    { name: "Station Overview", href: "/caretaker/dashboard", icon: LayoutDashboard },
    { name: "Patient Directory", href: "/caretaker/patients", icon: Users },
    { name: "Care Task Queue", href: "/caretaker/tasks", icon: CheckSquare, badge: pendingTasks > 0 ? pendingTasks : undefined },
    { name: "Medication Admin (MAR)", href: "/caretaker/medications", icon: Pill, badge: unconfirmedMeds > 0 ? unconfirmedMeds : undefined },
    { name: "Appointments & Escort", href: "/caretaker/appointments", icon: Calendar },
    { name: "Clinical Notes (SOAP)", href: "/caretaker/clinical-notes", icon: FileText },
    { name: "Clinical Alerts", href: "/caretaker/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { name: "Settings & Duty Shift", href: "/caretaker/settings", icon: Settings },
  ];

  const handleSaveQuickNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent || !activePatient) return;

    await addClinicalNote({
      elderly_id: activePatient.id,
      caretaker_name: currentUser?.name || "Sister Sunita",
      content: noteContent,
      vitals_summary: vitalsSummary || undefined,
    });

    setQuickNoteSaved(true);
    setTimeout(() => {
      setQuickNoteSaved(false);
      setQuickNoteModal(false);
      setNoteContent("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Caretaker Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-slate-950 border-r border-slate-800 text-white shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/caretaker/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shadow-inner">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">CareOS</span>
              <span className="block text-[11px] font-semibold text-indigo-400 tracking-wider uppercase">
                Clinical Station
              </span>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            STAFF
          </span>
        </div>

        {/* Shift / Triage Strip */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              On Duty
            </span>
            <span className="text-[11px] text-slate-400">Shift ends 5:00 PM</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-base font-extrabold text-white">{elderlyProfiles.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">Assigned Patients</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
              <div className={`text-base font-extrabold ${unconfirmedMeds > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {unconfirmedMeds}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Pending Doses</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/caretaker/patients" && pathname.startsWith("/caretaker/patients/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Note CTA */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setQuickNoteModal(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Clinical Note</span>
          </button>
        </div>

        {/* Caregiver Identity Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
          <div className="truncate">
            <p className="font-semibold text-slate-200 truncate">
              {currentUser?.name || "Sister Sunita"}
            </p>
            <p className="text-[11px] text-slate-500">Registered Nurse / AHS</p>
          </div>
          <button
            onClick={() => signOut()}
            title="Sign out"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>Station Duty</span>
              </span>
              <span className="hidden sm:inline text-xs text-slate-500">
                Primary Focus: <strong className="text-slate-800">{activePatient?.name || "Patient"}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/patient/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Elderly View</span>
            </Link>

            <Link
              href="/family/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Family Circle</span>
            </Link>

            <Link
              href="/caretaker/notifications"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Emergency SOS</span>
              <span className="sm:hidden">112</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-slate-950 text-white flex flex-col h-full z-10 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white text-base">CareStation</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? "bg-indigo-600 text-white font-semibold" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">On Duty Staff</span>
              <button onClick={() => signOut()} className="text-xs text-rose-400 font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Note Modal */}
      {quickNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Record Clinical Note</h3>
              </div>
              <button
                onClick={() => setQuickNoteModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quickNoteSaved ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-800">Clinical Note Appended!</p>
                <p className="text-xs text-emerald-700">
                  Note recorded to immutable audit trail for {activePatient?.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveQuickNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient: <strong className="text-slate-900">{activePatient?.name}</strong>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Subjective/Objective observation: Patient completed morning walk, reported mild knee stiffness. Took breakfast without issue."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Recorded Vitals Summary
                  </label>
                  <input
                    type="text"
                    value={vitalsSummary}
                    onChange={(e) => setVitalsSummary(e.target.value)}
                    placeholder="BP 120/80, SpO2 98%, Pulse 72"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickNoteModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                  >
                    Append to Audit Trail
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
