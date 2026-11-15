"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Pill,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Shield,
  RotateCcw,
} from "lucide-react";
import { MedicationStatus } from "@/lib/types";

export default function MedicationsPage() {
  const {
    medications,
    events,
    confirmMedication,
    addMedication,
    currentRole,
    elderlyProfile,
  } = useCare();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prescribingDoctor, setPrescribingDoctor] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("08:00 AM");
  const [dosageQty, setDosageQty] = useState("1 tablet");

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    addMedication({
      elderly_id: elderlyProfile.id,
      name,
      dosage,
      instructions: instructions || "Take with water as directed.",
      prescribing_doctor: prescribingDoctor || "Primary Care Physician",
      start_date: new Date().toISOString().split("T")[0],
      is_active: true,
      schedules: [
        {
          id: "sch-" + Date.now(),
          medication_id: "",
          time_of_day: timeOfDay,
          dosage_quantity: dosageQty,
          days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          reminder_enabled: true,
        },
      ],
    });

    setName("");
    setDosage("");
    setInstructions("");
    setPrescribingDoctor("");
    setShowAddModal(false);
  };

  const takenCount = events.filter((e) => e.status === "taken").length;
  const pendingCount = events.filter((e) => e.status === "unconfirmed").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>MediMate • Medication Companion</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Medication Management
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Care protocol and intake records for <strong>{elderlyProfile.full_name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Quick Status Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Today's Total Doses</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{events.length} Doses</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-200 bg-teal-50/30 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-teal-700 uppercase">Confirmed Taken</div>
            <div className="text-2xl font-black text-teal-900 mt-1">{takenCount} Doses</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase">Pending Intake</div>
            <div className="text-2xl font-black text-amber-950 mt-1">{pendingCount} Doses</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Section 1: Today's Intake Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Today's Intake Schedule</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm intake or record skipped events. All updates instantly recalculate PillGuard adherence.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>

        <div className="space-y-4">
          {events.map((evt) => {
            const isTaken = evt.status === "taken";
            const isSkipped = evt.status === "skipped";

            return (
              <div
                key={evt.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isTaken
                    ? "bg-teal-50/60 border-teal-300"
                    : isSkipped
                    ? "bg-slate-50 border-slate-200 opacity-75"
                    : "bg-white border-slate-300 hover:border-teal-400"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold leading-none">{evt.scheduled_time.split(" ")[0]}</span>
                    <span className="text-[10px] text-slate-300 uppercase">{evt.scheduled_time.split(" ")[1]}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{evt.medication_name}</h4>
                      {isTaken && (
                        <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Taken at {evt.recorded_time}
                        </span>
                      )}
                      {isSkipped && (
                        <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                          Skipped
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Dosage: <strong>{evt.dosage_quantity}</strong>
                      {evt.notes && <span className="ml-2 italic text-slate-500">• {evt.notes}</span>}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {!isTaken ? (
                    <>
                      <button
                        onClick={() => confirmMedication(evt.id, "taken")}
                        className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Taken</span>
                      </button>
                      <button
                        onClick={() => confirmMedication(evt.id, "skipped", "Skipped by patient")}
                        className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => confirmMedication(evt.id, "unconfirmed")}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Active Prescriptions Registry */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Prescriptions & Regimens</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescribed medications entered by authorized family members or caretakers.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
            {medications.length} Prescriptions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <div key={med.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-lg">{med.name}</h4>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 mt-1 inline-block">
                    Strength: {med.dosage}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                <strong>Instructions:</strong> {med.instructions}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Prescriber: <strong>{med.prescribing_doctor}</strong></span>
                <span>Since: {med.start_date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg text-slate-900">Add New Medication Regimen</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMedication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dosage / Strength *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily Schedule Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions for Patient
                </label>
                <input
                  type="text"
                  placeholder="e.g. Take with morning meal and water"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescribing Physician
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Jenkins (Cardiology)"
                  value={prescribingDoctor}
                  onChange={(e) => setPrescribingDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-teal-50 rounded-xl text-xs text-teal-800 flex items-start gap-2">
                <Shield className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>
                  CareOS records the prescribed dosage as entered by the authorized user. CareOS never generates or modifies medical prescriptions autonomously.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 shadow-sm"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
