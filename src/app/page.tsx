"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Pill,
  Users,
  Calendar,
  Activity,
  GraduationCap,
  Mic,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Volume2,
  VolumeX,
  PhoneCall,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useCare } from "@/context/CareContext";

export default function LandingPage() {
  const { setCurrentRole } = useCare();

  // Interactive Hero Intake Demo state
  const [heroPillTaken, setHeroPillTaken] = useState(true);

  // Audio sample player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const modules = [
    {
      id: "medimate",
      title: "MediMate",
      label: "Medication Management",
      desc: "Structured daily schedules, prescribed dosages, and single-tap intake confirmation designed for older adults.",
      icon: Pill,
      href: "/medications",
    },
    {
      id: "familycare",
      title: "FamilyCare",
      label: "Family Circle Portal",
      desc: "Real-time visibility into medication adherence, daily check-in status, and direct communication lines.",
      icon: Users,
      href: "/family",
    },
    {
      id: "caresync",
      title: "CareSync",
      label: "Appointment Logistics",
      desc: "Doctor appointments, clinic locations, caregiver escort scheduling, and coordinated care task checklists.",
      icon: Calendar,
      href: "/appointments",
    },
    {
      id: "pillguard",
      title: "PillGuard",
      label: "Adherence Analytics",
      desc: "Deterministic compliance calculation from scheduled events with missed dose detection and non-diagnostic caregiver alerts.",
      icon: Activity,
      href: "/adherence",
    },
    {
      id: "academy",
      title: "Health Academy",
      label: "Health Literacy",
      desc: "Plain-language medication safety guides in English, Hindi, and Marathi with interactive quizzes and audio read-aloud.",
      icon: GraduationCap,
      href: "/academy",
    },
    {
      id: "carevoice",
      title: "CareVoice",
      label: "Voice Healthcare Assistant",
      desc: "Speech-enabled assistant with controlled tool calling for schedule lookups and appointment requests, guarded by strict safety boundaries.",
      icon: Mic,
      href: "/assistant",
    },
  ];

  const handlePlayVoiceSample = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(
        "Good morning Eleanor. You have two morning medicines scheduled. Your Lisinopril 10mg is ready to take with breakfast."
      );
      utterance.rate = 0.92;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Audio synthesis is not supported in this browser.");
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO
         ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>CareOS Healthcare Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Medication management and care coordination for older adults.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              An accessible healthcare platform that helps elderly individuals manage daily routines independently while keeping family members and caretakers informed in real time.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/elderly"
                onClick={() => setCurrentRole("elderly")}
                className="px-6 py-3.5 rounded-lg bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Open Elderly View</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-lg bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 hover:bg-slate-200 transition-colors"
              >
                <span>View Care Dashboard</span>
              </Link>

              <button
                onClick={handlePlayVoiceSample}
                className="px-5 py-3.5 rounded-lg bg-white text-slate-700 font-semibold text-sm border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2"
                aria-label="Listen to voice check-in"
              >
                {isPlayingAudio ? (
                  <VolumeX className="w-4 h-4 text-teal-700" />
                ) : (
                  <Volume2 className="w-4 h-4 text-teal-700" />
                )}
                <span>{isPlayingAudio ? "Stop Audio" : "Listen to Check-in"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Working Surface Preview (Grounded, Clean, No Fake Window Dots) */}
          <div className="mt-12 rounded-xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Care Profile
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Eleanor Vance, Age 78
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Hypertension • Type-2 Diabetes • Managed with oral regimens
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Today's Adherence</div>
                  <div className="text-2xl font-black text-slate-900">
                    {heroPillTaken ? "100%" : "75%"}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Caregiver Sync</div>
                  <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                    Live
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Timeline Item */}
            <div className="mt-6 bg-white rounded-lg border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    08:00 AM
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Morning Dose</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Lisinopril 10mg</h4>
                <p className="text-xs text-slate-600">
                  Take 1 tablet with breakfast and a glass of water for blood pressure management.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setHeroPillTaken(!heroPillTaken)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    heroPillTaken
                      ? "bg-teal-700 text-white hover:bg-teal-800"
                      : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{heroPillTaken ? "Confirmed Taken (08:12 AM)" : "Confirm Intake"}</span>
                </button>
                <span className="text-xs text-slate-500">
                  {heroPillTaken ? "Logged in CareOS" : "Pending patient tap"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: END-TO-END CARE COORDINATION
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How CareOS coordinates daily health
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Actions taken in one part of the application immediately inform everyone involved in Eleanor's care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 1: Patient
            </div>
            <h3 className="font-bold text-lg text-slate-900">Medication Intake</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Eleanor views her large-font schedule or speaks to CareVoice. With a single tap or voice confirmation, she logs her dose.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 2: Analytics
            </div>
            <h3 className="font-bold text-lg text-slate-900">PillGuard Verification</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              PillGuard recalculates adherence percentages deterministically. Missed doses trigger automated notifications without generating false diagnoses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 3: Family & Caregiver
            </div>
            <h3 className="font-bold text-lg text-slate-900">Shared Awareness</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Her son David sees that morning pills were taken on time. Nurse Priya tracks clinical observations and clinic visit logistics.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: THE SIX INTEGRATED MODULES
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Six interconnected care modules
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Designed as a single, cohesive ecosystem backed by shared records and verified access control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5 text-teal-700" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {m.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{m.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={m.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    <span>Open {m.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: ACCESSIBILITY FOCUS
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-2xl p-8 sm:p-12 border border-slate-200">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Elderly Ergonomics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Built for readability, clarity, and comfort
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Older adults should not have to squint at tiny labels or navigate complex nested menus. CareOS provides an interface built specifically for ease of use.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-slate-800 font-medium">
                <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                <span>Large readable typography (20px to 32px) and high contrast ratios.</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-800 font-medium">
                <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                <span>Generous touch targets (minimum 48px to 56px) for comfortable interaction.</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-800 font-medium">
                <Check className="w-4 h-4 text-teal-700 flex-shrink-0" />
                <span>Audio read-aloud support and voice querying via CareVoice.</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/elderly"
                onClick={() => setCurrentRole("elderly")}
                className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                <span>View Elderly Interface</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: INSTANT DEMO ROLES
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Explore by user perspective
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose any profile below to test the platform immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Link
            href="/elderly"
            onClick={() => setCurrentRole("elderly")}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-colors text-left flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Patient</span>
              <h4 className="text-base font-bold text-slate-900 mt-1">Eleanor Vance</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Large typography, simplified daily medication checklist, and voice queries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-teal-700 flex items-center justify-between">
              <span>Open Patient View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/family"
            onClick={() => setCurrentRole("family")}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-colors text-left flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Family Member</span>
              <h4 className="text-base font-bold text-slate-900 mt-1">David Vance</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Daily adherence metrics, appointment tracking, notifications, and emergency line.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-teal-700 flex items-center justify-between">
              <span>Open Family View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/caretaker"
            onClick={() => setCurrentRole("caretaker")}
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-colors text-left flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Caregiver</span>
              <h4 className="text-base font-bold text-slate-900 mt-1">Nurse Priya Sharma, RN</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Assigned care tasks, clinical observation notes, and appointment escort coordination.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-teal-700 flex items-center justify-between">
              <span>Open Caregiver View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
