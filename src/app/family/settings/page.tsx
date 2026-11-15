"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Settings,
  Shield,
  Bell,
  Lock,
  Users,
  CheckCircle2,
  Database,
  LogOut,
  Mail,
  Smartphone,
} from "lucide-react";

export default function FamilySettingsPage() {
  const {
    activePatient,
    currentUser,
    signOut,
    dbMode,
    setDbMode,
    isRealSupabase,
    consents,
    invitations,
  } = useCare();

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [criticalThreshold, setCriticalThreshold] = useState("60");
  const [dailyDigest, setDailyDigest] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-teal-600" />
            <span>Preferences & Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Family Settings & Permissions
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Configure alert thresholds, communication channels, and care circle privacy controls.
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Notification preferences updated successfully.</span>
        </div>
      )}

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Bell className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">Emergency & Delay Alert Thresholds</h2>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-600" />
                SMS & WhatsApp Urgent Alerts
              </label>
              <p className="text-xs text-slate-500">
                Receive direct phone alerts if an essential medication is missed beyond threshold.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-sm font-bold text-slate-900 block">
              Critical Unconfirmed Delay Threshold
            </label>
            <p className="text-xs text-slate-500">
              How long after the scheduled time should an unconfirmed dose trigger a high-priority alert?
            </p>
            <select
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(e.target.value)}
              className="mt-1 w-full max-w-xs px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="30">30 minutes after scheduled time</option>
              <option value="60">60 minutes after scheduled time (Recommended)</option>
              <option value="90">90 minutes after scheduled time</option>
              <option value="120">120 minutes after scheduled time</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-600" />
                Daily Evening Care Summary
              </label>
              <p className="text-xs text-slate-500">
                A daily email report of completed doses and caretaker notes at 8:00 PM.
              </p>
            </div>
            <input
              type="checkbox"
              checked={dailyDigest}
              onChange={(e) => setDailyDigest(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Data Privacy & DPDPA Consents */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Shield className="w-4 h-4 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">Healthcare Privacy & Consent Governance</h2>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          CareOS strictly adheres to the <strong>Digital Personal Data Protection Act (DPDPA 2023)</strong> and HIPAA privacy guidelines. Health records for {activePatient?.name} are shared exclusively with explicitly authorized family members and verified caretakers.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Family Monitoring Consent</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Granted by Patient
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Caretaker Care Coordination Consent</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Emergency Speed Dial Telemetry</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enabled (112 / 108)
            </span>
          </div>
        </div>
      </div>

      {/* Data Mode Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Database className="w-4 h-4 text-slate-600" />
          <h2 className="text-base font-bold text-slate-900">Data Environment Mode</h2>
        </div>

        <p className="text-xs text-slate-600">
          Switch between verified development seed data and a clean slate empty state for real patient onboarding.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDbMode("seed")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              dbMode === "seed"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Development Seed Data
          </button>
          <button
            onClick={() => setDbMode("clean")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
              dbMode === "clean"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            Authentic Clean Slate
          </button>
        </div>
      </div>
    </div>
  );
}
