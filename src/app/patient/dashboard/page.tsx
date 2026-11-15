"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Pill,
  Calendar,
  PhoneCall,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Activity,
  Heart,
} from "lucide-react";
import { BluetoothHealthDeviceWidget } from "@/components/BluetoothHealthDeviceWidget";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function PatientDashboardPage() {
  const {
    activePatient,
    events,
    confirmMedication,
    appointments,
    adherence,
    careTasks,
  } = useCare();

  const [speaking, setSpeaking] = useState(false);

  const patientEvents = events.filter((e) => e.elderly_id === activePatient.id || !e.elderly_id);
  const takenCount = patientEvents.filter((e) => e.status === "taken").length;
  const pendingCount = patientEvents.filter((e) => e.status === "unconfirmed").length;
  const nextAppointment = appointments.find((a) => a.status === "upcoming");
  const activeTasks = careTasks.filter((t) => t.status !== "completed");

  const todayDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReadSchedule = () => {
    const speech = `Good day, ${activePatient.full_name}. Today is ${todayDateString}. You have ${patientEvents.length} scheduled medicines. You have already taken ${takenCount} medicines. You have ${pendingCount} medicines left to take.`;
    speakText(speech);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Card & Daily Healthcare Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
              Today: {todayDateString}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
              Welcome back, {activePatient.full_name}
            </h1>
            <p className="text-lg text-slate-700 font-medium mt-1">
              Everything is on schedule. Here is your daily healthcare checklist.
            </p>
          </div>

          <button
            onClick={handleReadSchedule}
            className="px-6 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-lg flex items-center justify-center gap-3 shadow-sm transition-colors touch-target shrink-0"
          >
            {speaking ? <VolumeX className="w-6 h-6 text-amber-300" /> : <Volume2 className="w-6 h-6" />}
            <span>{speaking ? "Stop Audio" : "Read Aloud"}</span>
          </button>
        </div>

        {/* Daily Summary Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xl shrink-0">
              {takenCount} / {patientEvents.length}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Medicines Taken</div>
              <div className="text-base font-bold text-slate-900">{pendingCount} remaining today</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-xl shrink-0">
              {adherence.overall_percentage}%
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Adherence Score</div>
              <div className="text-base font-bold text-teal-700">PillGuard Verified</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0">
              {appointments.filter((a) => a.status === "upcoming").length}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Visits</div>
              <div className="text-base font-bold text-slate-900">
                {nextAppointment ? nextAppointment.appointment_time : "No visits scheduled"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Medication Checklist (Large Accessible Format) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-3">
            <Pill className="w-7 h-7 text-teal-700" />
            <span>Today&apos;s Medication Checklist</span>
          </h2>
          <Link
            href="/patient/medications"
            className="text-sm font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
          >
            <span>View All ({patientEvents.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {patientEvents.length === 0 ? (
          <HonestEmptyState
            title="No Medications Scheduled Today"
            description="You have no medicines scheduled for today. Check with your family or caretaker if you need assistance."
            icon={Pill}
            badge="Authentic Intake Log • 0 Scheduled Doses"
          />
        ) : (
          patientEvents.map((evt) => {
            const isTaken = evt.status === "taken";
            const isSkipped = evt.status === "skipped";

            return (
              <div
                key={evt.id}
                className={`rounded-3xl p-6 sm:p-8 border-3 transition-all ${
                  isTaken
                    ? "bg-teal-50/70 border-teal-500 shadow-xs"
                    : isSkipped
                    ? "bg-slate-100 border-slate-300 opacity-75"
                    : "bg-white border-slate-400 shadow-md"
                }`}
                style={{ borderWidth: "3px" }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black px-3 py-1 rounded-lg bg-slate-900 text-white">
                        {evt.scheduled_time}
                      </span>
                      {isTaken && (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-teal-900 bg-teal-200 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-teal-800" /> Taken at {evt.recorded_time}
                        </span>
                      )}
                      {isSkipped && (
                        <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
                          Skipped for today
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                      {evt.medication_name}
                    </h3>
                    <p className="text-base text-slate-700 font-medium">
                      Dosage: <strong>{evt.dosage_quantity}</strong>
                      {evt.notes && <span> • Note: {evt.notes}</span>}
                    </p>
                  </div>

                  {/* Accessible Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {!isTaken ? (
                      <>
                        <button
                          onClick={() => confirmMedication(evt.id, "taken", "Confirmed via patient dashboard")}
                          className="px-8 py-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xl shadow-md transition-all flex items-center justify-center gap-3 touch-target"
                        >
                          <CheckCircle2 className="w-7 h-7" />
                          <span>I Took This</span>
                        </button>

                        <button
                          onClick={() => confirmMedication(evt.id, "skipped", "Skipped by patient")}
                          className="px-5 py-5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-base transition-all touch-target"
                        >
                          Skip
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => confirmMedication(evt.id, "unconfirmed")}
                        className="px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Undo / Mark Unconfirmed</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Upcoming Appointment Spotlight */}
      {nextAppointment ? (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-3 py-1 rounded-md">
              Next Medical Appointment
            </span>
            <Link
              href="/patient/appointments"
              className="text-xs font-bold text-indigo-800 hover:underline"
            >
              All Appointments →
            </Link>
          </div>

          <h3 className="text-2xl font-black text-slate-900">{nextAppointment.doctor_name}</h3>
          <p className="text-base text-slate-700">
            {nextAppointment.clinic_or_hospital} • <strong>{nextAppointment.appointment_time}</strong>
          </p>
          <p className="text-sm text-slate-600">
            Purpose: {nextAppointment.purpose}
          </p>

          {nextAppointment.caretaker_name && (
            <p className="text-xs font-bold text-indigo-900 pt-1">
              ✓ Assigned Caregiver Escort: {nextAppointment.caretaker_name}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-base text-slate-800">No Upcoming Doctor Appointments</h4>
          <p className="text-xs text-slate-500 mt-1">You are all caught up on clinic visits.</p>
        </div>
      )}

      {/* 4. Real Bluetooth Hardware Health Sensor */}
      <BluetoothHealthDeviceWidget />

      {/* 5. CareVoice AI Assistant Prompt Card */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              CareVoice Health Companion
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Have a Question About Your Routine?</h3>
          <p className="text-sm text-slate-700">
            Ask CareVoice about your pill timings, doctor appointments, or caregiver visits using simple voice commands.
          </p>
        </div>

        <Link
          href="/patient/assistant"
          className="px-6 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-sm shrink-0 touch-target"
        >
          <Sparkles className="w-5 h-5" />
          <span>Speak to CareVoice</span>
        </Link>
      </div>

      {/* 6. Emergency Assistance Box */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-2xl font-black text-rose-950">Emergency Contact Speed Dial</h3>
          <p className="text-sm text-slate-700 mt-1">
            Tap a button below to connect immediately with your family contact or professional nurse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`tel:${activePatient.emergency_contact_phone || "112"}`}
            className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg flex items-center justify-center gap-3 shadow-md transition-colors touch-target"
          >
            <PhoneCall className="w-6 h-6" />
            <span>Call {activePatient.emergency_contact_name || "Family Emergency Contact"}</span>
          </a>

          <a
            href="tel:+15553456789"
            className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg flex items-center justify-center gap-3 shadow-md transition-colors touch-target"
          >
            <PhoneCall className="w-6 h-6" />
            <span>Call Nurse Priya (Caregiver)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
