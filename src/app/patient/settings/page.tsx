"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import { useRouter } from "next/navigation";
import {
  Settings,
  Volume2,
  PhoneCall,
  User,
  Shield,
  ArrowRightLeft,
  LogOut,
  CheckCircle2,
} from "lucide-react";

export default function PatientSettingsPage() {
  const { activePatient, dataMode, setDataMode, signOut } = useCare();
  const router = useRouter();

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
          Preferences & Controls
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
          Patient Settings
        </h1>
        <p className="text-lg text-slate-700 font-medium mt-1">
          Customize your audio read-out, contact speed dials, and account settings.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-teal-50 border-2 border-teal-300 text-teal-900 font-bold text-base flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-teal-700" />
          <span>Your preferences have been saved successfully.</span>
        </div>
      )}

      {/* Voice & Accessibility Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <Volume2 className="w-6 h-6 text-teal-700" />
          <span>Speech & Reading Preferences</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Voice Reading Speed
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Gentle & Slow (Recommended)", "Normal Speed", "Faster"].map((speed, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`p-3 rounded-2xl border-2 text-sm font-bold text-center ${
                    idx === 0
                      ? "bg-teal-50 border-teal-600 text-teal-900"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Environment Data Mode Toggle */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <ArrowRightLeft className="w-6 h-6 text-teal-700" />
          <span>Data Environment Mode</span>
        </h2>
        <p className="text-sm text-slate-600">
          Currently operating in: <strong className="text-slate-900 uppercase">{dataMode} mode</strong>
        </p>

        <button
          onClick={() => setDataMode(dataMode === "demo" ? "authentic" : "demo")}
          className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base transition-colors flex items-center gap-2 touch-target"
        >
          <ArrowRightLeft className="w-5 h-5" />
          <span>
            {dataMode === "demo" ? "Switch to Clean Authentic Mode" : "Switch to Demo Mode"}
          </span>
        </button>
      </div>

      {/* Account Sign Out */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base flex items-center gap-2 shadow-xs transition-colors touch-target"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out of CareOS</span>
        </button>
      </div>
    </div>
  );
}
