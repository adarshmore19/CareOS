"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  Heart,
  PhoneCall,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  Edit2,
  Sparkles,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function FamilyPatientsPage() {
  const {
    elderlyProfiles,
    activePatient,
    setActivePatientId,
    invitations,
    inviteFamilyMember,
    revokeFamilyMember,
    consents,
    events,
  } = useCare();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [relationship, setRelationship] = useState("Daughter");
  const [canEditMeds, setCanEditMeds] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    await inviteFamilyMember(inviteEmail, relationship, canEditMeds);
    setFeedbackMsg(`Invitation successfully dispatched to ${inviteEmail}.`);
    setInviteEmail("");
    setShowInviteModal(false);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  const handleRevoke = async (id: string, email: string) => {
    await revokeFamilyMember(id);
    setFeedbackMsg(`Revoked care circle access for ${email}.`);
    setTimeout(() => setFeedbackMsg(""), 4000);
  };

  if (elderlyProfiles.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Family Members Roster</h1>
        <HonestEmptyState
          title="No Patient Profiles Found"
          description="There are currently no elderly relatives linked to your family care circle."
          icon={Users}
          badge="Authentic Records"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Care Circle Roster</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Family Patients
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage linked elderly family members and authorized family circle members.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Family Member</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Linked Elderly Profiles Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Linked Elderly Relatives ({elderlyProfiles.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {elderlyProfiles.map((p) => {
            const isSelected = p.id === activePatient?.id;
            const pEvents = events.filter((e) => e.elderly_id === p.id);
            const pendingDoses = pEvents.filter((e) => e.status === "unconfirmed").length;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-6 border transition-all ${
                  isSelected
                    ? "border-teal-500 ring-2 ring-teal-500/20 shadow-md"
                    : "border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
                      {(p.name || p.full_name || "P").charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{p.name || p.full_name}</h3>
                      <p className="text-xs text-slate-500">
                        Age {p.age} • Blood Group: <strong className="text-slate-700">{p.blood_group || "Unknown"}</strong>
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-teal-100 text-teal-800 border border-teal-200">
                      SELECTED
                    </span>
                  ) : (
                    <button
                      onClick={() => setActivePatientId(p.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      Switch to
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                    <span className="text-slate-800 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {p.city || "Pune, MH"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Emergency Dial</span>
                    <span className="text-slate-800 font-medium flex items-center gap-1 mt-0.5">
                      <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                      {p.emergency_contact_phone || "+91 98765 43210"}
                    </span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-500">Today's Dose Status:</span>
                    {pendingDoses > 0 ? (
                      <span className="font-bold text-amber-700">{pendingDoses} dose(s) pending</span>
                    ) : (
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All confirmed
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Consent: <strong className="text-slate-700">Family Monitoring Authorized</strong>
                  </span>
                  <a
                    href={`tel:${p.emergency_contact_phone || "112"}`}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Patient
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Authorized Family Circle Members & Permissions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Family Circle Access & Invitations</h2>
            <p className="text-xs text-slate-500">
              Manage family members authorized to monitor {activePatient?.name}'s medications and appointments.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 self-start sm:self-auto">
            {invitations.length} Active Invitation(s)
          </span>
        </div>

        {invitations.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-medium">No family invitations recorded yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Invite your siblings, children, or remote relatives to keep everyone in sync.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {invitations.map((inv) => (
              <div key={inv.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {inv.relationship.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{inv.invited_email}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {inv.relationship}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>Status: <strong className="text-emerald-700">{inv.status}</strong></span>
                      <span>•</span>
                      <span>
                        Permissions:{" "}
                        <strong className="text-slate-700">
                          {inv.can_edit_meds ? "View & Edit Medications" : "View-Only Access"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleRevoke(inv.id, inv.invited_email)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Revoke access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Invite to Family Circle</h3>
            <p className="text-xs text-slate-500 mb-4">
              Send an authentic invitation to another family member to monitor {activePatient?.name}.
            </p>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="sibling@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Daughter">Daughter</option>
                  <option value="Son">Son</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandchild">Grandchild</option>
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <input
                  type="checkbox"
                  id="modalCanEdit"
                  checked={canEditMeds}
                  onChange={(e) => setCanEditMeds(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                />
                <label htmlFor="modalCanEdit" className="text-xs text-slate-700 font-medium">
                  Allow editing medications and schedules
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
