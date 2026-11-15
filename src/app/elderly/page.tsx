"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  PhoneCall,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

export default function ElderlyPage() {
  const {
    elderlyProfile,
    events,
    confirmMedication,
    appointments,
    adherence,
  } = useCare();

  const [speaking, setSpeaking] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<{ [id: string]: string }>({});

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for elderly clarity
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio is not supported in this browser.");
    }
  };

  const handleReadFullDailySchedule = () => {
    const takenCount = events.filter((e) => e.status === "taken").length;
    const pendingCount = events.filter((e) => e.status === "unconfirmed").length;
    const speech = `Good day, ${elderlyProfile.full_name}. Today you have ${events.length} scheduled medicines. You have already taken ${takenCount} medicines. You have ${pendingCount} medicines left to take today. You can press the big green button whenever you take your dose.`;
    speakText(speech);
  };

  const nextAppointment = appointments.find((a) => a.status === "upcoming");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold tracking-wider uppercase text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
              Today's Care Companion
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-950">
              Hello, {elderlyProfile.full_name}
            </h1>
            <p className="mt-1 text-lg sm:text-xl text-slate-700 font-medium">
              Here are your medicines for today. Everything is on schedule.
            </p>
          </div>

          {/* Large Audio Read-Out Button */}
          <button
            onClick={handleReadFullDailySchedule}
            className="px-6 py-4 rounded-2xl bg-teal-700 text-white hover:bg-teal-800 transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-md border-2 border-teal-800 touch-target"
            aria-label="Read schedule aloud"
          >
            {speaking ? <VolumeX className="w-7 h-7 text-amber-300 animate-pulse" /> : <Volume2 className="w-7 h-7" />}
            <span>{speaking ? "Stop Voice" : "Read Aloud"}</span>
          </button>
        </div>

        {/* Adherence Mini Status Bar */}
        <div className="mt-6 pt-6 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-black text-lg flex items-center justify-center">
              {adherence.overall_percentage}%
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Today's Adherence Score</div>
              <div className="text-xs text-slate-600">
                {adherence.taken_count} taken • {adherence.unconfirmed_count} remaining
              </div>
            </div>
          </div>

          <Link
            href="/assistant"
            className="px-5 py-3 rounded-xl bg-emerald-100 text-emerald-950 font-bold text-base hover:bg-emerald-200 transition-colors border border-emerald-300 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>Speak to CareVoice AI</span>
          </Link>
        </div>
      </div>

      {/* Medication Timeline Cards (Large Accessible Format) */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Your Daily Medication Checklist
        </h2>

        {events.map((evt) => {
          const isTaken = evt.status === "taken";
          const isSkipped = evt.status === "skipped";

          return (
            <div
              key={evt.id}
              className={`rounded-3xl p-6 sm:p-8 border-3 transition-all ${
                isTaken
                  ? "bg-teal-50/70 border-teal-500 shadow-sm"
                  : isSkipped
                  ? "bg-slate-100 border-slate-300 opacity-80"
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
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-teal-800 bg-teal-200 px-3 py-1 rounded-full">
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

                  <p className="text-lg text-slate-700 font-medium">
                    Dosage: <strong className="text-slate-900 font-bold">{evt.dosage_quantity}</strong>
                  </p>

                  <button
                    onClick={() =>
                      speakText(`Medicine: ${evt.medication_name}. Dosage: ${evt.dosage_quantity}. Scheduled for ${evt.scheduled_time}.`)
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-800 hover:text-teal-950 underline mt-1"
                  >
                    <Volume2 className="w-4 h-4" /> Listen to pill instructions
                  </button>
                </div>

                {/* Big Action Buttons (Touch Target >= 56px) */}
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  {!isTaken ? (
                    <>
                      <button
                        onClick={() => confirmMedication(evt.id, "taken")}
                        className="px-6 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-lg sm:text-xl shadow-lg border-2 border-teal-700 transition-all flex items-center justify-center gap-3 touch-target"
                      >
                        <CheckCircle2 className="w-7 h-7" />
                        <span>YES, I TOOK THIS</span>
                      </button>

                      <button
                        onClick={() => confirmMedication(evt.id, "skipped", "Skipped by user")}
                        className="px-5 py-4 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-base transition-all touch-target"
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
        })}
      </div>

      {/* Upcoming Appointment Helper */}
      {nextAppointment && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded-md">
                Upcoming Doctor Visit
              </span>
              <h4 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
                {nextAppointment.doctor_name}
              </h4>
              <p className="text-base text-slate-700 mt-1">
                {nextAppointment.clinic_or_hospital} • <strong>{nextAppointment.appointment_time}</strong>
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Purpose: {nextAppointment.purpose}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency & Support Call Bar */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-8">
        <h4 className="text-xl sm:text-2xl font-black text-rose-950 mb-2">
          Need Help Right Now?
        </h4>
        <p className="text-base text-slate-700 mb-6">
          You can reach your family member or primary nurse at any time with a single tap.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`tel:${elderlyProfile.emergency_contact_phone}`}
            className="p-4 rounded-2xl bg-rose-600 text-white font-black text-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-3 shadow-md"
          >
            <PhoneCall className="w-6 h-6" />
            <span>Call David (Son)</span>
          </a>

          <a
            href="tel:+15553456789"
            className="p-4 rounded-2xl bg-purple-700 text-white font-black text-lg hover:bg-purple-800 transition-colors flex items-center justify-center gap-3 shadow-md"
          >
            <PhoneCall className="w-6 h-6" />
            <span>Call Nurse Priya, RN</span>
          </a>
        </div>
      </div>
    </div>
  );
}
