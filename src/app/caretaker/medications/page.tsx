"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Pill,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  User,
  Shield,
  X,
  FileCheck,
} from "lucide-react";
import { VerifiedMedicationLookup } from "@/components/VerifiedMedicationLookup";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function CaretakerMedicationsPage() {
  const {
    events,
    elderlyProfiles,
    activePatient,
    confirmMedication,
    skipMedication,
    currentUser,
  } = useCare();

  const [selectedPatientId, setSelectedPatientId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "taken" | "skipped">("all");
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [skipModalEventId, setSkipModalEventId] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState("Patient refused dose");

  const filteredEvents = events.filter((evt) => {
    if (selectedPatientId !== "all" && evt.elderly_id !== selectedPatientId) {
      return false;
    }
    if (filterStatus === "pending") return evt.status === "unconfirmed";
    if (filterStatus === "taken") return evt.status === "taken";
    if (filterStatus === "skipped") return evt.status === "skipped";
    return true;
  });

  const totalDoses = events.length;
  const takenDoses = events.filter((e) => e.status === "taken").length;
  const pendingDoses = events.filter((e) => e.status === "unconfirmed").length;
  const skippedDoses = events.filter((e) => e.status === "skipped").length;

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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <Pill className="w-3.5 h-3.5 text-indigo-600" />
            <span>Medication Administration Record (MAR)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Clinical MAR Sheet
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Log dose administrations, record clinical non-administration reasons, and enforce double-check protocols.
          </p>
        </div>

        <button
          onClick={() => setShowLookupModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>NIH RxNorm Verification</span>
        </button>
      </div>

      {/* MAR KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Scheduled</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalDoses} Doses</span>
          <span className="text-xs text-slate-500 mt-1 block">Active shift roster</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Administered</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{takenDoses}</span>
          <span className="text-xs text-emerald-600 mt-1 block">Verified & recorded</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Pending / Due</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{pendingDoses}</span>
          <span className="text-xs text-amber-600 mt-1 block">Needs administration</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Non-Administered</span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">{skippedDoses}</span>
          <span className="text-xs text-rose-600 mt-1 block">Reason captured</span>
        </div>
      </div>

      {/* Filter and Patient Select Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full md:w-56 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Assigned Patients ({elderlyProfiles.length})</option>
            {elderlyProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === "pending" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Due / Pending ({pendingDoses})
          </button>
          <button
            onClick={() => setFilterStatus("taken")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === "taken" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Administered
          </button>
          <button
            onClick={() => setFilterStatus("skipped")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === "skipped" ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Skipped
          </button>
        </div>
      </div>

      {/* MAR Table / Cards */}
      {filteredEvents.length === 0 ? (
        <HonestEmptyState
          title="No MAR Entries Found"
          description="No medication administration records match your selected patient or status filter."
          icon={Pill}
          badge="Live MAR Engine"
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Administration Schedule ({filteredEvents.length} Entries)
            </h2>
            <span className="text-xs text-slate-400">Nurse in Charge: {currentUser?.name || "Sister Sunita"}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => {
              const isTaken = evt.status === "taken";
              const isSkipped = evt.status === "skipped";
              const isPending = evt.status === "unconfirmed";
              const patient = elderlyProfiles.find((p) => p.id === evt.elderly_id) || activePatient;

              return (
                <div
                  key={evt.id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isTaken
                      ? "bg-emerald-50/20"
                      : isSkipped
                      ? "bg-rose-50/30"
                      : "bg-white hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isTaken
                          ? "bg-emerald-100 text-emerald-700"
                          : isSkipped
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{evt.medication_name}</span>
                        {evt.dosage && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {evt.dosage}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {patient?.name}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span>Scheduled: <strong>{evt.scheduled_time}</strong> (Oral)</span>
                        {evt.taken_at && (
                          <span className="text-emerald-700 font-semibold">
                            • Recorded at {evt.taken_at}
                          </span>
                        )}
                        {evt.notes && <span>• Note: {evt.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {isTaken ? (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Administered</span>
                        </span>
                        <button
                          disabled
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-400 bg-slate-100 cursor-not-allowed"
                          title="Duplicate administration prevented by protocol"
                        >
                          Lock Active
                        </button>
                      </div>
                    ) : isSkipped ? (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Skipped: {evt.notes || "Recorded"}</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => confirmMedication(evt.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Record Administered</span>
                        </button>
                        <button
                          onClick={() => setSkipModalEventId(evt.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                        >
                          Non-Admin Reason
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-Administration Reason Modal */}
      {skipModalEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Non-Administration (MAR)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select mandatory clinical justification for why this dose was not administered:
            </p>
            <select
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm mb-4 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Patient refused dose">Patient refused dose</option>
              <option value="Patient asleep / resting">Patient asleep / resting</option>
              <option value="Nausea / emesis observed">Nausea / emesis observed</option>
              <option value="NPO / fasting for diagnostic lab">NPO / fasting for diagnostic lab</option>
              <option value="Physician hold ordered">Physician hold ordered</option>
              <option value="Patient off-site / hospitalized">Patient off-site / hospitalized</option>
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
                Sign & Record
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
              <h3 className="text-lg font-bold text-slate-900">NIH RxNorm Drug Verification</h3>
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
