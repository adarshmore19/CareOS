"use client";

import React from "react";
import { useCare } from "@/context/CareContext";
import Link from "next/link";
import {
  Pill,
  Users,
  Calendar,
  Activity,
  GraduationCap,
  Mic,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const {
    currentRole,
    currentUser,
    elderlyProfile,
    events,
    appointments,
    careTasks,
    adherence,
  } = useCare();

  const takenCount = events.filter((e) => e.status === "taken").length;
  const pendingCount = events.filter((e) => e.status === "unconfirmed").length;
  const nextAppointment = appointments.find((a) => a.status === "upcoming");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                CareOS Active Hub • {currentRole.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {currentUser.full_name}
            </h1>
            <p className="text-slate-600 text-sm">
              Care Ecosystem for patient: <strong>{elderlyProfile.full_name}</strong> (78 yrs)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/assistant"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Launch CareVoice AI</span>
            </Link>

            <Link
              href="/elderly"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Elderly Easy View</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">PillGuard Score</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{adherence.overall_percentage}%</div>
            <span className="text-xs text-teal-600 font-semibold">{adherence.status_assessment}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Today's Doses</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{takenCount} / {events.length}</div>
            <span className="text-xs text-slate-500">{pendingCount} pending confirmation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
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

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
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

      {/* Six Modules Quick Navigation */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">CareOS Ecosystem Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/medications"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-teal-700">MediMate</h4>
                <p className="text-xs text-slate-500">Medication scheduling & dosage timeline</p>
              </div>
            </div>
          </Link>

          <Link
            href="/family"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-700">FamilyCare</h4>
                <p className="text-xs text-slate-500">Shared family oversight & caregiver sync</p>
              </div>
            </div>
          </Link>

          <Link
            href="/appointments"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-700">CareSync</h4>
                <p className="text-xs text-slate-500">Doctor visits & caregiver coordination</p>
              </div>
            </div>
          </Link>

          <Link
            href="/adherence"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-rose-700">PillGuard</h4>
                <p className="text-xs text-slate-500">Adherence rate analytics & missed dose alerts</p>
              </div>
            </div>
          </Link>

          <Link
            href="/academy"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-amber-700">Health Academy</h4>
                <p className="text-xs text-slate-500">Multilingual audio lessons & quizzes</p>
              </div>
            </div>
          </Link>

          <Link
            href="/assistant"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">CareVoice AI</h4>
                <p className="text-xs text-slate-500">Voice-powered healthcare companion</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
