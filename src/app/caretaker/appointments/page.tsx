"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  PhoneCall,
  Search,
  CheckCircle2,
  X,
  FileText,
  Shield,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function CaretakerAppointmentsPage() {
  const {
    appointments,
    elderlyProfiles,
    activePatient,
    addAppointment,
    currentUser,
  } = useCare();

  const [selectedPatientId, setSelectedPatientId] = useState<string>("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form State
  const [patientId, setPatientId] = useState(activePatient?.id || elderlyProfiles[0]?.id || "");
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("Geriatric Medicine");
  const [clinicName, setClinicName] = useState("");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("11:30 AM");
  const [accompaniedBy, setAccompaniedBy] = useState("Sister Sunita (Nurse Escort)");
  const [notes, setNotes] = useState("");

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedPatientId !== "all" && apt.elderly_id !== selectedPatientId) {
      return false;
    }
    return true;
  });

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !clinicName || !aptDate || !patientId) return;

    await addAppointment({
      elderly_id: patientId,
      doctor_name: doctorName,
      clinic_or_hospital: clinicName,
      clinic_name: clinicName,
      specialty,
      purpose: specialty || "Geriatrics Consultation",
      appointment_date: aptDate,
      appointment_time: aptTime,
      status: "upcoming",
      accompanied_by: accompaniedBy,
      notes: notes || undefined,
    });

    setDoctorName("");
    setClinicName("");
    setNotes("");
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Clinic & Escort Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointments & Escort Schedule
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Coordinate clinical consultations, transport logistics, and caregiver escort assignments.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
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
          {filteredAppointments.length} Upcoming Consultation(s)
        </span>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <HonestEmptyState
          title="No Scheduled Appointments"
          description="There are currently no doctor consultations or escort duties recorded for this filter."
          icon={Calendar}
          badge="Live Clinic Schedule"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((apt) => {
            const patient = elderlyProfiles.find((p) => p.id === apt.elderly_id) || activePatient;

            return (
              <div
                key={apt.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1 inline-block">
                      Patient: {patient?.name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{apt.doctor_name}</h3>
                    <p className="text-xs font-semibold text-indigo-700">{apt.specialty}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                    {apt.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{apt.clinic_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Date: <strong>{apt.appointment_date}</strong> at <strong>{apt.appointment_time}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Escort: <strong className="text-slate-800">{apt.accompanied_by || "Caretaker Assigned"}</strong></span>
                  </div>
                  {apt.notes && (
                    <div className="flex items-start gap-2 pt-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-500 italic">{apt.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule Doctor Consultation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter clinical consultation details and assign caretaker escort duties.
            </p>

            <form onSubmit={handleSchedule} className="space-y-4">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Anand Deshmukh"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="Geriatrics"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic / Hospital</label>
                  <input
                    type="text"
                    required
                    placeholder="Sanjeevani Clinic"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="11:30 AM"
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designated Escort</label>
                <input
                  type="text"
                  value={accompaniedBy}
                  onChange={(e) => setAccompaniedBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Carry previous ECG reports and current medication log."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
