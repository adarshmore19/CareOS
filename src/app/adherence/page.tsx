"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Bell,
  ShieldCheck,
  Send,
  HelpCircle,
} from "lucide-react";
import { BluetoothHealthDeviceWidget } from "@/components/BluetoothHealthDeviceWidget";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function AdherencePage() {
  const { adherence, events, addNotification, elderlyProfile } = useCare();
  const [alertSent, setAlertSent] = useState(false);

  const handleSendCaretakerAlert = () => {
    addNotification({
      recipient_id: "user-caretaker-1",
      elderly_id: elderlyProfile.id,
      type: "adherence_alert",
      title: "Adherence Check Request",
      message: `PillGuard manual alert: Adherence rate is currently ${adherence.overall_percentage}%. Please follow up with Eleanor Vance.`,
      is_read: false,
    });
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            <span>PillGuard • Adherence Monitoring & Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Medication Adherence & Compliance
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time compliance calculation from scheduled vs recorded medication events.
          </p>
        </div>

        <button
          onClick={handleSendCaretakerAlert}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{alertSent ? "Alert Sent to Nurse Priya!" : "Send Caretaker Adherence Alert"}</span>
        </button>
      </div>

      {/* Main Scorecard & Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adherence Rate Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                PillGuard Score
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  adherence.overall_percentage >= 90
                    ? "bg-emerald-100 text-emerald-800"
                    : adherence.overall_percentage >= 75
                    ? "bg-amber-100 text-amber-900"
                    : "bg-rose-100 text-rose-900"
                }`}
              >
                {adherence.status_assessment}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900 tracking-tight">
                {adherence.overall_percentage}%
              </span>
              <span className="text-sm font-semibold text-slate-500">adherence rate</span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Calculated deterministically from recorded intake events. A score above 85% is clinically recommended for effective hypertension and glycemic management.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>PillGuard adheres to non-diagnostic rule-based safety standards.</span>
          </div>
        </div>

        {/* Dose Breakdown Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
            <span className="text-xs font-bold text-emerald-800 uppercase">Taken</span>
            <div className="text-3xl font-black text-emerald-950 mt-1">{adherence.taken_count}</div>
            <p className="text-xs text-emerald-700 mt-1">Confirmed on time</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
            <span className="text-xs font-bold text-amber-800 uppercase">Pending</span>
            <div className="text-3xl font-black text-amber-950 mt-1">{adherence.unconfirmed_count}</div>
            <p className="text-xs text-amber-700 mt-1">Upcoming or waiting</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <span className="text-xs font-bold text-slate-600 uppercase">Skipped</span>
            <div className="text-3xl font-black text-slate-800 mt-1">{adherence.skipped_count}</div>
            <p className="text-xs text-slate-500 mt-1">Logged as skipped</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm">
            <span className="text-xs font-bold text-rose-800 uppercase">Missed</span>
            <div className="text-3xl font-black text-rose-950 mt-1">{adherence.missed_count}</div>
            <p className="text-xs text-rose-700 mt-1">Unconfirmed & past due</p>
          </div>
        </div>
      </div>

      {/* Weekly Compliance Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900">7-Day Adherence Trend</h3>
            <p className="text-xs text-slate-500">Historical performance across the past week</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Past 7 Days</span>
        </div>

        <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end pt-8 pb-4">
          {adherence.weekly_trend.map((day) => (
            <div key={day.day} className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-700">{day.percentage}%</span>
              <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl h-44 flex flex-col justify-end p-1">
                <div
                  className={`w-full rounded-lg transition-all ${
                    day.percentage >= 90
                      ? "bg-teal-500"
                      : day.percentage >= 75
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ height: `${Math.max(day.percentage, 15)}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-slate-600 text-center">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Authentic Hardware Device Integration */}
      <BluetoothHealthDeviceWidget />

      {/* Explanatory Clinical Guardrail */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-4">
        <HelpCircle className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 block font-semibold mb-1">
            Why PillGuard Adherence Alerts Are Generated:
          </strong>
          PillGuard uses deterministic threshold monitoring. If scheduled medication events remain unconfirmed after their scheduled window or if cumulative daily adherence drops below 80%, alerts are automatically issued to authorized caretakers and family members. CareOS does not diagnose medical emergencies or predict clinical outcomes.
        </div>
      </div>
    </div>
  );
}
