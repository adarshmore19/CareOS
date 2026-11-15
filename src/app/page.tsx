"use client";

import React from "react";
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
  PhoneCall,
  Clock,
  Volume2,
} from "lucide-react";
import { useCare } from "@/context/CareContext";

export default function LandingPage() {
  const { setCurrentRole } = useCare();

  const modules = [
    {
      title: "MediMate",
      category: "Module A",
      tagline: "Personal Medication Companion",
      desc: "Smart schedules, dosages, instruction reminders, and single-tap intake confirmations designed for elderly clarity.",
      icon: Pill,
      color: "bg-teal-500",
      lightColor: "bg-teal-50 border-teal-200 text-teal-800",
      href: "/medications",
    },
    {
      title: "FamilyCare",
      category: "Module B",
      tagline: "Shared Family Dashboard",
      desc: "Keeps children and loved ones instantly informed with real-time adherence updates, health vitals, and care coordination.",
      icon: Users,
      color: "bg-blue-600",
      lightColor: "bg-blue-50 border-blue-200 text-blue-800",
      href: "/family",
    },
    {
      title: "CareSync",
      category: "Module C",
      tagline: "Healthcare Coordination",
      desc: "Centralizes doctor appointments, hospital visits, clinical reminders, and assigned caregiver logistics.",
      icon: Calendar,
      color: "bg-indigo-600",
      lightColor: "bg-indigo-50 border-indigo-200 text-indigo-800",
      href: "/appointments",
    },
    {
      title: "PillGuard",
      category: "Module D",
      tagline: "Adherence Monitoring & Analytics",
      desc: "Continuously computes compliance rates, detects missed doses, identifies trends, and alerts authorized caretakers before risks escalate.",
      icon: Activity,
      color: "bg-rose-500",
      lightColor: "bg-rose-50 border-rose-200 text-rose-800",
      href: "/adherence",
    },
    {
      title: "Health Academy",
      category: "Module E",
      tagline: "Interactive Health Education",
      desc: "Plain-language medication safety, label guides, and interactive audio-supported quizzes in English, Hindi, and Marathi.",
      icon: GraduationCap,
      color: "bg-amber-600",
      lightColor: "bg-amber-50 border-amber-200 text-amber-800",
      href: "/academy",
    },
    {
      title: "CareVoice AI",
      category: "Module F",
      tagline: "Conversational Healthcare Assistant",
      desc: "Voice-driven, tool-calling AI assistant that answers schedule questions, logs requests, and checks medication status safely.",
      icon: Mic,
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50 border-emerald-200 text-emerald-800",
      href: "/assistant",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-teal-50/60 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-teal-200 shadow-sm text-teal-800 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Complete Elderly Care & Medication Management Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Healthcare that keeps <br className="hidden sm:inline" />
            <span className="text-teal-700 underline decoration-teal-300 underline-offset-8">
              everyone connected.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An intelligent elderly care platform that brings medication management, family coordination, and voice-powered assistance into one place.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/elderly"
              onClick={() => setCurrentRole("elderly")}
              className="px-6 py-3.5 rounded-xl bg-teal-700 text-white font-bold text-base hover:bg-teal-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
            >
              <span>Launch Elderly Experience</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-white text-slate-800 font-bold text-base border border-slate-300 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
            >
              <span>Explore Full Dashboard</span>
            </Link>

            <Link
              href="/assistant"
              className="px-6 py-3.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-base border border-emerald-300 hover:bg-emerald-100 transition-all shadow-sm flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-emerald-700" />
              <span>Try CareVoice AI</span>
            </Link>
          </div>

          {/* Quick role shortcuts for judges & evaluators */}
          <div className="mt-10 p-4 max-w-2xl mx-auto bg-white/90 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Instant Hackathon Demo Logins (No password needed)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/elderly"
                onClick={() => setCurrentRole("elderly")}
                className="p-2.5 rounded-lg border border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 text-left transition-colors"
              >
                <div className="text-xs font-bold text-teal-900">👵 Eleanor Vance</div>
                <div className="text-[11px] text-teal-700">Elderly View (78y)</div>
              </Link>
              <Link
                href="/family"
                onClick={() => setCurrentRole("family")}
                className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left transition-colors"
              >
                <div className="text-xs font-bold text-blue-900">👨 David Vance</div>
                <div className="text-[11px] text-blue-700">Family Dashboard</div>
              </Link>
              <Link
                href="/caretaker"
                onClick={() => setCurrentRole("caretaker")}
                className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-left transition-colors"
              >
                <div className="text-xs font-bold text-purple-900">👩‍⚕️ Nurse Priya, RN</div>
                <div className="text-[11px] text-purple-700">Caregiver Portal</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Six Integrated Modules Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-widest text-teal-700 uppercase">
            Architectural Cohesion
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
            Six Interconnected Care Modules
          </h3>
          <p className="mt-3 text-slate-600">
            CareOS is not six disjointed tools. Every medication confirmed triggers PillGuard adherence recalculations, notifies the FamilyCare dashboard, updates CareSync schedules, and feeds CareVoice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-teal-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${m.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {m.category}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-slate-900">{m.title}</h4>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{m.tagline}</p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{m.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={m.href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 group-hover:text-teal-900 hover:underline"
                  >
                    <span>Open {m.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Elderly Accessibility Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Elderly-First Accessibility
              </span>
              <h3 className="mt-3 text-3xl font-black text-slate-900 leading-tight">
                Designed for Dignity, Independence, and Extreme Simplicity
              </h3>
              <p className="mt-4 text-base text-slate-700 leading-relaxed">
                Many elderly individuals struggle with confusing dashboards, tiny typography, and complex navigation. CareOS offers a dedicated simplified interface with 24px text, 56px touch targets, audio read-aloud support, and zero clutter.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">
                    High contrast, large fonts, and high-visibility cards
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">
                    One-touch "Confirmed Taken" action with audio feedback
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">
                    Conversational voice mode for natural spoken interactions
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/elderly"
                  onClick={() => setCurrentRole("elderly")}
                  className="px-6 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Try Accessible Elderly Interface</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Preview: Eleanor's View
                </span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Active Today
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-teal-50/80 border-2 border-teal-500 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-800 uppercase">08:00 AM</span>
                    <h5 className="text-lg font-bold text-slate-900">Lisinopril (10mg)</h5>
                    <p className="text-xs text-slate-600">Blood pressure • 1 tablet</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Taken
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">08:30 AM</span>
                    <h5 className="text-lg font-bold text-slate-900">Metformin ER (500mg)</h5>
                    <p className="text-xs text-slate-600">With breakfast • 1 tablet</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold shadow-sm">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How the Connected Workflow Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-widest text-teal-700 uppercase">
            End-To-End Synchronization
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
            How The Ecosystem Works Together
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center mx-auto mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Medication Scheduled</h4>
            <p className="text-xs text-slate-600">
              Caregiver or family schedules dosages, timings, and prescribing physician guidelines.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center mx-auto mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Patient Intake</h4>
            <p className="text-xs text-slate-600">
              Elderly confirms intake via big-button UI or speaks to CareVoice assistant.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center mx-auto mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 mb-1">PillGuard Analytics</h4>
            <p className="text-xs text-slate-600">
              Real-time adherence recalculation identifies missed doses and logs compliance patterns.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center mx-auto mb-3">
              4
            </div>
            <h4 className="font-bold text-slate-900 mb-1">Family & Caretakers</h4>
            <p className="text-xs text-slate-600">
              Instant alerts notify family and caregivers, keeping the support network fully in sync.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
