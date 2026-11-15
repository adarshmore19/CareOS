"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  HeartHandshake,
  UserCheck,
  Calendar,
  Pill,
  Clock,
  PhoneCall,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function CaretakerPage() {
  const {
    elderlyProfile,
    careTasks,
    updateCareTaskStatus,
    appointments,
    adherence,
    events,
    currentUser,
  } = useCare();

  const [clinicalNote, setClinicalNote] = useState("");
  const [notesList, setNotesList] = useState<string[]>([
    "Nov 14: Resting BP measured at 124/82 mmHg. Pulse 72 bpm. Patient is in cheerful spirits.",
    "Nov 12: Accompanied patient on 20-min garden walk. Verified morning Metformin intake.",
  ]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNote.trim()) return;
    const nowStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setNotesList([`${nowStr}: ${clinicalNote.trim()}`, ...notesList]);
    setClinicalNote("");
  };

  const assignedTasks = careTasks.filter((t) => t.assigned_name?.includes("Priya") || !t.assigned_to);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
            <span>Caregiver Station • Professional Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Nurse Priya Sharma, RN
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Clinical management & visit support for primary patient: <strong>{elderlyProfile.full_name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${elderlyProfile.emergency_contact_phone}`}
            className="px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Family Contact (David)</span>
          </a>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded">
              Primary Patient
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">{elderlyProfile.full_name}</h3>
            <p className="text-xs text-slate-600 mt-1">{elderlyProfile.medical_notes}</p>
            <div className="mt-3 text-xs text-slate-500">
              Address: <strong>{elderlyProfile.address}</strong>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Adherence Score</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{adherence.overall_percentage}%</div>
            <span className="text-xs text-emerald-700 font-semibold">{adherence.taken_count} taken today</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Assigned Tasks</span>
            <div className="text-3xl font-black text-purple-900 mt-1">{assignedTasks.length}</div>
            <span className="text-xs text-purple-700 font-semibold">Active duties</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Assigned Tasks & Clinical Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Assigned Care Duties */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4">Assigned Care Tasks</h3>
          <div className="space-y-3">
            {assignedTasks.map((t) => {
              const isDone = t.status === "completed";
              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                    isDone ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                      {t.priority}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-1">{t.title}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{t.description}</p>
                    <span className="text-[11px] text-slate-400 mt-1 block">Due: {t.due_date}</span>
                  </div>

                  <button
                    onClick={() => updateCareTaskStatus(t.id, isDone ? "pending" : "completed")}
                    className="px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 font-bold text-xs hover:bg-purple-100"
                  >
                    {isDone ? "Reopen" : "Complete"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Clinical Observation Notes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Caregiver Observation Notes</h3>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              placeholder="Record vitals, blood pressure, mobility observations, or patient requests..."
              value={clinicalNote}
              onChange={(e) => setClinicalNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Clinical Note</span>
            </button>
          </form>

          <div className="space-y-2.5 pt-2">
            {notesList.map((n, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
