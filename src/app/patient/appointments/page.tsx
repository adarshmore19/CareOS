"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { VerifiedHospitalLookup } from "@/components/VerifiedHospitalLookup";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function PatientAppointmentsPage() {
  const { activePatient, appointments, addAppointment } = useCare();

  const [showModal, setShowModal] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [clinic, setClinic] = useState("");
  const [aptTime, setAptTime] = useState("");
  const [purpose, setPurpose] = useState("");

  const patientApts = appointments.filter((a) => a.elderly_id === activePatient.id || !a.elderly_id);
  const upcomingApts = patientApts.filter((a) => a.status === "upcoming");
  const pastApts = patientApts.filter((a) => a.status === "completed");

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !aptTime) return;

    addAppointment({
      elderly_id: activePatient.id,
      doctor_name: doctorName,
      clinic_or_hospital: clinic || "City General Hospital",
      appointment_time: aptTime,
      purpose: purpose || "General Consultation",
      status: "upcoming",
      caretaker_name: "Nurse Priya Sharma",
    });

    setDoctorName("");
    setClinic("");
    setAptTime("");
    setPurpose("");
    setShowModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
            Doctor Visits & Clinical Coordination
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
            My Appointments
          </h1>
          <p className="text-lg text-slate-700 font-medium mt-1">
            Review your doctor visits and caregiver accompaniment details.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base flex items-center gap-2 shadow-xs transition-colors touch-target self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Upcoming Appointments List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Upcoming Visits ({upcomingApts.length})</h2>

        {upcomingApts.length === 0 ? (
          <HonestEmptyState
            title="No Upcoming Appointments"
            description="You have no doctor visits scheduled on your calendar. You can book an appointment using the verified hospital search above."
            icon={Calendar}
            badge="Authentic Schedule • 0 Scheduled Appointments"
          />
        ) : (
          upcomingApts.map((apt) => (
            <div
              key={apt.id}
              className="p-6 sm:p-8 rounded-3xl border-3 border-teal-200 bg-white shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-3 py-1 rounded-md">
                  Confirmed Visit
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {apt.appointment_time}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">{apt.doctor_name}</h3>
              <p className="text-base text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{apt.clinic_or_hospital}</span>
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                <strong>Purpose:</strong> {apt.purpose}
              </div>

              {apt.caretaker_name && (
                <div className="text-sm font-bold text-teal-900 flex items-center gap-2 pt-1">
                  <UserCheck className="w-4 h-4 text-teal-700" />
                  <span>Assigned Caregiver Escort: {apt.caretaker_name}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Past Visits History */}
      {pastApts.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Past Medical Visits ({pastApts.length})
          </h2>
          <div className="space-y-3">
            {pastApts.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-base text-slate-900">{apt.doctor_name}</h4>
                  <p className="text-xs text-slate-600">{apt.clinic_or_hospital} • {apt.appointment_time}</p>
                  {apt.notes && <p className="text-xs text-slate-500 mt-1 italic">{apt.notes}</p>}
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700 self-start sm:self-auto">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-xl text-slate-900">Book Medical Appointment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg">✕</button>
            </div>

            <VerifiedHospitalLookup
              onSelectFacility={(fac) => {
                setClinic(`${fac.name}, ${fac.address}`);
              }}
            />

            <form onSubmit={handleCreateAppointment} className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins (Cardiology)"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinic / Hospital Location *</label>
                <input
                  type="text"
                  required
                  placeholder="Selected from search above or type location"
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date and Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nov 25, 2026 at 10:30 AM"
                  value={aptTime}
                  onChange={(e) => setAptTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Blood pressure 3-month review"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 shadow-sm"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
