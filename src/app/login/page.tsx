"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import { useRouter } from "next/navigation";
import {
  Heart,
  Shield,
  ArrowRight,
  User,
  Users,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { UserRole } from "@/lib/types";

export default function LoginPage() {
  const { setCurrentRole } = useCare();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSelectPersona = (role: UserRole, targetRoute: string) => {
    setCurrentRole(role);
    router.push(targetRoute);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo behavior
    setCurrentRole("elderly");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Heart className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to CareOS
          </h1>
          <p className="text-xs text-slate-500">
            Secure, role-aware elderly care management ecosystem
          </p>
        </div>

        {/* 1-Click Hackathon Persona Selector */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block text-center">
            One-Click Demo Personas
          </span>

          <button
            onClick={() => handleSelectPersona("elderly", "/elderly")}
            className="w-full p-3.5 rounded-2xl border-2 border-teal-500 bg-teal-50/60 hover:bg-teal-100/70 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                👵
              </div>
              <div>
                <h4 className="font-bold text-sm text-teal-950">Eleanor Vance</h4>
                <p className="text-xs text-teal-700">Elderly Patient • Big Button View</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-700 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleSelectPersona("family", "/family")}
            className="w-full p-3.5 rounded-2xl border-2 border-blue-400 bg-blue-50/60 hover:bg-blue-100/70 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                👨
              </div>
              <div>
                <h4 className="font-bold text-sm text-blue-950">David Vance</h4>
                <p className="text-xs text-blue-700">Family Member • Shared Care Dashboard</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleSelectPersona("caretaker", "/caretaker")}
            className="w-full p-3.5 rounded-2xl border-2 border-purple-400 bg-purple-50/60 hover:bg-purple-100/70 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                👩‍⚕️
              </div>
              <div>
                <h4 className="font-bold text-sm text-purple-950">Nurse Priya Sharma, RN</h4>
                <p className="text-xs text-purple-700">Primary Caregiver • Clinical Portal</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400 font-semibold uppercase">Or Supabase Auth</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="eleanor.vance@careos.health"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Sign In with Email
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Role-Based Access Control Protected</span>
        </div>
      </div>
    </div>
  );
}
