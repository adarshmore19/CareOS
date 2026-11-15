"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCare } from "@/context/CareContext";
import {
  Activity,
  Users,
  CheckSquare,
  Pill,
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Shield,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Plus,
  AlertCircle,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function CaretakerDashboardPage() {
  const {
    elderlyProfiles,
    activePatient,
    setActivePatientId,
    events,
    careTasks,
    appointments,
    clinicalNotes,
    confirmMedication,
    updateCareTaskStatus,
    currentUser,
  } = useCare();

  const totalPatients = elderlyProfiles.length;
  const totalEvents = events.length;
  const takenEvents = events.filter((e) => e.status === "taken").length;
  const unconfirmedEvents = events.filter((e) => e.status === "unconfirmed").length;
  const pendingTasks = careTasks.filter((t) => t.status !== "completed");

  const [triageFilter, setTriageFilter] = useState<"all" | "attention" | "stable">("all");

  return (
    <div className="space-y-6">
      {/* Top Station Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              On Duty Shift Active
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-semibold">
              Nurse: {currentUser?.name || "Sister Sunita"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Clinical Operations Station
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Real-time patient triage, medication administration records (MAR), and care routine execution.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/caretaker/tasks"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task Queue ({pendingTasks.length})</span>
          </Link>
          <Link
            href="/caretaker/medications"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Open MAR Sheet</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Grid (6 metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Patients</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalPatients}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Under direct care</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Doses</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalEvents}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Total administrations</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Administered</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{takenEvents}</span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Confirmed on time</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Pending Doses</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{unconfirmedEvents}</span>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Needs verification</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Pending Tasks</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{pendingTasks.length}</span>
          <span className="text-[11px] text-indigo-600 mt-0.5 block">Routine duties</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Clinic Visits</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{appointments.length}</span>
          <span className="text-[11px] text-blue-600 mt-0.5 block">Scheduled escort</span>
        </div>
      </div>

      {/* Patient Triage Board */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Patient Triage & Clinical Roster</h2>
            <p className="text-xs text-slate-500">
              Live status overview of assigned elderly patients with quick links to clinical workspaces
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTriageFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                triageFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({totalPatients})
            </button>
            <button
              onClick={() => setTriageFilter("attention")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                triageFilter === "attention" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Attention Needed ({unconfirmedEvents > 0 ? 1 : 0})
            </button>
            <button
              onClick={() => setTriageFilter("stable")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                triageFilter === "stable" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Stable
            </button>
          </div>
        </div>

        {elderlyProfiles.length === 0 ? (
          <HonestEmptyState
            title="No Assigned Patients"
            description="You currently have no patient records assigned to your staff profile."
            icon={Users}
            badge="Staff Registry"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {elderlyProfiles.map((p) => {
              const pEvents = events.filter((e) => e.elderly_id === p.id);
              const pUnconf = pEvents.filter((e) => e.status === "unconfirmed").length;
              const pAppointments = appointments.filter((a) => a.elderly_id === p.id);
              const isAttention = pUnconf > 0;

              if (triageFilter === "attention" && !isAttention) return null;
              if (triageFilter === "stable" && isAttention) return null;

              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isAttention
                      ? "bg-amber-50/30 border-amber-300 ring-1 ring-amber-300/40"
                      : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                        {(p.name || p.full_name || "P").charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{p.name || p.full_name}</h3>
                        <p className="text-xs text-slate-500">
                          Age {p.age} • Blood Group: <strong className="text-slate-700">{p.blood_group || "O+"}</strong>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isAttention
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                      }`}
                    >
                      {isAttention ? "Attention Needed" : "Stable Routine"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-white rounded-xl border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Today's Doses</span>
                      <span className="text-slate-800 font-bold mt-0.5 block">
                        {pEvents.filter((e) => e.status === "taken").length} / {pEvents.length} Confirmed
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Next Visit</span>
                      <span className="text-slate-800 font-bold mt-0.5 block truncate">
                        {pAppointments[0] ? pAppointments[0].appointment_date : "None scheduled"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <a
                      href={`tel:${p.emergency_contact_phone || "112"}`}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.emergency_contact_phone || "Emergency Contact"}</span>
                    </a>

                    <Link
                      href={`/caretaker/patients/${p.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Section: Immediate Task Queue & Medication Administration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Care Tasks Queue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Immediate Care Tasks</h2>
            </div>
            <Link
              href="/caretaker/tasks"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>All Tasks ({careTasks.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {careTasks.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
              No tasks currently queued.
            </div>
          ) : (
            <div className="space-y-2.5">
              {careTasks.slice(0, 4).map((task) => {
                const isCompleted = task.status === "completed";
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isCompleted ? "bg-slate-50/60 border-slate-200 opacity-60" : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className={isCompleted ? "line-through text-slate-500" : ""}>{task.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.priority === "urgent"
                              ? "bg-rose-100 text-rose-800"
                              : task.priority === "high"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {task.due_time ? `Due: ${task.due_time}` : "Standard routine"}
                      </div>
                    </div>

                    <button
                      onClick={() => updateCareTaskStatus(task.id, isCompleted ? "pending" : "completed")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        isCompleted
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Mark Done"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Medication Administration Quick Record */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">Today's Dose Queue</h2>
            </div>
            <Link
              href="/caretaker/medications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Full MAR ({events.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
              No medication doses scheduled for today.
            </div>
          ) : (
            <div className="space-y-2.5">
              {events.slice(0, 4).map((evt) => {
                const isTaken = evt.status === "taken";
                return (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{evt.medication_name}</span>
                        {evt.dosage && (
                          <span className="text-[10px] text-slate-500 font-normal">({evt.dosage})</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Time: <strong>{evt.scheduled_time}</strong>
                      </div>
                    </div>

                    {isTaken ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Given
                      </span>
                    ) : (
                      <button
                        onClick={() => confirmMedication(evt.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                      >
                        Record Given
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Clinical Observations Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Clinical Notes (SOAP)</h2>
          </div>
          <Link
            href="/caretaker/clinical-notes"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>All Clinical Notes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {clinicalNotes.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
            No clinical notes recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinicalNotes.slice(0, 2).map((note) => (
              <div key={note.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{note.caretaker_name || "Caregiver Staff"}</span>
                  <span className="text-slate-400">{note.created_at?.slice(0, 10)}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{note.content || note.observation}</p>
                {note.vitals_summary && (
                  <div className="text-[11px] font-semibold text-indigo-700 pt-1">
                    Vitals: {note.vitals_summary}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
