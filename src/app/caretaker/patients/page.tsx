"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Activity,
  ArrowRight,
  PhoneCall,
  Calendar,
  Pill,
  Clock,
  Shield,
} from "lucide-react";

export default function CaretakerPatientsPage() {
  const { elderlyProfiles, events, appointments, careTasks, adherence } = useCare();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "stable" | "attention">("all");

  const filteredPatients = elderlyProfiles.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medical_notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-slate-700" />
            <span>Assigned Patient Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Registry
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Displaying only patients assigned to your active clinical caregiver credentials.
          </p>
        </div>

        <Link
          href="/caretaker"
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
        >
          ← Back to Station
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search assigned patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Assigned Patients</option>
            <option value="stable">Stable Adherence (&gt;90%)</option>
            <option value="attention">Needs Attention</option>
          </select>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => {
          const patientEvts = events.filter((e) => e.elderly_id === patient.id);
          const patientApts = appointments.filter((a) => a.elderly_id === patient.id);
          const patientTasks = careTasks.filter((t) => t.elderly_id === patient.id);
          const age = patient.date_of_birth
            ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()
            : 78;

          return (
            <div
              key={patient.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-400 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Assigned Patient</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{patient.full_name}</h3>
                    <p className="text-xs text-slate-500">Age: {age} • Blood Group: {patient.blood_group || "O+"}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    Primary Assignment
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                  <strong>Clinical Profile:</strong> {patient.medical_notes}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Adherence</span>
                    <strong className="text-slate-900 text-base">{adherence.overall_percentage}%</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Today Meds</span>
                    <strong className="text-slate-900 text-base">{patientEvts.length} Doses</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Tasks</span>
                    <strong className="text-slate-900 text-base">{patientTasks.length} Pending</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                  <span>Emergency: <strong>{patient.emergency_contact_name}</strong></span>
                  <a href={`tel:${patient.emergency_contact_phone}`} className="text-teal-700 font-bold hover:underline flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">ID: {patient.id}</span>
                <Link
                  href={`/caretaker/patients/${patient.id}`}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span>Open Clinical Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
