"use client";

import React from "react";
import { useCare } from "@/context/CareContext";
import {
  FileText,
  Heart,
  PhoneCall,
  Activity,
  ShieldCheck,
  UserCheck,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { BluetoothHealthDeviceWidget } from "@/components/BluetoothHealthDeviceWidget";

export default function PatientHealthRecordsPage() {
  const { activePatient, consents } = useCare();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
          Personal Medical Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
          My Health Records
        </h1>
        <p className="text-lg text-slate-700 font-medium mt-1">
          Your medical records, emergency information, and health device readings.
        </p>
      </div>

      {/* Basic Clinical Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-teal-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-2xl">
            {activePatient.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">{activePatient.full_name}</h2>
            <p className="text-sm font-semibold text-slate-600">
              Date of Birth: {activePatient.date_of_birth || "1948-04-12"} • Blood Group: <strong className="text-teal-800">{activePatient.blood_group || "O+"}</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Primary Medical Conditions
            </span>
            <p className="text-base text-slate-800 font-semibold leading-relaxed">
              {activePatient.medical_notes || "Hypertension, mild Osteoarthritis, Type-2 Diabetes managed via diet and oral medication."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Residential Address
            </span>
            <p className="text-base text-slate-800 font-semibold leading-relaxed">
              {activePatient.address || "742 Evergreen Terrace, Springfield"}
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Designated Emergency Contact
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {activePatient.emergency_contact_name}
            </h3>
            <p className="text-base text-slate-700 font-semibold">{activePatient.emergency_contact_phone}</p>
          </div>

          <a
            href={`tel:${activePatient.emergency_contact_phone}`}
            className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-sm touch-target self-start sm:self-auto"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Call Contact</span>
          </a>
        </div>
      </div>

      {/* Bluetooth Vital Monitor Widget */}
      <BluetoothHealthDeviceWidget />

      {/* Active Data Sharing Consents */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-700" />
          <span>Authorized Care Circle Access & Consents</span>
        </h3>
        <p className="text-sm text-slate-600">
          In accordance with healthcare privacy standards, only authorized family members and registered nurses can review your routine.
        </p>

        <div className="space-y-3 pt-2">
          {consents.length === 0 ? (
            <p className="text-xs text-slate-500">No active third-party consents registered.</p>
          ) : (
            consents.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-700" />
                  <span>Access Grant: {c.consent_type.replace(/_/g, " ").toUpperCase()}</span>
                </div>
                <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Active Consent
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
