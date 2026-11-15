"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Clock,
  Activity,
  Pill,
  Calendar,
  FileText,
  UserCheck,
  Shield,
  Filter,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function FamilyActivityPage() {
  const { activityLogs, activePatient } = useCare();
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredLogs = activityLogs.filter((log) => {
    if (activePatient && log.elderly_id && log.elderly_id !== activePatient.id) {
      return false;
    }
    const act = (log.action_type || log.action || "").toLowerCase();
    const desc = (log.description || log.details || "").toLowerCase();
    if (filterCategory === "all") return true;
    return act.includes(filterCategory.toLowerCase()) || desc.includes(filterCategory.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Activity & Care Log
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Immutable, chronological timeline of all care actions, medication verifications, and clinical entries.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          {filteredLogs.length} Events Logged
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "medication", "dose", "appointment", "note", "invitation"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 ${
              filterCategory === cat
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat === "all" ? "All Events" : cat}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      {filteredLogs.length === 0 ? (
        <HonestEmptyState
          title="No Care Activity Recorded"
          description="Activity events are recorded automatically as medications are confirmed, appointments scheduled, and clinical notes logged."
          icon={Clock}
          badge="Live Event Stream"
        />
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
            {filteredLogs.map((log) => {
              const act = log.action_type || log.action || "Care Action";
              const desc = log.description || log.details || "Care routine event logged.";
              const isMed = act.includes("medication") || act.includes("dose");
              const isApt = act.includes("appointment");
              const isNote = act.includes("note");

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      isMed
                        ? "bg-teal-500"
                        : isApt
                        ? "bg-blue-500"
                        : isNote
                        ? "bg-indigo-500"
                        : "bg-slate-500"
                    }`}
                  />

                  <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5 transition-colors group-hover:bg-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="font-bold text-slate-900 uppercase tracking-wide">
                        {act.replace(/_/g, " ")}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {log.created_at ? new Date(log.created_at).toLocaleString() : "Just now"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{desc}</p>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source: <strong className="text-slate-700">{log.actor_name || "Authorized Caregiver"}</strong></span>
                      {log.elderly_id && (
                        <span>Patient ID: <code className="text-[10px] text-slate-600">{log.elderly_id.slice(0, 8)}</code></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
