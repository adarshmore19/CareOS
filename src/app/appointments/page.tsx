"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import { TaskPriority, TaskStatus } from "@/lib/types";

export default function AppointmentsPage() {
  const {
    appointments,
    addAppointment,
    careTasks,
    addCareTask,
    updateCareTaskStatus,
    elderlyProfile,
  } = useCare();

  const [showAptModal, setShowAptModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Appointment form state
  const [doctorName, setDoctorName] = useState("");
  const [clinic, setClinic] = useState("");
  const [aptTime, setAptTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [caretakerName, setCaretakerName] = useState("Nurse Priya Sharma");

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("medium");
  const [taskDueDate, setTaskDueDate] = useState("Tomorrow at 10:00 AM");

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !aptTime) return;

    addAppointment({
      elderly_id: elderlyProfile.id,
      doctor_name: doctorName,
      clinic_or_hospital: clinic || "City Health Clinic",
      appointment_time: aptTime,
      purpose: purpose || "General Consultation",
      status: "upcoming",
      caretaker_name: caretakerName,
    });

    setDoctorName("");
    setClinic("");
    setAptTime("");
    setPurpose("");
    setShowAptModal(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    addCareTask({
      elderly_id: elderlyProfile.id,
      title: taskTitle,
      description: taskDesc || "Care task for patient support",
      priority: taskPriority,
      due_date: taskDueDate,
      status: "pending",
      assigned_name: "Nurse Priya Sharma",
    });

    setTaskTitle("");
    setTaskDesc("");
    setShowTaskModal(false);
  };

  const upcomingApts = appointments.filter((a) => a.status === "upcoming");
  const pastApts = appointments.filter((a) => a.status !== "upcoming");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>CareSync • Healthcare Coordination</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointments & Care Logistics
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Coordinating clinic visits and caregiver assignments for <strong>{elderlyProfile.full_name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition-colors shadow-xs flex items-center gap-2"
          >
            <ListTodo className="w-4 h-4 text-slate-600" />
            <span>Add Care Task</span>
          </button>

          <button
            onClick={() => setShowAptModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Appointments on Left, Care Tasks on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Doctor Visits */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Upcoming Medical Appointments ({upcomingApts.length})
            </h2>

            <div className="space-y-4">
              {upcomingApts.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl border-2 border-indigo-100 bg-indigo-50/30 hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {apt.appointment_time}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-slate-900">{apt.doctor_name}</h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {apt.clinic_or_hospital}
                      </span>
                      <span>•</span>
                      <span>Purpose: <strong className="text-slate-800">{apt.purpose}</strong></span>
                    </div>

                    {apt.caretaker_name && (
                      <div className="text-xs text-indigo-800 font-medium flex items-center gap-1 pt-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        Assigned Caregiver Escort: <strong>{apt.caretaker_name}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Appointments */}
          {pastApts.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Past Visits & Records</h3>
              <div className="space-y-3">
                {pastApts.map((apt) => (
                  <div key={apt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{apt.doctor_name}</h5>
                      <p className="text-xs text-slate-500">{apt.clinic_or_hospital} • {apt.appointment_time}</p>
                      {apt.notes && <p className="text-xs text-slate-600 mt-1 italic">{apt.notes}</p>}
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Care Tasks Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Care Tasks</h3>
                <p className="text-xs text-slate-500">Checklist for family & nurse</p>
              </div>
              <ListTodo className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="space-y-3">
              {careTasks.map((t) => {
                const isDone = t.status === "completed";
                const priorityBadge =
                  t.priority === "urgent"
                    ? "bg-rose-100 text-rose-800 border-rose-200"
                    : t.priority === "high"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDone
                        ? "bg-slate-50 border-slate-200 opacity-60 line-through"
                        : "bg-white border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityBadge}`}>
                        {t.priority}
                      </span>
                      <button
                        onClick={() =>
                          updateCareTaskStatus(t.id, isDone ? "pending" : "completed")
                        }
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        {isDone ? "Reopen" : "Mark Done"}
                      </button>
                    </div>

                    <h5 className="font-bold text-slate-900 text-sm mt-2">{t.title}</h5>
                    <p className="text-xs text-slate-600 mt-1">{t.description}</p>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Due: {t.due_date} • {t.assigned_name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      {showAptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-lg text-slate-900">Schedule Medical Appointment</h3>
              <button onClick={() => setShowAptModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins (Cardiology)"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinic / Hospital *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Heart & Vascular Center"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date and Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nov 25, 2026 at 11:00 AM"
                  value={aptTime}
                  onChange={(e) => setAptTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Routine 6-month blood pressure review"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAptModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-lg text-slate-900">Add Care Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pick up medication refill"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Details for caregiver or family"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-sm"
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
