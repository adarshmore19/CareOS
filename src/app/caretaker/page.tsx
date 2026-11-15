"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import Link from "next/link";
import {
  HeartHandshake,
  Calendar,
  Pill,
  Clock,
  PhoneCall,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Plus,
  Users,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export default function CaretakerDashboard() {
  const {
    currentUser,
    elderlyProfiles,
    activePatient,
    setActivePatientId,
    careTasks,
    updateCareTaskStatus,
    addCareTask,
    events,
    clinicalNotes,
    addClinicalNote,
    amendClinicalNote,
    adherence,
  } = useCare();

  const [newNoteObservation, setNewNoteObservation] = useState("");
  const [newNoteAction, setNewNoteAction] = useState("");
  const [newNoteFollowUp, setNewNoteFollowUp] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const [amendingNoteId, setAmendingNoteId] = useState<string | null>(null);
  const [amendmentText, setAmendmentText] = useState("");

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteObservation.trim()) return;

    setIsSubmittingNote(true);
    try {
      await addClinicalNote({
        elderly_id: activePatient.id,
        author_id: currentUser.id,
        author_name: currentUser.full_name || "Nurse Priya Sharma, RN",
        observation: newNoteObservation.trim(),
        action_taken: newNoteAction.trim() || "Recorded in clinical daily rounds.",
        follow_up_required: newNoteFollowUp,
      });
      setNewNoteObservation("");
      setNewNoteAction("");
      setNewNoteFollowUp(false);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleAmend = async (noteId: string) => {
    if (!amendmentText.trim()) return;
    await amendClinicalNote(noteId, amendmentText.trim());
    setAmendingNoteId(null);
    setAmendmentText("");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    await addCareTask({
      elderly_id: activePatient.id,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      priority: taskPriority,
      due_date: new Date().toISOString().split("T")[0],
      assigned_name: currentUser.full_name || "Nurse Priya Sharma",
      status: "pending",
    });

    setTaskTitle("");
    setTaskDesc("");
    setIsAddingTask(false);
  };

  const patientNotes = clinicalNotes.filter((n) => n.elderly_id === activePatient.id);
  const patientTasks = careTasks.filter((t) => t.elderly_id === activePatient.id || !t.elderly_id);
  const pendingDoses = events.filter((e) => e.elderly_id === activePatient.id && e.status === "unconfirmed");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
            <span>Clinical Operations Center • Caregiver Station</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentUser.full_name || "Nurse Priya Sharma, RN"}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Licensed Clinical Caregiver • Active Shift • Assigned to {elderlyProfiles.length} Patients
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/caretaker/patients"
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>View All Patients ({elderlyProfiles.length})</span>
          </Link>

          <a
            href={`tel:${activePatient.emergency_contact_phone}`}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency: {activePatient.emergency_contact_name.split(" ")[0]}</span>
          </a>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Patients</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{elderlyProfiles.length}</div>
          <span className="text-xs text-slate-500">Under active clinical care</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Doses Today</span>
          <div className="text-2xl font-black text-teal-700 mt-2">{pendingDoses.length}</div>
          <span className="text-xs text-slate-500">Scheduled for confirmation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Care Tasks</span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {patientTasks.filter((t) => t.status !== "completed").length}
          </div>
          <span className="text-xs text-slate-500">Duties awaiting completion</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Adherence Score</span>
          <div className="text-2xl font-black text-teal-700 mt-2">{adherence.overall_percentage}%</div>
          <span className="text-xs text-slate-500">Current patient index</span>
        </div>
      </div>

      {/* Patient Selector Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Select Patient Context</h2>
          <Link
            href={`/caretaker/patients/${activePatient.id}`}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            <span>Open Full Clinical Workspace for {activePatient.full_name}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {elderlyProfiles.map((p) => {
            const isSelected = p.id === activePatient.id;
            return (
              <div
                key={p.id}
                onClick={() => setActivePatientId(p.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/20 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      DOB: {p.date_of_birth} • Blood: {p.blood_group}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{p.full_name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{p.medical_notes}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Emergency: <span className="font-semibold text-slate-800">{p.emergency_contact_name}</span> ({p.emergency_contact_phone})
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      isSelected ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-700"
                    }`}>
                      {isSelected ? "Active Focus" : "Select"}
                    </span>
                    <Link
                      href={`/caretaker/patients/${p.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <span>Workspace</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Clinical Duties & Observation Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Assigned Care Duties */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Care Duties & Tasks</h3>
              <p className="text-xs text-slate-500">For {activePatient.full_name}</p>
            </div>
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingTask ? "Cancel" : "Add Task"}</span>
            </button>
          </div>

          {isAddingTask && (
            <form onSubmit={handleCreateTask} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g., Measure blood glucose before lunch"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Details</label>
                  <input
                    type="text"
                    placeholder="Instructions..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800"
              >
                Save Care Task
              </button>
            </form>
          )}

          <div className="space-y-3">
            {patientTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No care tasks assigned for this patient.</p>
            ) : (
              patientTasks.map((t) => {
                const isDone = t.status === "completed";
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                      isDone ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          t.priority === "high"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-slate-100 text-slate-800"
                        }`}>
                          {t.priority}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                            Completed
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{t.title}</h4>
                      {t.description && <p className="text-xs text-slate-600 mt-0.5">{t.description}</p>}
                      <span className="text-[11px] text-slate-400 mt-1 block">Due: {t.due_date}</span>
                    </div>

                    <button
                      onClick={() => updateCareTaskStatus(t.id, isDone ? "pending" : "completed")}
                      className="px-3 py-1.5 rounded-md border border-slate-300 bg-slate-50 text-slate-800 font-semibold text-xs hover:bg-slate-100"
                    >
                      {isDone ? "Reopen" : "Complete"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Clinical Observation Notes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">Clinical Observation Notes</h3>
            <p className="text-xs text-slate-500">Immutable clinical audit records with auditable amendments</p>
          </div>

          <form onSubmit={handleCreateNote} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Observation</label>
              <textarea
                rows={2}
                placeholder="Record vitals, resting BP, pulse, mobility, mood, or clinical findings..."
                value={newNoteObservation}
                onChange={(e) => setNewNoteObservation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Action Taken / Intervention</label>
              <input
                type="text"
                placeholder="e.g., Verified Lisinopril dose, provided hydration, assisted ambulation"
                value={newNoteAction}
                onChange={(e) => setNewNoteAction(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newNoteFollowUp}
                  onChange={(e) => setNewNoteFollowUp(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                />
                <span>Flag for Physician Follow-Up</span>
              </label>

              <button
                type="submit"
                disabled={isSubmittingNote}
                className="px-4 py-2 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isSubmittingNote ? "Logging..." : "Log Note"}</span>
              </button>
            </div>
          </form>

          {/* Notes Feed */}
          <div className="space-y-3 pt-2">
            {patientNotes.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No observation notes logged for this patient yet.</p>
            ) : (
              patientNotes.map((note) => (
                <div key={note.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-800">{note.author_name}</span>
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>

                  <p className="text-slate-800 font-medium leading-relaxed">{note.observation}</p>

                  {note.action_taken && (
                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                      <strong>Intervention:</strong> {note.action_taken}
                    </div>
                  )}

                  {note.follow_up_required && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3 text-rose-700" />
                      <span>Physician Review Flagged</span>
                    </div>
                  )}

                  {note.is_amended && note.amendment_note && (
                    <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                      <strong>Audited Amendment:</strong> {note.amendment_note}
                    </div>
                  )}

                  {amendingNoteId === note.id ? (
                    <div className="mt-2 space-y-2 pt-2 border-t border-slate-200">
                      <textarea
                        rows={2}
                        placeholder="State clinical clarification or amendment reason..."
                        value={amendmentText}
                        onChange={(e) => setAmendmentText(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAmendingNoteId(null)}
                          className="px-2 py-1 text-slate-600 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAmend(note.id)}
                          className="px-3 py-1 rounded bg-teal-700 text-white font-bold text-xs"
                        >
                          Save Amendment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAmendingNoteId(note.id)}
                      className="text-[11px] text-teal-700 hover:underline font-semibold block"
                    >
                      + Amend Note
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
