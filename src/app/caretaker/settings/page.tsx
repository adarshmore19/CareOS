"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Settings,
  Shield,
  Activity,
  Clock,
  UserCheck,
  CheckCircle2,
  Database,
  LogOut,
  Hospital,
} from "lucide-react";

export default function CaretakerSettingsPage() {
  const {
    currentUser,
    signOut,
    dbMode,
    setDbMode,
  } = useCare();

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [handoverNote, setHandoverNote] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveHandover = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-indigo-600" />
            <span>Staff Console & Handover</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Caretaker Settings & Duty Shift
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Manage your clinical credentials, shift status, and nursing handover protocols.
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
          <span>Shift handover information updated successfully.</span>
        </div>
      )}

      {/* Staff Profile & Credentials */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Clinical Staff Credentials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 uppercase font-semibold text-[10px]">Staff Name</span>
            <div className="text-sm font-bold text-slate-900">{currentUser?.name || "Sister Sunita"}</div>
            <div className="text-slate-500">Registered Nurse / Assisted Living Practitioner</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 uppercase font-semibold text-[10px]">Affiliation Agency</span>
            <div className="text-sm font-bold text-slate-900">CareOS Certified Clinical Agency</div>
            <div className="text-slate-500">License ID: #MH-NURSE-2024-8821</div>
          </div>
        </div>
      </div>

      {/* Shift Status & Handover */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Shift Status & Clinical Handover</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnDuty ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              <span>Status: {isOnDuty ? "On Duty (Active Shift)" : "Off Duty (Standby)"}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active shift window: 8:00 AM – 5:00 PM IST
            </p>
          </div>

          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              isOnDuty
                ? "bg-slate-900 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {isOnDuty ? "End Shift" : "Begin Shift"}
          </button>
        </div>

        <form onSubmit={handleSaveHandover} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Shift Handover Summary for Next Nurse / Caregiver
            </label>
            <textarea
              rows={3}
              value={handoverNote}
              onChange={(e) => setHandoverNote(e.target.value)}
              placeholder="e.g. All morning medications administered without incident. Patient rested comfortably at 2:00 PM. Evening BP check due at 6:00 PM."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              Sign Shift Handover
            </button>
          </div>
        </form>
      </div>

      {/* Data Environment Mode */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Database className="w-4 h-4 text-slate-600" />
          <h2 className="text-base font-bold text-slate-900">Data Environment Mode</h2>
        </div>

        <p className="text-xs text-slate-600">
          Switch between verified seed demo data and authentic clean slate empty state.
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
