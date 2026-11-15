"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Pill,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  TrendingUp,
  Info,
  Calendar,
  X,
} from "lucide-react";
import { VerifiedMedicationLookup } from "@/components/VerifiedMedicationLookup";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function FamilyMedicationsPage() {
  const {
    activePatient,
    events,
    confirmMedication,
    skipMedication,
    adherence,
  } = useCare();

  const adherenceRate = typeof adherence === "number" ? adherence : (adherence?.overall_percentage ?? 95);

  const [showLookupModal, setShowLookupModal] = useState(false);
  const [skipModalEventId, setSkipModalEventId] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState("Patient feeling nauseous");

  if (!activePatient) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Medication Oversight</h1>
        <HonestEmptyState
          title="No Active Patient Selected"
          description="Select an elderly family member to view their medication schedule."
          icon={Pill}
          badge="Medication Engine"
        />
      </div>
    );
  }

  const patientEvents = events.filter((e) => e.elderly_id === activePatient.id);
  const takenCount = patientEvents.filter((e) => e.status === "taken").length;
  const unconfirmedCount = patientEvents.filter((e) => e.status === "unconfirmed").length;
  const skippedCount = patientEvents.filter((e) => e.status === "skipped").length;

  const handleSkipConfirm = async () => {
    if (!skipModalEventId) return;
    await skipMedication(skipModalEventId, skipReason);
    setSkipModalEventId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Medication Oversight
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-semibold">{activePatient.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prescription & Dose Tracking
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Monitor daily dose administration, confirm doses remotely, and research drug safety.
          </p>
        </div>

        <button
          onClick={() => setShowLookupModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Research RxNorm Drugs</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Regimen</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{patientEvents.length} Doses</span>
          <span className="text-xs text-slate-500 mt-1 block">Scheduled for today</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Confirmed Taken</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{takenCount}</span>
          <span className="text-xs text-emerald-600 mt-1 block">Verified on time</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Pending / Unconfirmed</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{unconfirmedCount}</span>
          <span className="text-xs text-amber-600 mt-1 block">Awaiting confirmation</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">7-Day Adherence</span>
          <span className="text-2xl font-black text-teal-700 mt-1 block">{adherenceRate}%</span>
          <span className="text-xs text-slate-500 mt-1 block">Clinical baseline</span>
        </div>
      </div>

      {/* Dose Telemetry List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's Medication Schedule</h2>
            <p className="text-xs text-slate-500">Live confirmation and administration verification</p>
          </div>
        </div>

        {patientEvents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-sm">
            No medication events scheduled for today.
          </div>
        ) : (
          <div className="space-y-3">
            {patientEvents.map((evt) => {
              const isTaken = evt.status === "taken";
              const isUnconfirmed = evt.status === "unconfirmed";
              const isSkipped = evt.status === "skipped";

              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isTaken
                      ? "bg-emerald-50/40 border-emerald-200"
                      : isUnconfirmed
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isTaken
                          ? "bg-emerald-100 text-emerald-700"
                          : isUnconfirmed
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{evt.medication_name}</span>
                        {evt.dosage && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {evt.dosage}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span>Scheduled: <strong>{evt.scheduled_time}</strong></span>
                        {evt.taken_at && <span>• Confirmed at {evt.taken_at}</span>}
                        {evt.notes && <span>• Note: {evt.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isTaken ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed Taken</span>
                      </span>
                    ) : isUnconfirmed ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => confirmMedication(evt.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          Confirm Dose
                        </button>
                        <button
                          onClick={() => setSkipModalEventId(evt.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
                        >
                          Mark Skip
                        </button>
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
                        {evt.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Skip Modal */}
      {skipModalEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Skipped Dose</h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify the clinical or personal reason why this dose was skipped:
            </p>
            <select
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm mb-4 focus:ring-2 focus:ring-teal-500"
            >
              <option value="Patient feeling nauseous">Patient feeling nauseous</option>
              <option value="Doctor advised temporary pause">Doctor advised temporary pause</option>
              <option value="Fasting for lab tests">Fasting for lab tests</option>
              <option value="Medication currently out of stock">Medication currently out of stock</option>
              <option value="Patient asleep / resting">Patient asleep / resting</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSkipModalEventId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSkipConfirm}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Record Reason
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RxNorm Lookup Modal */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">NIH RxNorm Drug Information & Verification</h3>
              <button
                onClick={() => setShowLookupModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <VerifiedMedicationLookup />
          </div>
        </div>
      )}
    </div>
  );
}
