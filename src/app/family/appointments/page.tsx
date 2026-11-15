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
} from "lucide-react";
import { VerifiedHospitalLookup } from "@/components/VerifiedHospitalLookup";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function FamilyAppointmentsPage() {
  const {
    activePatient,
    appointments,
    addAppointment,
  } = useCare();

  const [showBookModal, setShowBookModal] = useState(false);
  const [showHospitalSearch, setShowHospitalSearch] = useState(false);

  // Form State
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [clinicName, setClinicName] = useState("");
  const [aptDate, setAptDate] = useState("");
  const [aptTime, setAptTime] = useState("10:00 AM");
  const [accompaniedBy, setAccompaniedBy] = useState("Daughter (Priya)");
  const [notes, setNotes] = useState("");

  if (!activePatient) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Appointments & Escort Planning</h1>
        <HonestEmptyState
          title="No Active Patient Selected"
          description="Select an elderly family member to manage their clinic appointments and escort schedules."
          icon={Calendar}
          badge="Appointments Engine"
        />
      </div>
    );
  }

  const patientAppointments = appointments.filter((a) => a.elderly_id === activePatient.id);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !clinicName || !aptDate) return;

    await addAppointment({
      elderly_id: activePatient.id,
      doctor_name: doctorName,
      clinic_or_hospital: clinicName,
      clinic_name: clinicName,
      specialty,
      purpose: specialty || "Medical Consultation",
      appointment_date: aptDate,
      appointment_time: aptTime,
      status: "upcoming",
      accompanied_by: accompaniedBy,
      notes: notes || undefined,
    });

    setDoctorName("");
    setClinicName("");
    setNotes("");
    setShowBookModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              Escort & Clinic Logistics
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-semibold">{activePatient.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointments & Escort Planning
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Coordinate clinic visits, assign family escorts, and find authentic hospitals nearby.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHospitalSearch(!showHospitalSearch)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Hospitals</span>
          </button>
          <button
            onClick={() => setShowBookModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* Hospital Facility Finder Drawer / Accordion */}
      {showHospitalSearch && (
        <div className="bg-white rounded-2xl p-6 border border-teal-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Nearby Verified Hospital Facilities</h2>
              <p className="text-xs text-slate-500">Live Overpass OSM queries for verified healthcare clinics</p>
            </div>
            <button
              onClick={() => setShowHospitalSearch(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <VerifiedHospitalLookup />
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Scheduled Appointments ({patientAppointments.length})</h2>
            <p className="text-xs text-slate-500">Confirmed clinic consultations and escort assignments</p>
          </div>
        </div>

        {patientAppointments.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-sm">
            No upcoming clinic appointments scheduled. Click "Schedule Visit" to record one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{apt.doctor_name}</h3>
                    <p className="text-xs font-semibold text-teal-700">{apt.specialty}</p>
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
                      <strong>{apt.appointment_date}</strong> at <strong>{apt.appointment_time}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Escort: <strong className="text-slate-800">{apt.accompanied_by || "Family Member"}</strong></span>
                  </div>
                  {apt.notes && (
                    <div className="flex items-start gap-2 pt-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-500 italic">{apt.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule Clinic Visit</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add an appointment to {activePatient.name}'s calendar and designate who is escorting them.
            </p>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Anand Deshmukh"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic / Hospital</label>
                  <input
                    type="text"
                    required
                    placeholder="Sanjeevani Clinic"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:30 AM"
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designated Family Escort</label>
                <input
                  type="text"
                  placeholder="Daughter (Priya)"
                  value={accompaniedBy}
                  onChange={(e) => setAccompaniedBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preparation Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Bring previous blood test reports and fasting sugar chart."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
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
