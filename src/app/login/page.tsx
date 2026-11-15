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
  AlertCircle,
  KeyRound,
  UserPlus,
  LogIn,
} from "lucide-react";
import { UserRole } from "@/lib/types";

export default function LoginPage() {
  const { setCurrentRole, signInWithPassword, signUpWithPassword, isRealSupabase } = useCare();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("family");
  const [phone, setPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSelectDemoPersona = (role: UserRole, targetRoute: string) => {
    setCurrentRole(role);
    router.push(targetRoute);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const res = await signInWithPassword(email, password);
        if (res.success) {
          setSuccessMessage("Authentication successful. Redirecting...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 600);
        } else {
          setErrorMessage(res.error || "Invalid email or password.");
        }
      } else {
        const res = await signUpWithPassword({
          email,
          password,
          full_name: fullName,
          role: signupRole,
          phone: phone || undefined,
          emergency_contact_name: emergencyContactName || undefined,
          emergency_contact_phone: emergencyContactPhone || undefined,
        });

        if (res.success) {
          setSuccessMessage("Account created successfully. You may now sign in.");
          setMode("login");
        } else {
          setErrorMessage(res.error || "Registration failed. Please check your details.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            CareOS Access Portal
          </h1>
          <p className="text-xs text-slate-500">
            {isRealSupabase
              ? "Live PostgreSQL & Supabase Auth Protected"
              : "Dual-Mode Resilience • Standard / Demo Environment"}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === "signup"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Notification alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["elderly", "family", "caretaker"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSignupRole(r)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold capitalize border transition-all text-center ${
                        signupRole === r
                          ? "bg-teal-700 text-white border-teal-700"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {r === "elderly" ? "Patient" : r}
                    </button>
                  ))}
                </div>
              </div>

              {signupRole === "elderly" && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. David Vance (Son)"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 987-6543"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="name@careos.health"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>
              {isLoading
                ? "Processing..."
                : mode === "login"
                ? "Sign In with Credentials"
                : "Register Account"}
            </span>
          </button>
        </form>

        {/* 1-Click Fast Persona Evaluator */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              Or Instant Demo Evaluation
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSelectDemoPersona("elderly", "/patient/dashboard")}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/70 hover:border-teal-400 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Ram Sharma</h4>
                <p className="text-[11px] text-slate-500">Patient • High-Readability Accessible Dashboard</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => handleSelectDemoPersona("family", "/family/dashboard")}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                PS
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Priya Sharma</h4>
                <p className="text-[11px] text-slate-500">Family Member • FamilyCare Monitoring Dashboard</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            type="button"
            onClick={() => handleSelectDemoPersona("caretaker", "/caretaker/dashboard")}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                SS
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Sister Sunita, RN</h4>
                <p className="text-[11px] text-slate-500">Clinical Caregiver • Operations & MAR Dashboard</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-teal-700" />
          <span>Role-Based Access Control • Server-Enforced RBAC</span>
        </div>
      </div>
    </div>
  );
}
