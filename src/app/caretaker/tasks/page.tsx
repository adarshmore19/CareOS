"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  CheckSquare,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  User,
  X,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function CaretakerTasksPage() {
  const {
    careTasks,
    elderlyProfiles,
    activePatient,
    addCareTask,
    updateCareTaskStatus,
  } = useCare();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "urgent" | "completed">("all");

  // Form State
  const [patientId, setPatientId] = useState(activePatient?.id || elderlyProfiles[0]?.id || "");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low">("medium");
  const [dueTime, setDueTime] = useState("11:00 AM");
  const [notes, setNotes] = useState("");

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !patientId) return;

    await addCareTask({
      elderly_id: patientId,
      title,
      description: notes || "Care routine task",
      priority,
      status: "pending",
      due_time: dueTime,
      notes: notes || undefined,
    });

    setTitle("");
    setNotes("");
    setShowAddModal(false);
  };

  const filteredTasks = careTasks.filter((task) => {
    if (filter === "pending") return task.status !== "completed";
    if (filter === "completed") return task.status === "completed";
    if (filter === "urgent") return task.priority === "urgent" || task.priority === "high";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Care Operations Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Care Tasks & Routine Duties
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Time-ordered clinical tasks, vitals checks, mobility assistance, and daily care protocols.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Care Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Tasks ({careTasks.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === "pending" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Pending ({careTasks.filter((t) => t.status !== "completed").length})
        </button>
        <button
          onClick={() => setFilter("urgent")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === "urgent" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Urgent / High
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === "completed" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Tasks Queue List */}
      {filteredTasks.length === 0 ? (
        <HonestEmptyState
          title="No Care Tasks Queued"
          description="There are currently no tasks matching this filter. Click 'New Care Task' to assign routine duties."
          icon={CheckSquare}
          badge="Live Task Engine"
        />
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === "completed";
            const patient = elderlyProfiles.find((p) => p.id === task.elderly_id) || activePatient;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isCompleted
                    ? "bg-slate-50/60 border-slate-200 opacity-65"
                    : task.priority === "urgent"
                    ? "bg-rose-50/40 border-rose-200"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        isCompleted ? "line-through text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Patient: <strong className="text-slate-700">{patient?.name || "Ram Sharma"}</strong>
                    </span>
                    {task.due_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Due: <strong>{task.due_time}</strong>
                      </span>
                    )}
                    {task.notes && <span>• Note: {task.notes}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => updateCareTaskStatus(task.id, isCompleted ? "pending" : "completed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isCompleted
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Reopen Task</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Complete Task</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create Care Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assign to Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {elderlyProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.full_name} (Age {p.age || 75})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title / Action</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Blood Pressure check, Hydration check"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="urgent">Urgent (Immediate)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low Routine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Protocol Notes / Details</label>
                <textarea
                  rows={2}
                  placeholder="Record resting seated blood pressure. Notify doctor if systolic > 140."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
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
                  Queue Care Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
