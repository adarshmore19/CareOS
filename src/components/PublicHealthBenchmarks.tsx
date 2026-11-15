"use client";

import React, { useState, useEffect } from "react";
import { PublicHealthIndicator } from "@/app/api/external/public-health/route";
import { Activity, BookOpen, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";

export function PublicHealthBenchmarks() {
  const [indicators, setIndicators] = useState<PublicHealthIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/external/public-health")
      .then((res) => res.json())
      .then((data) => {
        setIndicators(data.indicators || []);
      })
      .catch((err) => console.error("Failed to load public health data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
        <span>Loading WHO & MoHFW public health benchmarks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <span>Verified Public Health Benchmarks & Evidence</span>
          </h3>
          <p className="text-xs text-slate-500">
            Epidemiological indicators from the World Health Organization (WHO), ICMR, and NFHS-5
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indicators.map((ind) => (
          <div
            key={ind.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {ind.region} • {ind.year}
                </span>
                <span className="text-2xl font-black text-teal-800 tracking-tight">
                  {ind.value}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mt-2">{ind.indicator_name}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ind.methodology}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-600 truncate max-w-[240px]">
                {ind.provenance.source_name}
              </span>
              <a
                href={ind.provenance.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 shrink-0"
              >
                <span>Official Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

