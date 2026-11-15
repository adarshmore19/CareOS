"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  FileText,
  Plus,
  Clock,
  UserCheck,
  Tag,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  Edit3,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function CaretakerClinicalNotesPage() {
  const {
    clinicalNotes,
    elderlyProfiles,
    activePatient,
    addClinicalNote,
    currentUser,
  } = useCare();

  const [selectedPatientId, setSelectedPatientId] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // SOAP Form State
  const [patientId, setPatientId] = useState(activePatient?.id || elderlyProfiles[0]?.id || "");
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [vitalsSummary, setVitalsSummary] = useState("BP 122/80, Pulse 76, SpO2 98%");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Vitals Normal"]);

  // Amendment state
  const [amendModalNoteId, setAmendModalNoteId] = useState<string | null>(null);
  const [amendmentText, setAmendmentText] = useState("");

  const quickTagOptions = [
    "Vitals Normal",
    "Appetite Good",
    "Appetite Low",
    "Mild Pain",
    "Mood Cheerful",
    "Mood Agitated",
    "Fall Risk Caution",
    "Mobility Improved",
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSaveSOAP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    const fullContent = `[SOAP] S: ${subjective || "Patient reports feeling well."} | O: ${objective || "Alert and responsive."} | A: ${assessment || "Condition stable."} | P: ${plan || "Continue active care routine."} | Tags: ${selectedTags.join(", ")}`;

    await addClinicalNote({
      elderly_id: patientId,
      caretaker_name: currentUser?.name || "Sister Sunita",
      content: fullContent,
      vitals_summary: vitalsSummary || undefined,
    });

    setSubjective("");
    setObjective("");
    setAssessment("");
    setPlan("");
    setShowAddModal(false);
  };

  const handleAmendNote = async () => {
    if (!amendModalNoteId || !amendmentText) return;
    // In our audit trail, we append an addendum as a new clinical note referencing the original
    const original = clinicalNotes.find((n) => n.id === amendModalNoteId);
    if (original) {
      await addClinicalNote({
        elderly_id: original.elderly_id,
        caretaker_name: `${currentUser?.name || "Sister Sunita"} (Addendum)`,
        content: `[AMENDMENT to Note #${amendModalNoteId.slice(0, 8)}]: ${amendmentText}`,
        vitals_summary: original.vitals_summary,
      });
    }
    setAmendModalNoteId(null);
    setAmendmentText("");
  };

  const filteredNotes = clinicalNotes.filter((n) => {
    if (selectedPatientId !== "all" && n.elderly_id !== selectedPatientId) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Auditable Clinical Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Clinical Notes & Observations
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Structured SOAP notes, vital readings, behavioural observations, and tamper-resistant addenda.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New SOAP Note</span>
        </button>
      </div>

      {/* Patient Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600">Filter by Patient:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Patients ({elderlyProfiles.length})</option>
            {elderlyProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.full_name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">
          {filteredNotes.length} Documented Entry/Entries
        </span>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <HonestEmptyState
          title="No Clinical Notes Recorded"
          description="There are currently no clinical observations logged for this filter."
          icon={FileText}
          badge="Live SOAP Engine"
        />
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const patient = elderlyProfiles.find((p) => p.id === note.elderly_id) || activePatient;
            const isAddendum = (note.content || note.observation || "").startsWith("[AMENDMENT");

            return (
              <div
                key={note.id}
                className={`bg-white rounded-2xl p-6 border shadow-xs space-y-3 transition-colors ${
                  isAddendum ? "border-amber-200 bg-amber-50/20" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{note.caretaker_name || "Sister Sunita"}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {patient?.name}
                        </span>
                        {isAddendum && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            ADDENDUM
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {note.created_at ? new Date(note.created_at).toLocaleString() : "Recent"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setAmendModalNoteId(note.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Add Addendum</span>
                  </button>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {note.content || note.observation}
                </p>

                {note.vitals_summary && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                      Vitals: {note.vitals_summary}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {note.id.slice(0, 8)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Addendum Modal */}
      {amendModalNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Append Addendum to Record</h3>
            <p className="text-xs text-slate-500 mb-4">
              Clinical entries are immutable. Your addendum will be linked with timestamp and staff signature:
            </p>
            <textarea
              rows={3}
              required
              placeholder="e.g. Follow-up: Patient rested well for 2 hours post-administration, appetite fully restored."
              value={amendmentText}
              onChange={(e) => setAmendmentText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm mb-4 focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAmendModalNoteId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAmendNote}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Append Addendum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New SOAP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">New Clinical Note (SOAP Protocol)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSOAP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {elderlyProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  S - Subjective (Patient complaints & feelings)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Patient reports mild morning fatigue, denied chest pain."
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  O - Objective (Observations & readings)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ambulatory without assistance, skin warm and dry."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">A - Assessment</label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension stable"
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">P - Plan</label>
                  <input
                    type="text"
                    placeholder="e.g. Monitor evening vitals"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recorded Vitals</label>
                <input
                  type="text"
                  value={vitalsSummary}
                  onChange={(e) => setVitalsSummary(e.target.value)}
                  placeholder="BP 120/80, SpO2 98%, Pulse 72"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Clinical Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {quickTagOptions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Sign & Append SOAP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
