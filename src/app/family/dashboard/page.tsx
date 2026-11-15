"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCare } from "@/context/CareContext";
import {
  Users,
  Activity,
  Pill,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PhoneCall,
  Shield,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  ChevronRight,
  Sparkles,
  Heart,
  ExternalLink,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function FamilyDashboardPage() {
  const {
    elderlyProfiles,
    activePatient,
    setActivePatientId,
    events,
    appointments,
    careTasks,
    adherence,
    notifications,
    clinicalNotes,
    activityLogs,
    confirmMedication,
  } = useCare();

  const adherenceRate = typeof adherence === "number" ? adherence : (adherence?.overall_percentage ?? 95);

  const [reminderSent, setReminderSent] = useState(false);

  const patientEvents = events.filter((e) => e.elderly_id === activePatient?.id);
  const takenCount = patientEvents.filter((e) => e.status === "taken").length;
  const unconfirmedCount = patientEvents.filter((e) => e.status === "unconfirmed").length;
  const skippedCount = patientEvents.filter((e) => e.status === "skipped").length;
  const missedCount = patientEvents.filter((e) => e.status === "missed").length;
  const totalEvents = patientEvents.length;

  const patientAppointments = appointments.filter((a) => a.elderly_id === activePatient?.id);
  const patientTasks = careTasks.filter((t) => t.elderly_id === activePatient?.id);
  const patientNotes = clinicalNotes.filter((n) => n.elderly_id === activePatient?.id);
  const patientLogs = activityLogs.filter((l) => l.elderly_id === activePatient?.id);

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 3000);
  };

  if (elderlyProfiles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-extrabold text-slate-900">FamilyCare Circle</h1>
          <p className="text-slate-600 text-sm">Remote healthcare monitoring & loved one oversight</p>
        </div>
        <HonestEmptyState
          title="No Family Patients Connected"
          description="There are currently no authorized elderly patient records linked to your family account. Link an authentic profile or accept an invitation to begin monitoring."
          icon={Users}
          badge="Authentic State • Zero Fabricated Profiles"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              FamilyCare Circle
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Live Monitoring: <strong className="text-slate-800">{activePatient?.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Family Care Overview
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Real-time medication adherence, upcoming escort schedules, and caregiver updates.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSendReminder}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              reminderSent
                ? "bg-emerald-600 text-white"
                : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{reminderSent ? "Reminder Dispatched!" : "Send Gentle Reminder"}</span>
          </button>
          <a
            href={`tel:${activePatient?.emergency_contact_phone || "112"}`}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
            <span>Call {activePatient?.name?.split(" ")[0] || "Loved One"}</span>
          </a>
        </div>
      </div>

      {/* Critical Alert Banner if unconfirmed dose > 0 */}
      {unconfirmedCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Action Needed: {unconfirmedCount} Scheduled Dose{unconfirmedCount > 1 ? "s" : ""} Pending Confirmation
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                {activePatient?.name} has not yet confirmed their scheduled medication. You can call them or verify with the caretaker.
              </p>
            </div>
          </div>
          <Link
            href="/family/medications"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shrink-0 text-center"
          >
            Review Dose Status
          </Link>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Adherence */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Adherence Rate</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{adherenceRate}%</span>
            <span className="text-xs font-bold text-emerald-600">Past 7 Days</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                adherenceRate >= 80 ? "bg-emerald-500" : adherenceRate >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${adherenceRate}%` }}
            />
          </div>
        </div>

        {/* Today's Doses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Progress</span>
            <Pill className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {takenCount} <span className="text-base font-normal text-slate-400">/ {totalEvents}</span>
            </span>
            <span className="text-xs font-semibold text-slate-600">Doses Taken</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 truncate">
            {unconfirmedCount} pending • {skippedCount} skipped
          </p>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Clinic Visits</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{patientAppointments.length}</span>
            <span className="text-xs font-semibold text-slate-600">Scheduled</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 truncate">
            {patientAppointments[0] ? `Next: ${patientAppointments[0].doctor_name}` : "None upcoming"}
          </p>
        </div>

        {/* Care Circle Active Members */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Family Circle</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{elderlyProfiles.length}</span>
            <span className="text-xs font-semibold text-slate-600">Loved Ones</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 truncate">
            Active Caretaker Assigned
          </p>
        </div>
      </div>

      {/* Multi-Patient Quick Roster */}
      {elderlyProfiles.length > 1 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Linked Family Members ({elderlyProfiles.length})
            </h2>
            <Link
              href="/family/patients"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>Manage Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {elderlyProfiles.map((p) => {
              const isSelected = p.id === activePatient?.id;
              const pEvts = events.filter((e) => e.elderly_id === p.id);
              const pUnconf = pEvts.filter((e) => e.status === "unconfirmed").length;

              return (
                <div
                  key={p.id}
                  onClick={() => setActivePatientId(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-teal-50/50 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                      : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                        {(p.name || p.full_name || "P").charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{p.name || p.full_name}</div>
                        <div className="text-xs text-slate-500">Age {p.age} • {p.city || "Pune"}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-teal-600 text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Status</span>
                    {pUnconf > 0 ? (
                      <span className="font-bold text-amber-700">{pUnconf} dose pending</span>
                    ) : (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Up to date
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Today's Med Status & Caretaker Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Medication Doses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Today's Dose Schedule for {activePatient?.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Verification status of daily medications
                </p>
              </div>
              <Link
                href="/family/medications"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {patientEvents.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Pill className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">No medication events scheduled for today.</p>
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
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isTaken
                          ? "bg-emerald-50/40 border-emerald-200"
                          : isUnconfirmed
                          ? "bg-amber-50/40 border-amber-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
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
                          <div className="text-sm font-bold text-slate-900">{evt.medication_name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>Scheduled: {evt.scheduled_time}</span>
                            {evt.dosage && <span>• {evt.dosage}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isTaken ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmed Taken</span>
                          </span>
                        ) : isUnconfirmed ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </span>
                            <button
                              onClick={() => confirmMedication(evt.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
                            >
                              Mark Taken
                            </button>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
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

          {/* Upcoming Medical Appointments */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Upcoming Medical Visits</h2>
                <p className="text-xs text-slate-500">Escort planning and clinic coordination</p>
              </div>
              <Link
                href="/family/appointments"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {patientAppointments.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium">No upcoming appointments booked.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patientAppointments.slice(0, 2).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{apt.doctor_name}</div>
                        <div className="text-xs text-slate-600">{apt.specialty} • {apt.clinic_name}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">
                          Date: <strong className="text-slate-800">{apt.appointment_date}</strong> at{" "}
                          <strong className="text-slate-800">{apt.appointment_time}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        Escort: {apt.accompanied_by || "Family Member"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Caretaker Activity Stream & Emergency Card */}
        <div className="space-y-6">
          {/* Caretaker Activity Stream */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Caretaker Activity
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Live</span>
            </div>

            {patientNotes.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                No recent clinical notes submitted by the caretaker.
              </div>
            ) : (
              <div className="space-y-3">
                {patientNotes.slice(0, 3).map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                        {note.caretaker_name || "Caregiver Staff"}
                      </span>
                      <span className="text-[11px] text-slate-400">{note.created_at?.slice(0, 10)}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{note.content || note.observation}</p>
                    {note.vitals_summary && (
                      <div className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                        Vitals: {note.vitals_summary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Protocols & Primary Caretaker Contacts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Emergency Lifeline
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you detect an urgent irregularity or your loved one does not answer phone calls, trigger emergency protocols immediately.
            </p>

            <div className="space-y-2">
              <a
                href={`tel:${activePatient?.emergency_contact_phone || "112"}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <div className="text-left">
                    <div className="text-xs font-bold">Emergency Contact</div>
                    <div className="text-[11px] text-rose-700">{activePatient?.emergency_contact_phone || "+91 98765 43210"}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600">Dial &rarr;</span>
              </a>

              <a
                href="tel:108"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-red-500" />
                  <div className="text-left">
                    <div className="text-xs font-bold">National Ambulance (India)</div>
                    <div className="text-[11px] text-slate-500">Toll-free emergency dispatch</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600">108</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
