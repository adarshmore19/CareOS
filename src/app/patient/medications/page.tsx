"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Pill,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { VerifiedMedicationLookup } from "@/components/VerifiedMedicationLookup";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function PatientMedicationsPage() {
  const {
    activePatient,
    events,
    confirmMedication,
    medications,
    addMedication,
  } = useCare();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("08:00 AM");

  const patientEvents = events.filter((e) => e.elderly_id === activePatient.id || !e.elderly_id);
  const patientMeds = medications.filter((m) => m.elderly_id === activePatient.id || !m.elderly_id);

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    addMedication({
      elderly_id: activePatient.id,
      name,
      dosage,
      instructions: instructions || "Take with water as directed.",
      prescribing_doctor: "Dr. Sarah Jenkins",
      start_date: new Date().toISOString().split("T")[0],
      is_active: true,
      schedules: [
        {
          id: "sch-" + Date.now(),
          medication_id: "",
          time_of_day: timeOfDay,
          dosage_quantity: "1 dose",
          days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          reminder_enabled: true,
        },
      ],
    });

    setName("");
    setDosage("");
    setInstructions("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
            Personal Medicine Schedule
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
            My Daily Medications
          </h1>
          <p className="text-lg text-slate-700 font-medium mt-1">
            Tap the large green button as soon as you have taken your pills.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base flex items-center gap-2 shadow-xs transition-colors touch-target self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Medication Checklist */}
      <div className="space-y-4">
        {patientEvents.length === 0 ? (
          <HonestEmptyState
            title="No Medications Scheduled"
            description="You do not have any active medication doses scheduled. You can add a verified prescription above."
            icon={Pill}
            badge="Authentic State • 0 Scheduled Doses"
          />
        ) : (
          patientEvents.map((evt) => {
            const isTaken = evt.status === "taken";
            const isSkipped = evt.status === "skipped";

            return (
              <div
                key={evt.id}
                className={`rounded-3xl p-6 sm:p-8 border-3 transition-all ${
                  isTaken
                    ? "bg-teal-50/70 border-teal-500 shadow-xs"
                    : isSkipped
                    ? "bg-slate-100 border-slate-300 opacity-75"
                    : "bg-white border-slate-400 shadow-md"
                }`}
                style={{ borderWidth: "3px" }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black px-3 py-1 rounded-lg bg-slate-900 text-white">
                        {evt.scheduled_time}
                      </span>
                      {isTaken && (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-teal-900 bg-teal-200 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-teal-800" /> Taken at {evt.recorded_time}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                      {evt.medication_name}
                    </h3>
                    <p className="text-base text-slate-700 font-medium">
                      Dose: <strong>{evt.dosage_quantity}</strong>
                      {evt.notes && <span> • {evt.notes}</span>}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {!isTaken ? (
                      <>
                        <button
                          onClick={() => confirmMedication(evt.id, "taken", "Confirmed by patient")}
                          className="px-8 py-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xl shadow-md transition-all flex items-center justify-center gap-3 touch-target"
                        >
                          <CheckCircle2 className="w-7 h-7" />
                          <span>I Took This</span>
                        </button>

                        <button
                          onClick={() => confirmMedication(evt.id, "skipped", "Skipped by patient")}
                          className="px-5 py-5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-base transition-all touch-target"
                        >
                          Skip
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => confirmMedication(evt.id, "unconfirmed")}
                        className="px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Undo / Mark Unconfirmed</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Active Prescription Regimens List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          My Prescribed Medicines ({patientMeds.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patientMeds.map((med) => (
            <div key={med.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-black text-slate-900">{med.name}</h4>
                  <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                    Strength: {med.dosage}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-700">{med.instructions}</p>
              <div className="text-xs text-slate-500 pt-1">
                Prescribed by: <strong>{med.prescribing_doctor}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Medication Modal with NIH RxNorm Verification */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-xl text-slate-900">Add New Medication</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <VerifiedMedicationLookup
              onSelectDrug={(drug) => {
                setName(drug.name);
                setInstructions(`Verified RxNorm monograph (RxCUI: ${drug.rxcui}).`);
              }}
            />

            <form onSubmit={handleAddMed} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage / Strength *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Schedule Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Take with morning meal"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 shadow-sm"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

