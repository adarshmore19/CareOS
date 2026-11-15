"use client";

import React from "react";
import { useCare } from "@/context/CareContext";
import {
  Users,
  Heart,
  Pill,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PhoneCall,
  Shield,
  Activity,
  ArrowRight,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function FamilyPage() {
  const {
    elderlyProfile,
    events,
    appointments,
    adherence,
    notifications,
    currentUser,
  } = useCare();

  const takenCount = events.filter((e) => e.status === "taken").length;
  const unconfirmedCount = events.filter((e) => e.status === "unconfirmed").length;
  const missedCount = events.filter((e) => e.status === "missed").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>FamilyCare • Shared Healthcare Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Family Care Circle
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Monitoring health status and daily care compliance for <strong>{elderlyProfile.full_name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Authorized as:</span>
          <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            {currentUser.full_name} ({currentUser.role})
          </span>
        </div>
      </div>

      {/* Primary Patient Status Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Patient Status: Stable & Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {elderlyProfile.full_name}, Age 78
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>Medical Profile:</strong> {elderlyProfile.medical_notes}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
              <span>Blood Group: <strong className="text-slate-800">{elderlyProfile.blood_group}</strong></span>
              <span>•</span>
              <span>Emergency Contact: <strong className="text-slate-800">{elderlyProfile.emergency_contact_name}</strong></span>
              <span>•</span>
              <span>Address: <strong className="text-slate-800">{elderlyProfile.address}</strong></span>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
              PillGuard Adherence
            </div>
            <div className="text-4xl font-black text-blue-950 mt-1">
              {adherence.overall_percentage}%
            </div>
            <div className="text-xs text-blue-700 font-semibold mt-1">
              {takenCount} of {events.length} doses confirmed today
            </div>
            <Link
              href="/adherence"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 underline"
            >
              <span>View Full PillGuard Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Status & Family Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Real-Time Medication Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Today's Medication Live Status</h3>
              <p className="text-xs text-slate-500">Directly synchronized with Eleanor's intake log</p>
            </div>
            <Link
              href="/medications"
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                      {evt.scheduled_time}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">{evt.medication_name}</h5>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Dose: {evt.dosage_quantity}</p>
                </div>

                <div>
                  {evt.status === "taken" ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Taken {evt.recorded_time}
                    </span>
                  ) : evt.status === "skipped" ? (
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                      Skipped
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Care Coordination & Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Care Updates & Alerts</h3>
              <p className="text-xs text-slate-500">Live notifications sent to family members</p>
            </div>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.created_at}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>

          {/* Primary Caretaker Contact Block */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Assigned Caretaker
                </span>
                <h5 className="font-bold text-sm text-slate-900">Nurse Priya Sharma, RN</h5>
                <p className="text-xs text-slate-600">Certified Geriatric Specialist</p>
              </div>
              <a
                href="tel:+15553456789"
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center gap-1 hover:bg-slate-800"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Nurse
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
