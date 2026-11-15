"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles,
  Clock,
  Volume2,
  VolumeX,
  PhoneCall,
  ChevronRight,
  Sliders,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useCare } from "@/context/CareContext";

export default function LandingPage() {
  const { setCurrentRole } = useCare();

  // Interactive timeline scrubber state (Act 2)
  const [activeHourIndex, setActiveHourIndex] = useState(0);

  // Interactive module tab state (Act 3)
  const [activeModuleTab, setActiveModuleTab] = useState(0);

  // Audio sample player state (Act 5)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Interactive Hero Pill Check state
  const [heroPillTaken, setHeroPillTaken] = useState(true);

  const timelineSteps = [
    {
      time: "08:00 AM",
      phase: "Morning Routine",
      title: "Blood Pressure & Vitamin Routine",
      eleanor: "Large prompt displays: 'Take Lisinopril 10mg with breakfast'. Eleanor taps the green 56px button.",
      david: "Phone notification arrives: 'Mom took Lisinopril at 08:12 AM. Vitals normal.'",
      priya: "Dose marked 'confirmed' in clinical portal. Adherence score maintains 100%.",
    },
    {
      time: "10:30 AM",
      phase: "Clinical Coordination",
      title: "Cardiology Visit with Dr. Jenkins",
      eleanor: "CareVoice reminds: 'Nurse Priya is arriving in 15 minutes to accompany you to Metro Heart Center.'",
      david: "Calendar syncs: Escort confirmed. Hospital route and transport locked.",
      priya: "Nurse Priya checks off escort task and logs pre-visit blood pressure reading (124/82).",
    },
    {
      time: "02:00 PM",
      phase: "Health Literacy",
      title: "Interactive Academy Lesson",
      eleanor: "Eleanor listens to a 2-minute audio lesson on prescription labels in Marathi and passes a 1-question quiz.",
      david: "Progress badge updates: Eleanor completed 'Understanding Prescription Labels'.",
      priya: "Patient engagement logged in clinical educational adherence chart.",
    },
    {
      time: "07:30 PM",
      phase: "Evening Regimen",
      title: "Dinner & Glycemic Management",
      eleanor: "Prompt: 'Take Metformin ER 500mg with dinner'. Eleanor confirms dose with one tap.",
      david: "David sees daily compliance reach 100% on his FamilyCare overview.",
      priya: "PillGuard updates weekly trend bar. Zero missed dose flags.",
    },
  ];

  const modules = [
    {
      id: "medimate",
      title: "MediMate",
      category: "Module A",
      badge: "Medication Companion",
      tagline: "Prescription adherence with zero cognitive strain",
      desc: "Structured daily timeline, dosages, and physician guidelines. Elderly users confirm doses with single-tap clarity.",
      icon: Pill,
      color: "bg-teal-600 text-white",
      href: "/medications",
      previewComponent: (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase">08:00 AM Daily</span>
              <h5 className="font-extrabold text-slate-900 text-base">Lisinopril (10mg)</h5>
              <p className="text-xs text-slate-600">Blood pressure • 1 tablet morning</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
              <Check className="w-3.5 h-3.5" /> Taken
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">07:30 PM Daily</span>
              <h5 className="font-extrabold text-slate-900 text-base">Metformin ER (500mg)</h5>
              <p className="text-xs text-slate-600">With dinner • 1 tablet</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
              Pending
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "familycare",
      title: "FamilyCare",
      category: "Module B",
      badge: "Shared Care Circle",
      tagline: "Complete peace of mind for family members anywhere",
      desc: "Keeps sons, daughters, and guardians synchronized with real-time intake telemetry, emergency contacts, and notifications.",
      icon: Users,
      color: "bg-blue-600 text-white",
      href: "/family",
      previewComponent: (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">David Vance (Son)</span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold">Live Sync</span>
            </div>
            <p className="text-xs text-slate-700 mt-2">
              "Eleanor Vance confirmed morning intake on schedule. Next scheduled dose at 07:30 PM."
            </p>
            <div className="mt-3 pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Adherence Score: <strong className="text-blue-950 font-bold">100%</strong></span>
              <span className="text-teal-700 font-semibold">Stable Vitals</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "caresync",
      title: "CareSync",
      category: "Module C",
      badge: "Care Logistics",
      tagline: "Coordinated doctor appointments and escort logistics",
      desc: "Doctor visits, clinic maps, caregiver transportation assignments, and synchronized care checklists in one schedule.",
      icon: Calendar,
      color: "bg-indigo-600 text-white",
      href: "/appointments",
      previewComponent: (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
            <span className="text-[11px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">Tomorrow, 10:30 AM</span>
            <h5 className="font-extrabold text-slate-900 text-base mt-2">Dr. Sarah Jenkins (Cardiology)</h5>
            <p className="text-xs text-slate-600">Metro Heart & Vascular Center • Suite 402</p>
            <div className="mt-3 text-xs text-indigo-800 font-medium">
              Assigned Escort: <strong>Nurse Priya Sharma, RN</strong>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "pillguard",
      title: "PillGuard",
      category: "Module D",
      badge: "Adherence Analytics",
      tagline: "Deterministic adherence metrics without false diagnoses",
      desc: "Computes compliance percentages, tracks 7-day adherence trends, and alerts authorized caregivers to missed doses.",
      icon: Activity,
      color: "bg-rose-600 text-white",
      href: "/adherence",
      previewComponent: (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-800 uppercase">Current Adherence</span>
              <div className="text-3xl font-black text-rose-950 mt-1">100%</div>
              <span className="text-xs text-rose-700 font-medium">2 of 2 doses taken on time</span>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Excellent Status
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "academy",
      title: "Health Academy",
      category: "Module E",
      badge: "Health Literacy",
      tagline: "Multilingual audio-first healthcare education",
      desc: "Verified lessons on medication timing and safety in English, Hindi, and Marathi with interactive quizzes and audio read-aloud.",
      icon: GraduationCap,
      color: "bg-amber-600 text-white",
      href: "/academy",
      previewComponent: (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">Trilingual Lesson</span>
              <span className="text-[11px] text-slate-500">EN • हिंदी • मराठी</span>
            </div>
            <h5 className="font-extrabold text-slate-900 text-base mt-2">Why Medication Timing Matters</h5>
            <p className="text-xs text-slate-600 mt-1">
              "Taking blood pressure medication at the exact same hour prevents early morning vascular spikes."
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "carevoice",
      title: "CareVoice AI",
      category: "Module F",
      badge: "Conversational AI",
      tagline: "Voice-driven assistant with controlled backend tools",
      desc: "Answers daily schedule questions, logs appointments, and reads instructions aloud with strict medical safety guardrails.",
      icon: Mic,
      color: "bg-emerald-600 text-white",
      href: "/assistant",
      previewComponent: (
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-slate-900 text-white text-xs ml-auto max-w-[85%]">
            "Have I taken my morning medicines today?"
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-900 text-xs max-w-[90%]">
            "Yes, Eleanor! You confirmed Lisinopril 10mg and Vitamin D3 at 08:12 AM."
          </div>
        </div>
      ),
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
        "Good morning Eleanor. This is CareVoice. You have two morning medicines scheduled. Your Lisinopril 10mg is ready to take with breakfast."
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
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          ACT 1: THE DIMENSIONAL MULTI-PLANE HERO
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-teal-50/70 via-slate-50 to-slate-50 border-b border-slate-200">
        {/* Background Grid & Atmospheric Lighting */}
        <div className="absolute inset-0 clinical-grid opacity-60 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-200/30 to-transparent blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white depth-layer-base border border-teal-200/80 text-teal-900 text-xs sm:text-sm font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span className="font-bold">CareOS 1.0</span>
              <span className="text-slate-300">•</span>
              <span>Intelligent Elderly Healthcare & Medication Management Ecosystem</span>
            </div>

            {/* Headline with taste-floor tracking and balance */}
            <h1 className="headline-display text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight">
              Healthcare that keeps <br className="hidden sm:inline" />
              <span className="text-teal-700 underline decoration-teal-300/80 underline-offset-8">
                everyone connected.
              </span>
            </h1>

            {/* Subheadline with readable body-measure */}
            <p className="body-measure text-lg sm:text-xl text-slate-600 mx-auto font-medium leading-relaxed">
              A collaborative healthcare platform that helps elderly individuals manage their daily routines independently while keeping family members and caretakers synchronized in real time.
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/elderly"
                onClick={() => setCurrentRole("elderly")}
                className="px-8 py-4 rounded-2xl bg-teal-700 text-white font-extrabold text-base hover:bg-teal-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 group touch-target"
              >
                <span>Launch Elderly Interface</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-2xl bg-white text-slate-800 font-extrabold text-base border border-slate-300 hover:bg-slate-50 transition-all shadow-xs flex items-center gap-2 touch-target"
              >
                <span>Open Care Hub</span>
              </Link>

              <button
                onClick={handlePlayVoiceSample}
                className="px-6 py-4 rounded-2xl bg-emerald-50 text-emerald-950 font-bold text-sm border border-emerald-300 hover:bg-emerald-100 transition-all flex items-center gap-2 shadow-xs touch-target"
                aria-label="Listen to voice check-in"
              >
                {isPlayingAudio ? (
                  <VolumeX className="w-5 h-5 text-emerald-700 animate-pulse" />
                ) : (
                  <Volume2 className="w-5 h-5 text-emerald-700" />
                )}
                <span>{isPlayingAudio ? "Stop Voice" : "Hear Eleanor's Check-in"}</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              THE HERO DIMENSIONAL STAGE (Interactive Hardware & Telemetry)
             ───────────────────────────────────────────────────────────── */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            {/* Mid-ground: The Focal Interactive Care Tablet */}
            <div className="relative rounded-3xl bg-white depth-layer-elevated p-6 sm:p-8 border border-slate-200/90 shadow-2xl">
              {/* Tablet Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-bold text-slate-400 ml-2">Eleanor Vance • Room Companion Display</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                  <span>Active Session • 08:00 AM Routine</span>
                </div>
              </div>

              {/* Tablet Screen Content */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Left: Patient Profile & Status */}
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-black text-2xl flex items-center justify-center">
                    👵
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Eleanor Vance, 78y</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Hypertension • Type-2 Diabetes</p>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <div>Emergency: <strong>David Vance (Son)</strong></div>
                    <div>Nurse: <strong>Priya Sharma, RN</strong></div>
                  </div>
                </div>

                {/* Center: Live Interactive Intake Card */}
                <div className="md:col-span-2 bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded">
                      Scheduled Medication
                    </span>
                    <span className="text-xs font-bold text-slate-500">Today, 08:00 AM</span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">Lisinopril 10mg</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Take 1 tablet with breakfast and water for blood pressure stability.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Toggle */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setHeroPillTaken(!heroPillTaken)}
                      className={`px-5 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 transition-all shadow-sm ${
                        heroPillTaken
                          ? "bg-teal-600 text-white shadow-teal-500/20"
                          : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{heroPillTaken ? "CONFIRMED TAKEN AT 08:12 AM" : "PRESS TO CONFIRM INTAKE"}</span>
                    </button>

                    <span className="text-xs text-slate-500 italic">
                      {heroPillTaken ? "Synchronized with Family & Nurse" : "Waiting for patient tap"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Foreground Plane Left: Floating PillGuard Telemetry Badge */}
            <div className="hidden lg:block absolute -top-8 -left-10 bg-white/95 backdrop-blur-md depth-layer-float rounded-2xl p-4 border border-slate-200/90 shadow-xl max-w-[240px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PillGuard Live</div>
                  <div className="text-sm font-black text-slate-900">{heroPillTaken ? "100% Adherence" : "90% Adherence"}</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-tight">
                {heroPillTaken ? "All morning doses recorded on schedule." : "Awaiting Eleanor's morning intake confirmation."}
              </p>
            </div>

            {/* Foreground Plane Right: Floating CareVoice Audio Badge */}
            <div className="hidden lg:block absolute -bottom-8 -right-10 bg-white/95 backdrop-blur-md depth-layer-float rounded-2xl p-4 border border-slate-200/90 shadow-xl max-w-[260px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CareVoice AI</div>
                  <div className="text-sm font-black text-slate-900">Audio Connected</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-tight italic">
                "What medicines do I need today, Eleanor?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT 2: THE 24-HOUR CARE SYNCHRONY SCRUBBER
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-teal-700 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real-Time Synchronization
          </span>
          <h2 className="headline-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            A Day in Eleanor's Care Circle
          </h2>
          <p className="body-measure text-slate-600 mx-auto text-sm sm:text-base">
            Scrub through Eleanor's daily routine to witness how every medication confirmation, clinic appointment, and voice query synchronizes across the entire support network.
          </p>
        </div>

        {/* Scrubber Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {timelineSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHourIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeHourIndex === idx
                  ? "bg-teal-700 text-white depth-layer-elevated border-teal-800 scale-[1.02]"
                  : "bg-white text-slate-700 depth-layer-base hover:border-teal-300"
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${activeHourIndex === idx ? "text-teal-200" : "text-slate-400"}`}>
                {step.time}
              </span>
              <h4 className="font-extrabold text-sm sm:text-base mt-1 line-clamp-1">{step.phase}</h4>
            </button>
          ))}
        </div>

        {/* 3-Way Synchronized Screen Display */}
        <div className="bg-white rounded-3xl depth-layer-elevated p-6 sm:p-10 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {timelineSteps[activeHourIndex].time} • {timelineSteps[activeHourIndex].phase}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {timelineSteps[activeHourIndex].title}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Parallel Ecosystem Telemetry
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Eleanor's View */}
            <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👵</span>
                <span className="font-black text-sm text-amber-950 uppercase tracking-wide">
                  What Eleanor Sees
                </span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {timelineSteps[activeHourIndex].eleanor}
              </p>
              <div className="pt-2 text-xs font-bold text-amber-900 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Zero cognitive friction</span>
              </div>
            </div>

            {/* David's View */}
            <div className="bg-blue-50/70 border-2 border-blue-300/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👨</span>
                <span className="font-black text-sm text-blue-950 uppercase tracking-wide">
                  What David Sees (Family)
                </span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {timelineSteps[activeHourIndex].david}
              </p>
              <div className="pt-2 text-xs font-bold text-blue-900 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Instant reassurance</span>
              </div>
            </div>

            {/* Nurse Priya's View */}
            <div className="bg-purple-50/70 border-2 border-purple-300/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍⚕️</span>
                <span className="font-black text-sm text-purple-950 uppercase tracking-wide">
                  What Nurse Priya Logs
                </span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {timelineSteps[activeHourIndex].priya}
              </p>
              <div className="pt-2 text-xs font-bold text-purple-900 flex items-center gap-1">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Clinical compliance sync</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT 3: THE SIX INTERCONNECTED MODULES GALLERY
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-teal-700 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            System Architecture
          </span>
          <h2 className="headline-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Six Purpose-Built Modules. One Database.
          </h2>
          <p className="body-measure text-slate-600 mx-auto text-sm sm:text-base">
            CareOS eliminates the confusion of fragmented healthcare software by sharing state across medication, coordination, adherence, literacy, and AI dialogue.
          </p>
        </div>

        {/* Interactive Module Carousel / Tabs */}
        <div className="bg-white rounded-3xl depth-layer-elevated border border-slate-200 p-6 sm:p-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-100 scrollbar-none">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModuleTab(idx)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeModuleTab === idx
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Module Showcase */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                  {modules[activeModuleTab].category} • {modules[activeModuleTab].badge}
                </span>
              </div>
              <h3 className="headline-display text-3xl font-black text-slate-900">
                {modules[activeModuleTab].tagline}
              </h3>
              <p className="body-measure text-base text-slate-600 leading-relaxed">
                {modules[activeModuleTab].desc}
              </p>

              <div className="pt-2">
                <Link
                  href={modules[activeModuleTab].href}
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-teal-700 hover:text-teal-900 underline"
                >
                  <span>Open {modules[activeModuleTab].title} Live Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Live Interactive Preview Card */}
            <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200 depth-layer-base">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live System Preview
                </span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Ready to test
                </span>
              </div>
              {modules[activeModuleTab].previewComponent}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT 4: ACCESSIBILITY STANDARDS (Dignity vs Clutter)
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200/90 rounded-3xl p-8 sm:p-14 depth-layer-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
                Elderly-First Ergonomics
              </span>
              <h2 className="headline-display text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Designed for Dignity, Independence, and Radical Simplicity
              </h2>
              <p className="body-measure text-base text-slate-700 leading-relaxed">
                Conventional portals overload elderly users with tiny 11px gray fonts, labyrinthine menus, and confusing technical error codes. CareOS is purposely re-engineered with 24px high-contrast typography, 56px touch targets, and full audio narration.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-900">
                    WCAG AAA contrast ratios verified on every card and touch target
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-900">
                    One single primary action per card to prevent decision fatigue
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-700 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-900">
                    Hands-free voice querying for users with tremors or visual impairment
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/elderly"
                  onClick={() => setCurrentRole("elderly")}
                  className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md inline-flex items-center gap-2 touch-target"
                >
                  <Eye className="w-5 h-5" />
                  <span>Experience Big Button Mode</span>
                </Link>
              </div>
            </div>

            {/* Visual Contrast: Bad Portal vs CareOS */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border-2 border-teal-500 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-teal-800">CareOS Dignity View</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Accessible</span>
                </div>
                <div className="mt-3 space-y-2">
                  <h4 className="text-2xl font-black text-slate-950">Lisinopril 10mg</h4>
                  <p className="text-base text-slate-700 font-medium">1 tablet with water right now</p>
                  <button className="w-full mt-2 py-3.5 rounded-xl bg-teal-600 text-white font-black text-base shadow-sm">
                    YES, I TOOK THIS MEDICINE
                  </button>
                </div>
              </div>

              <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-300 opacity-60">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Traditional Clinical Software</span>
                <p className="text-xs text-slate-500 mt-1 line-through">
                  Rx #98421: 10mg Q.D. P.O. — Select regimen subcategory to confirm electronic audit log event...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACT 5: ONE-CLICK DEMO LAUNCH FLOOR
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="headline-display text-3xl sm:text-5xl font-black text-slate-900">
            Ready to explore CareOS?
          </h2>
          <p className="body-measure text-slate-600 mx-auto text-base">
            Select any persona to experience the platform from their perspective. No login credentials or setup required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link
            href="/elderly"
            onClick={() => setCurrentRole("elderly")}
            className="p-6 rounded-3xl bg-white depth-layer-elevated border-2 border-teal-500 hover:scale-105 transition-all text-left flex flex-col justify-between group"
          >
            <div>
              <div className="text-3xl mb-3">👵</div>
              <h4 className="text-xl font-black text-slate-900 group-hover:text-teal-700">Eleanor Vance</h4>
              <p className="text-xs font-bold text-teal-800 uppercase mt-0.5">Elderly Individual (78y)</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Large 24px text, audio prompts, one-tap pill confirmation, and voice assistance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-teal-700 flex items-center justify-between">
              <span>Enter Eleanor's Room</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/family"
            onClick={() => setCurrentRole("family")}
            className="p-6 rounded-3xl bg-white depth-layer-elevated border-2 border-blue-400 hover:scale-105 transition-all text-left flex flex-col justify-between group"
          >
            <div>
              <div className="text-3xl mb-3">👨</div>
              <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-700">David Vance</h4>
              <p className="text-xs font-bold text-blue-800 uppercase mt-0.5">Family Member / Son</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Live compliance status, upcoming appointments, family circle alerts, and direct nurse line.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-700 flex items-center justify-between">
              <span>Open Family Circle</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/caretaker"
            onClick={() => setCurrentRole("caretaker")}
            className="p-6 rounded-3xl bg-white depth-layer-elevated border-2 border-purple-400 hover:scale-105 transition-all text-left flex flex-col justify-between group"
          >
            <div>
              <div className="text-3xl mb-3">👩‍⚕️</div>
              <h4 className="text-xl font-black text-slate-900 group-hover:text-purple-700">Nurse Priya, RN</h4>
              <p className="text-xs font-bold text-purple-800 uppercase mt-0.5">Geriatric Nurse Specialist</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Clinical task assignment, observation notes, hospital escort scheduling, and adherence records.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-700 flex items-center justify-between">
              <span>Access Clinical Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
