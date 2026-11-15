"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Users,
  Heart,
  Pill,
  Calendar,
  CheckCircle2,
  Clock,
  PhoneCall,
  Shield,
  Activity,
  ArrowRight,
  Bell,
  UserPlus,
  Trash2,
  Lock,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function FamilyPage() {
  const {
    elderlyProfiles,
    activePatient,
    setActivePatientId,
    events,
    appointments,
    careTasks,
    adherence,
    notifications,
    markNotificationRead,
    clinicalNotes,
    activityLogs,
    invitations,
    consents,
    inviteFamilyMember,
    revokeFamilyMember,
    currentUser,
  } = useCare();

  const [activeTab, setActiveTab] = useState<"overview" | "meds" | "timeline" | "notifications" | "members">("overview");

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [relationship, setRelationship] = useState("Daughter");
  const [canEditMeds, setCanEditMeds] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    await inviteFamilyMember(inviteEmail, relationship, canEditMeds);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const patientEvents = events.filter((e) => e.elderly_id === activePatient.id);
  const takenCount = patientEvents.filter((e) => e.status === "taken").length;
  const unconfirmedCount = patientEvents.filter((e) => e.status === "unconfirmed").length;
  const skippedCount = patientEvents.filter((e) => e.status === "skipped").length;
  const missedCount = patientEvents.filter((e) => e.status === "missed").length;

  const patientAppointments = appointments.filter((a) => a.elderly_id === activePatient.id);
  const patientTasks = careTasks.filter((t) => t.elderly_id === activePatient.id);
  const patientNotes = clinicalNotes.filter((n) => n.elderly_id === activePatient.id);
  const patientLogs = activityLogs.filter((l) => l.elderly_id === activePatient.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-slate-600" />
            <span>FamilyCare Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Family Care Circle
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time healthcare monitoring, adherence, and coordination for aging loved ones.
          </p>
        </div>

        {/* Patient Switcher (Supports Multiple Elderly Family Members) */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase">Monitoring:</label>
          <select
            value={activePatient.id}
            onChange={(e) => setActivePatientId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-700"
          >
            {elderlyProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} ({p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : "78"} yrs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Patient Medical Profile
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{activePatient.full_name}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Clinical Conditions:</strong> {activePatient.medical_notes}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span>Blood Group: <strong className="text-slate-800">{activePatient.blood_group || "O+"}</strong></span>
              <span>•</span>
              <span>Emergency Contact: <strong className="text-slate-800">{activePatient.emergency_contact_name} ({activePatient.emergency_contact_phone})</strong></span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PillGuard Adherence
            </span>
            <div className="text-4xl font-black text-slate-900 mt-1">
              {adherence.overall_percentage}%
            </div>
            <span className="text-xs text-teal-700 font-semibold block mt-1">
              {takenCount} of {patientEvents.length} doses confirmed on time
            </span>
            <Link
              href="/adherence"
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 underline"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { key: "overview", label: "Care Overview" },
          { key: "meds", label: `Medications (${patientEvents.length})` },
          { key: "timeline", label: `Activity Feed (${patientLogs.length})` },
          { key: "notifications", label: `Alerts (${notifications.length})` },
          { key: "members", label: "Family Circle & Access" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Today's Intake Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Today's Intake Status</h3>
              <Link href="/medications" className="text-xs font-bold text-teal-700 hover:underline">
                Manage Regimens
              </Link>
            </div>

            <div className="space-y-3">
              {patientEvents.map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                        {evt.scheduled_time}
                      </span>
                      <h5 className="font-bold text-sm text-slate-900">{evt.medication_name}</h5>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">Dosage: {evt.dosage_quantity}</span>
                  </div>

                  <div>
                    {evt.status === "taken" ? (
                      <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Taken {evt.recorded_time}
                      </span>
                    ) : evt.status === "skipped" ? (
                      <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-xs font-semibold">
                        Skipped
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 flex items-start gap-2 border border-slate-200">
              <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                Note: A missing confirmation reflects an unconfirmed intake event, not definitive proof that the medication was omitted.
              </span>
            </div>
          </div>

          {/* Right Column: Appointments & Care Activities */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Upcoming Appointments</h3>
                <Link href="/appointments" className="text-xs font-bold text-teal-700 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {patientAppointments.map((apt) => (
                  <div key={apt.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-slate-900">{apt.doctor_name}</h5>
                      <span className="text-xs font-semibold text-slate-600">{apt.appointment_time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{apt.clinic_or_hospital} • {apt.purpose}</p>
                    {apt.caretaker_name && (
                      <div className="text-xs text-teal-700 font-semibold mt-2">
                        Assigned Escort: {apt.caretaker_name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Authorized Clinical Notes */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Clinical Observations</h3>
              {patientNotes.length === 0 ? (
                <p className="text-xs text-slate-500">No clinical notes recorded yet.</p>
              ) : (
                patientNotes.slice(0, 2).map((n) => (
                  <div key={n.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-slate-500 font-semibold">
                      <span>{n.author_name || "Caregiver Nurse"}</span>
                      <span>{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p>{n.observation}</p>
                    {n.action_taken && <p className="italic text-slate-500">Action: {n.action_taken}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDICATIONS DEEP-DIVE */}
      {activeTab === "meds" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Medication Monitoring & History</h3>
              <p className="text-xs text-slate-500">Breakdown of scheduled, confirmed, skipped, and unconfirmed doses</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200">
                {takenCount} Taken
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {unconfirmedCount} Pending
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {skippedCount} Skipped
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {patientEvents.map((evt) => (
              <div key={evt.id} className="p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {evt.scheduled_time}
                    </span>
                    <h5 className="font-bold text-slate-900">{evt.medication_name}</h5>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Dosage: <strong>{evt.dosage_quantity}</strong>
                    {evt.notes && <span className="ml-2 italic">• {evt.notes}</span>}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                    evt.status === "taken"
                      ? "bg-teal-100 text-teal-800"
                      : evt.status === "skipped"
                      ? "bg-slate-200 text-slate-700"
                      : "bg-amber-100 text-amber-900"
                  }`}>
                    {evt.status} {evt.recorded_time && `(${evt.recorded_time})`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY TIMELINE */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900">Chronological Family Activity Feed</h3>
            <p className="text-xs text-slate-500">Generated directly from verified database events</p>
          </div>

          <div className="space-y-4">
            {patientLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Activity className="w-4 h-4 text-teal-700 mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{log.actor_name || "System"}</span>
                    <span className="text-[11px] text-slate-400">• {log.created_at}</span>
                  </div>
                  <p className="text-xs text-slate-700">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS CENTER */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Notification & Alert Center</h3>
              <p className="text-xs text-slate-500">Adherence alerts, appointment updates, and clinical notifications</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{notifications.length} alerts</span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-lg border text-xs space-y-1.5 transition-colors ${
                  n.is_read ? "bg-slate-50 border-slate-200" : "bg-teal-50 border-teal-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.created_at}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{n.message}</p>
                {!n.is_read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline pt-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge Alert
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FAMILY MEMBERS & ACCESS MANAGEMENT */}
      {activeTab === "members" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Family Members & Consent Permissions</h3>
              <p className="text-xs text-slate-500">Manage who has access to Eleanor's medical records and medication schedule</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 rounded-lg bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Family Member</span>
            </button>
          </div>

          {/* Active Family Members */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Family Circle</h4>
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 text-sm">David Vance</h5>
                <p className="text-xs text-slate-600">Relationship: <strong>Son (Primary Guardian)</strong> • david.vance@careos.health</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Consent: Medical Records
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Medication Editing: Enabled
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400">Primary Contact</span>
            </div>
          </div>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Invitations</h4>
              {invitations.map((inv) => (
                <div key={inv.id} className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{inv.invited_email}</span>
                    <p className="text-xs text-slate-500">Role: {inv.relationship} • Status: Pending acceptance</p>
                  </div>
                  <button
                    onClick={() => revokeFamilyMember(undefined, inv.id)}
                    className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite Family Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Invite Family Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="family.member@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relationship to Eleanor *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daughter, Brother, Legal Guardian"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="canEditMeds"
                  checked={canEditMeds}
                  onChange={(e) => setCanEditMeds(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700"
                />
                <label htmlFor="canEditMeds" className="text-xs text-slate-700 font-medium">
                  Allow this member to add or modify medication schedules
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-800"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
