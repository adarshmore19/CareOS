"use client";

import React, { useState, useEffect } from "react";
import { EmergencyContactEntry } from "@/lib/types";
import { PhoneCall, ShieldCheck, ExternalLink, Clock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export function OfficialEmergencyDirectory() {
  const [services, setServices] = useState<EmergencyContactEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/external/emergency")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services || []);
      })
      .catch((err) => console.error("Failed to load emergency directory:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
        <span>Loading official government emergency registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <span>Government of India Official Emergency Helplines</span>
          </h3>
          <p className="text-xs text-slate-500">
            Verified, toll-free emergency medical and eldercare lifelines
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
          Source: MoHFW & MHA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                      {svc.phone_number}
                    </span>
                    {svc.is_toll_free && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Toll-Free
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{svc.name}</h4>
                </div>

                <a
                  href={`tel:${svc.phone_number}`}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{svc.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{svc.hours}</span>
              </div>
              <span className="text-slate-400 line-clamp-1">{svc.official_authority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

