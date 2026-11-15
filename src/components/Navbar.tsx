"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCare } from "@/context/CareContext";
import { UserRole } from "@/lib/types";
import {
  Heart,
  Pill,
  Users,
  Calendar,
  Activity,
  GraduationCap,
  Mic,
  Bell,
  CheckCircle2,
  RefreshCw,
  Menu,
  X,
  Volume2,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    notifications,
    markNotificationRead,
    resetDemoData,
  } = useCare();

  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.is_read);

  const navLinks = [
    { name: "MediMate", href: "/medications", icon: Pill, tag: "Meds" },
    { name: "FamilyCare", href: "/family", icon: Users, tag: "Family" },
    { name: "CareSync", href: "/appointments", icon: Calendar, tag: "Care" },
    { name: "PillGuard", href: "/adherence", icon: Activity, tag: "Analytics" },
    { name: "Health Academy", href: "/academy", icon: GraduationCap, tag: "Learn" },
    { name: "CareVoice AI", href: "/assistant", icon: Mic, tag: "Assistant", special: true },
  ];

  const roles: { role: UserRole; label: string; badge: string }[] = [
    { role: "elderly", label: "Eleanor (Elderly)", badge: "bg-teal-50 text-teal-800 border-teal-200" },
    { role: "family", label: "David (Family)", badge: "bg-blue-50 text-blue-800 border-blue-200" },
    { role: "caretaker", label: "Nurse Priya (Care)", badge: "bg-purple-50 text-purple-800 border-purple-200" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner: Role Aware & Demo status */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">Active Profile:</span>
          <span className="font-semibold text-white">{currentUser.full_name}</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-teal-300">
            {currentRole}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">Switch Perspective:</span>
          <div className="flex items-center gap-1">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => setCurrentRole(r.role)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentRole === r.role
                    ? "bg-teal-600 text-white font-semibold shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                title={`Switch to ${r.label}`}
              >
                {r.role === "elderly" ? "👵 Eleanor" : r.role === "family" ? "👨 David" : "👩‍⚕️ Nurse"}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (confirm("Reset demo data to default baseline?")) {
                resetDemoData();
              }
            }}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] ml-2 pl-2 border-l border-slate-700"
            title="Reset to clean baseline data"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 tracking-tight">CareOS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                Connected Healthcare Ecosystem
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-sm"
                      : link.special
                      ? "text-teal-700 hover:bg-teal-50/60 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive || link.special ? "text-teal-600" : "text-slate-500"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Elderly Easy View Button */}
            <Link
              href="/elderly"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-sm"
            >
              <span>👵 Big Button View</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">Care Updates & Alerts</span>
                    <span className="text-xs text-slate-500">{notifications.length} total</span>
                  </div>

                  <div className="mt-2 space-y-2 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-xs border transition-colors ${
                            n.is_read
                              ? "bg-slate-50 border-slate-100 text-slate-600"
                              : "bg-teal-50/70 border-teal-200 text-slate-900 font-medium"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-teal-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.created_at}</span>
                          </div>
                          <p className="mt-1 text-slate-600 leading-relaxed">{n.message}</p>
                          {!n.is_read && (
                            <button
                              onClick={() => markNotificationRead(n.id)}
                              className="mt-2 inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold hover:underline"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Mark as read
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            href="/elderly"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 text-amber-900 font-bold text-sm mb-2"
          >
            <span>👵 Simplified Elderly View</span>
          </Link>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? "bg-teal-50 text-teal-800 border border-teal-200"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5 text-teal-600" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
