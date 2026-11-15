"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCare } from "@/context/CareContext";
import {
  Users,
  LayoutDashboard,
  Activity,
  Pill,
  Calendar,
  Bell,
  Clock,
  Settings,
  Menu,
  X,
  ChevronDown,
  Shield,
  Heart,
  PhoneCall,
  UserPlus,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Invite modal form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [relationship, setRelationship] = useState("Daughter");
  const [canEditMeds, setCanEditMeds] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const {
    elderlyProfiles,
    activePatient,
    setActivePatientId,
    notifications,
    adherence,
    events,
    inviteFamilyMember,
    currentUser,
    signOut,
  } = useCare();

  const adherenceRate = typeof adherence === "number" ? adherence : (adherence?.overall_percentage ?? 95);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const patientEvents = events.filter((e) => e.elderly_id === activePatient?.id);
  const unconfirmedCount = patientEvents.filter((e) => e.status === "unconfirmed").length;

  const navItems: NavItem[] = [
    { name: "Overview", href: "/family/dashboard", icon: LayoutDashboard },
    { name: "My Family", href: "/family/patients", icon: Users },
    { name: "Patient Monitoring", href: "/family/monitoring", icon: Activity },
    { name: "Medication Tracking", href: "/family/medications", icon: Pill },
    { name: "Appointments & Escort", href: "/family/appointments", icon: Calendar },
    { name: "Notifications", href: "/family/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { name: "Activity History", href: "/family/activity", icon: Clock },
    { name: "Settings & Access", href: "/family/settings", icon: Settings },
  ];

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    await inviteFamilyMember(inviteEmail, relationship, canEditMeds);
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setInviteModalOpen(false);
      setInviteEmail("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-slate-900 border-r border-slate-800 text-white shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/family/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold shadow-inner">
              <Users className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">CareOS</span>
              <span className="block text-[11px] font-semibold text-teal-400 tracking-wider uppercase">
                FamilyCare Circle
              </span>
            </div>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            FAMILY
          </span>
        </div>

        {/* Patient Switcher */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Monitoring Patient</span>
            <span className="text-teal-400 text-xs font-semibold">{elderlyProfiles.length} Linked</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setPatientDropdownOpen(!patientDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                  {activePatient?.name ? activePatient.name.charAt(0) : "P"}
                </div>
                <div className="truncate">
                  <div className="text-sm font-semibold text-white truncate">
                    {activePatient?.name || "Select Patient"}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Age {activePatient?.age || 72} • Adherence {adherenceRate}%
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {patientDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-slate-800">
                {elderlyProfiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePatientId(p.id);
                      setPatientDropdownOpen(false);
                    }}
                    className={`w-full p-2.5 flex items-center gap-2.5 text-left text-sm transition-colors hover:bg-slate-800 ${
                      activePatient?.id === p.id ? "bg-teal-950/40 text-teal-300 font-semibold" : "text-slate-300"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {(p.name || p.full_name || "P").charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="text-sm">{p.name || p.full_name}</div>
                      <div className="text-xs text-slate-400">Age {p.age}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Invite Quick Action */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Family Member</span>
          </button>
        </div>

        {/* User / Sign Out Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/30">
          <div className="truncate">
            <p className="font-semibold text-slate-200 truncate">
              {currentUser?.name || "Priya Sharma"}
            </p>
            <p className="text-[11px] text-slate-500">Family Caregiver</p>
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
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Active Circle:{" "}
                <span className="text-teal-700 font-bold">{activePatient?.name || "Patient"}</span>
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Adherence {adherenceRate}%
              </span>
              {unconfirmedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-800 rounded-full border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {unconfirmedCount} dose pending
                </span>
              )}
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
              href="/caretaker/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Caretaker Portal</span>
            </Link>

            <Link
              href="/family/notifications"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="View notifications"
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
              <span className="hidden sm:inline">SOS Protocol</span>
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
          <div className="relative w-72 max-w-[80vw] bg-slate-900 text-white flex flex-col h-full z-10 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-white text-base">FamilyCare</span>
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
                      isActive ? "bg-teal-600 text-white font-semibold" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Signed in as Family Member</span>
              <button onClick={() => signOut()} className="text-xs text-rose-400 font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">Invite Family Member</h3>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-800">Invitation Dispatched!</p>
                <p className="text-xs text-emerald-700">
                  An authentic access invitation has been registered for {inviteEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Family Member Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="sibling@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relationship to {activePatient?.name}
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="canEditMeds"
                    checked={canEditMeds}
                    onChange={(e) => setCanEditMeds(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                  />
                  <label htmlFor="canEditMeds" className="text-xs text-slate-700 font-medium">
                    Grant permission to edit medication schedules and add notes
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                  >
                    Send Invitation
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
