"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCare } from "@/context/CareContext";
import { UserRole } from "@/lib/types";
import { EnvironmentBanner } from "@/components/EnvironmentBanner";
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
    { name: "MediMate", href: "/medications", icon: Pill },
    { name: "FamilyCare", href: "/family", icon: Users },
    { name: "CareSync", href: "/appointments", icon: Calendar },
    { name: "PillGuard", href: "/adherence", icon: Activity },
    { name: "Health Academy", href: "/academy", icon: GraduationCap },
    { name: "CareVoice", href: "/assistant", icon: Mic },
  ];

  const roles: { role: UserRole; label: string; name: string }[] = [
    { role: "elderly", label: "Patient", name: "Eleanor Vance" },
    { role: "family", label: "Family", name: "David Vance" },
    { role: "caretaker", label: "Caregiver", name: "Nurse Priya, RN" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <EnvironmentBanner />
      {/* Top Banner: Role Context & Persona Switcher */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span className="text-slate-400">Active View:</span>
          <span className="font-semibold text-white">{currentUser.full_name}</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-slate-800 text-teal-300 border border-slate-700">
            {currentRole}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline text-xs">Switch View:</span>
          <div className="flex items-center gap-1.5">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => setCurrentRole(r.role)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  currentRole === r.role
                    ? "bg-teal-700 text-white font-semibold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                title={`Switch view to ${r.name}`}
              >
                {r.label}: {r.name.split(" ")[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (confirm("Reset demo data to default baseline?")) {
                resetDemoData();
              }
            }}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs ml-2 pl-2 border-l border-slate-700"
            title="Reset data to baseline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">CareOS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  HEALTHCARE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                Connected Elderly Care Platform
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-700" : "text-slate-400"}`} />
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
            >
              <span>Elderly View</span>
            </Link>

            {/* Notification Bell (Clean, No Bounce Slop) */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-teal-700 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-sm text-slate-900">Care Updates</span>
                    <span className="text-xs text-slate-500">{notifications.length} total</span>
                  </div>

                  <div className="mt-2 space-y-2 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-xs border ${
                            n.is_read
                              ? "bg-slate-50 border-slate-100 text-slate-600"
                              : "bg-teal-50 border-teal-200 text-slate-900 font-medium"
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
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="flex items-center gap-2 p-2.5 rounded-md bg-amber-50 text-amber-900 font-semibold text-sm mb-2"
          >
            <span>Elderly View</span>
          </Link>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
