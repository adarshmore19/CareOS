"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useCare } from "@/context/CareContext";
import Link from "next/link";
import {
  Users,
  Pill,
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  PhoneCall,
  Plus,
  ArrowRight,
  FileText,
  Shield,
  AlertCircle,
  HelpCircle,
  Edit3,
} from "lucide-react";
import { MedicationStatus, TaskPriority, TaskStatus } from "@/lib/types";

export default function PatientWorkspacePage() {
  const params = useParams();
  const patientId = params?.id as string;

  const {
    elderlyProfiles,
    events,
    confirmMedication,
    appointments,
    careTasks,
    addCareTask,
    updateCareTaskStatus,
    clinicalNotes,
    addClinicalNote,
    amendClinicalNote,
    activityLogs,
    currentUser,
  } = useCare();

  const patient = elderlyProfiles.find((p) => p.id === patientId) || elderlyProfiles[0];
  const patientEvents = events.filter((e) => e.elderly_id === patient.id);
  const patientAppointments = appointments.filter((a) => a.elderly_id === patient.id);
  const patientTasks = careTasks.filter((t) => t.elderly_id === patient.id);
  const patientNotes = clinicalNotes.filter((n) => n.elderly_id === patient.id);
  const patientLogs = activityLogs.filter((l) => l.elderly_id === patient.id);

  // Active tab in patient workspace
  const [activeTab, setActiveTab] = useState<"meds" | "notes" | "tasks" | "history">("meds");

  // New Clinical Note Form state
  const [newObservation, setNewObservation] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  // New Care Task Form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("medium");
  const [taskDueDate, setTaskDueDate] = useState("Tomorrow at 10:00 AM");

  // Amendment state
  const [amendingNoteId, setAmendingNoteId] = useState<string | null>(null);
  const [amendmentText, setAmendmentText] = useState("");

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObservation.trim()) return;

    await addClinicalNote({
      elderly_id: patient.id,
      author_id: currentUser.id,
      observation: newObservation.trim(),
      action_taken: actionTaken.trim() || undefined,
      follow_up_required: followUpRequired,
      follow_up_date: followUpDate || undefined,
    });

    setNewObservation("");
    setActionTaken("");
    setFollowUpRequired(false);
    setFollowUpDate("");
  };

  const handleAmendNote = async (noteId: string) => {
    if (!amendmentText.trim()) return;
    await amendClinicalNote(noteId, amendmentText.trim());
    setAmendingNoteId(null);
    setAmendmentText("");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    await addCareTask({
      elderly_id: patient.id,
      title: taskTitle.trim(),
      description: `Task logged by ${currentUser.full_name}`,
      priority: taskPriority,
      due_date: taskDueDate,
      status: "pending",
      assigned_to: currentUser.id,
      assigned_name: currentUser.full_name,
    });

    setTaskTitle("");
    setShowTaskModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/caretaker/dashboard" className="hover:underline">Caretaker</Link>
            <span>/</span>
            <Link href="/caretaker/patients" className="hover:underline">Patients</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{patient.full_name}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Workspace: {patient.full_name}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Authorized clinical monitoring, medication administration, and auditable care observations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${patient.emergency_contact_phone}`}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call {patient.emergency_contact_name}</span>
          </a>
        </div>
      </div>

      {/* Patient Vital Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Medical Profile</span>
            <strong className="text-slate-900 text-sm block mt-1">{patient.medical_notes}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Blood Group & Age</span>
            <strong className="text-slate-900 text-sm block mt-1">{patient.blood_group || "O+"} • 78 years</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Residential Address</span>
            <strong className="text-slate-900 text-sm block mt-1">{patient.address || "Springfield, IL"}</strong>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block uppercase font-bold text-[10px]">Daily Status</span>
            <strong className="text-teal-700 text-sm block mt-1 uppercase font-bold">Stable & Monitored</strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {[
          { key: "meds", label: `Medication Administration (${patientEvents.length})` },
          { key: "notes", label: `Clinical Observations (${patientNotes.length})` },
          { key: "tasks", label: `Care Tasks (${patientTasks.length})` },
          { key: "history", label: `Audit Log (${patientLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-colors ${
              activeTab === tab.key
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MEDICATION ADMINISTRATION */}
      {activeTab === "meds" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Medication Administration Management</h3>
              <p className="text-xs text-slate-500">Record intake verification or non-administration reasons on behalf of patient</p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
              Verified Caregiver Role
            </span>
          </div>

          <div className="space-y-4">
            {patientEvents.map((evt) => {
              const isTaken = evt.status === "taken";
              return (
                <div key={evt.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                        {evt.scheduled_time}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{evt.medication_name}</h4>
                      {isTaken && (
                        <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Administered at {evt.recorded_time}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Dosage: <strong>{evt.dosage_quantity}</strong>
                      {evt.notes && <span className="ml-2 italic">• Note: {evt.notes}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {!isTaken ? (
                      <>
                        <button
                          onClick={() => confirmMedication(evt.id, "taken", "Administered by Nurse Priya")}
                          className="px-3.5 py-2 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Record Administered</span>
                        </button>
                        <button
                          onClick={() => confirmMedication(evt.id, "skipped", "Patient requested delay/refusal")}
                          className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 transition-colors"
                        >
                          Record Skipped
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => confirmMedication(evt.id, "unconfirmed")}
                        className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-100"
                      >
                        Reset Status
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Shield className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
            <span>
              Clinical Boundary: Caregivers record administration events with timestamps and actor verification. Caretakers are not authorized to adjust physician dosages or alter prescription regimens.
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL OBSERVATION NOTES */}
      {activeTab === "notes" && (
        <div className="space-y-6">
          {/* New Note Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Log Clinical Observation</h3>
            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observation / Vitals *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record resting vitals, blood pressure, mobility observations, joint stiffness, or dietary intake..."
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Action Taken</label>
                  <input
                    type="text"
                    placeholder="e.g. Administered oral hydration, logged resting BP"
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={followUpRequired}
                      onChange={(e) => setFollowUpRequired(e.target.checked)}
                      className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700"
                    />
                    <span>Follow-up required</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Auditable Clinical Note</span>
              </button>
            </form>
          </div>

          {/* Existing Clinical Notes Feed */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Clinical History & Observations</h3>

            <div className="space-y-4">
              {patientNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-slate-200 pb-2">
                    <span className="text-slate-900 font-bold">{note.author_name || "Nurse Priya Sharma, RN"}</span>
                    <span>{new Date(note.created_at).toLocaleString()}</span>
                  </div>

                  <p className="text-slate-800 leading-relaxed font-medium">{note.observation}</p>

                  {note.action_taken && (
                    <div className="text-slate-600">
                      <strong>Action Taken:</strong> {note.action_taken}
                    </div>
                  )}

                  {note.is_amended && (
                    <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 space-y-0.5">
                      <span className="font-bold block text-[10px] uppercase tracking-wider">Clinical Amendment</span>
                      <p>{note.amendment_note}</p>
                    </div>
                  )}

                  {/* Amendment Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <span className="text-[11px] text-slate-400">
                      {note.is_amended ? "Amended" : "Original Record"}
                    </span>
                    <button
                      onClick={() => setAmendingNoteId(amendingNoteId === note.id ? null : note.id)}
                      className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{amendingNoteId === note.id ? "Cancel Amendment" : "Add Amendment"}</span>
                    </button>
                  </div>

                  {amendingNoteId === note.id && (
                    <div className="pt-2 space-y-2">
                      <input
                        type="text"
                        placeholder="Add amendment explanation..."
                        value={amendmentText}
                        onChange={(e) => setAmendmentText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                      />
                      <button
                        onClick={() => handleAmendNote(note.id)}
                        className="px-3 py-1 rounded bg-teal-700 text-white font-bold text-xs"
                      >
                        Save Amendment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CARE TASKS */}
      {activeTab === "tasks" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Assigned Care Tasks</h3>
              <p className="text-xs text-slate-500">Track and update caregiver duties for this patient</p>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-3.5 py-2 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Care Task</span>
            </button>
          </div>

          <div className="space-y-3">
            {patientTasks.map((t) => {
              const isDone = t.status === "completed";
              return (
                <div key={t.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                        {t.priority}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600">{t.description}</p>
                    <span className="text-[11px] text-slate-400 block">Due: {t.due_date}</span>
                  </div>

                  <button
                    onClick={() => updateCareTaskStatus(t.id, isDone ? "pending" : "completed")}
                    className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
                  >
                    {isDone ? "Reopen" : "Mark Completed"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900">Patient Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable log of intake records, appointments, and care actions</p>
          </div>

          <div className="space-y-3">
            {patientLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
                <Activity className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-900">{log.actor_name || "System"}</span>
                  <span className="text-slate-400 ml-2">{log.created_at}</span>
                  <p className="text-slate-700 mt-1">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Create Care Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct afternoon blood pressure check"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deadline / Due Date</label>
                <input
                  type="text"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-800"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

