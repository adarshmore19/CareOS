"use client";

import React, { useEffect } from "react";
import { useCare } from "@/context/CareContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Users,
  Activity,
  Pill,
  Calendar,
  GraduationCap,
  Mic,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";

export default function DashboardPage() {
  const {
    currentRole,
    currentUser,
    activePatient,
    events,
    appointments,
    careTasks,
    adherence,
  } = useCare();
  const router = useRouter();

  const takenCount = events.filter((e) => e.status === "taken").length;
  const pendingCount = events.filter((e) => e.status === "unconfirmed").length;
  const nextAppointment = appointments.find((a) => a.status === "upcoming");

  const adherenceRate = typeof adherence === "number" ? adherence : (adherence?.overall_percentage ?? 95);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                CareOS Unified Access Hub
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">
                Role: <strong className="capitalize text-slate-900">{currentRole}</strong>
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome to CareOS
            </h1>
            <p className="text-slate-600 text-sm">
              Care Ecosystem for: <strong>{activePatient?.name || "Ram Sharma"}</strong> (Age {activePatient?.age || 72})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/patient/dashboard"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Patient Dashboard</span>
            </Link>

            <Link
              href="/family/dashboard"
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Family Dashboard</span>
            </Link>

            <Link
              href="/caretaker/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Caretaker Console</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured: Three Distinct Role Dashboards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-teal-700" />
          <h2 className="text-lg font-bold text-slate-900">Three Dedicated Role Experiences</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Patient Card */}
          <Link
            href="/patient/dashboard"
            className="group bg-white rounded-2xl p-6 border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Elderly Companion
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Patient Dashboard
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Large accessible typography, 1-tap pill confirmations, Web Speech screen reader, Bluetooth sensor widgets, and CareVoice AI assistant.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Open Patient View &rarr;</span>
              <span className="text-[11px] text-slate-400 font-normal">WCAG AAA</span>
            </div>
          </Link>

          {/* Family Card */}
          <Link
            href="/family/dashboard"
            className="group bg-white rounded-2xl p-6 border-2 border-teal-200 hover:border-teal-500 hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-800 uppercase tracking-wider">
                Care Circle SaaS
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                Family Dashboard
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Multi-patient switcher, 7-day adherence charts, dose delay alerts, clinic escort coordination, and family invitation controls.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Open FamilyCare &rarr;</span>
              <span className="text-[11px] text-slate-400 font-normal">Multi-Patient</span>
            </div>
          </Link>

          {/* Caretaker Card */}
          <Link
            href="/caretaker/dashboard"
            className="group bg-white rounded-2xl p-6 border-2 border-indigo-200 hover:border-indigo-500 hover:shadow-lg transition-all space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                Clinical Station
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                Caretaker Dashboard
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Clinical triage board, Medication Administration Record (MAR), care duty queue, auditable SOAP notes with amendments, and shift handover.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>Open CareStation &rarr;</span>
              <span className="text-[11px] text-slate-400 font-normal">Staff Console</span>
            </div>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">PillGuard Score</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{adherenceRate}%</div>
            <span className="text-xs text-teal-600 font-semibold">Active Baseline</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Today's Doses</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{takenCount} / {events.length}</div>
            <span className="text-xs text-slate-500">{pendingCount} pending confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Next Appointment</span>
            <div className="text-lg font-black text-slate-900 mt-1 truncate max-w-[150px]">
              {nextAppointment?.doctor_name.split("(")[0] || "None scheduled"}
            </div>
            <span className="text-xs text-indigo-600 font-semibold">{nextAppointment?.appointment_time || "--"}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Pending Care Tasks</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {careTasks.filter((t) => t.status === "pending").length}
            </div>
            <span className="text-xs text-amber-600 font-semibold">Active checklist</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
