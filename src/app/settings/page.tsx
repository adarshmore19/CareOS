"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Settings,
  User,
  Shield,
  Eye,
  Volume2,
  RefreshCw,
  Database,
  CheckCircle2,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function SettingsPage() {
  const { currentUser, elderlyProfile, resetDemoData } = useCare();
  const [largeFonts, setLargeFonts] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState("0.95");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all mock events and appointments to initial state?")) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>CareOS Preferences</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Account & Accessibility Settings
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Customize display readability, speech synthesis options, and connected database settings.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          <span>Active User Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Full Name</span>
            <div className="font-bold text-slate-900 text-base">{currentUser.full_name}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Email Address</span>
            <div className="font-bold text-slate-900 text-base">{currentUser.email}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Assigned Role</span>
            <div className="font-bold text-teal-800 text-base uppercase">{currentUser.role}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Registered Patient</span>
            <div className="font-bold text-slate-900 text-base">{elderlyProfile.full_name} (78 yrs)</div>
          </div>
        </div>
      </div>

      {/* Accessibility & Audio Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-teal-600" />
          <span>Elderly Accessibility Preferences</span>
        </h3>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-sm text-slate-900">Enlarged Typography Mode</div>
              <div className="text-xs text-slate-500">Increases base font size to 20px across all modules</div>
            </div>
            <input
              type="checkbox"
              checked={largeFonts}
              onChange={(e) => setLargeFonts(e.target.checked)}
              className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-sm text-slate-900">High Contrast Mode (WCAG AAA)</div>
              <div className="text-xs text-slate-500">Boosts contrast ratios and visual separation</div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-sm text-slate-900">Speech Synthesis Playback Speed</div>
              <div className="text-xs text-slate-500">Adjust the speaking pace for CareVoice and Health Academy</div>
            </div>
            <select
              value={audioSpeed}
              onChange={(e) => setAudioSpeed(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
            >
              <option value="0.8">0.8x (Deliberate & Slow)</option>
              <option value="0.95">0.95x (Elderly Recommended)</option>
              <option value="1.0">1.0x (Standard)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database & Persistence Status */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-teal-600" />
          <span>Storage & Cloud Database Engine</span>
        </h3>

        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-teal-900">
            <span className="font-bold block">
              {isSupabaseConfigured
                ? "Live Supabase PostgreSQL Database Connected"
                : "Active Local Demo & Storage Store Engine"}
            </span>
            <span>
              All medication intake confirmations, appointment bookings, and care tasks persist reactively in your session.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reset Demo Store to Baseline</span>
          </button>
          {resetSuccess && (
            <p className="text-xs text-emerald-600 font-semibold mt-2">
              Demo store restored to original baseline!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
