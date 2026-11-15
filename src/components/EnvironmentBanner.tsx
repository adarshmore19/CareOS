"use client";

import React from "react";
import { useCare } from "@/context/CareContext";
import { ShieldCheck, AlertTriangle, ArrowRightLeft, Database } from "lucide-react";

export function EnvironmentBanner() {
  const { dataMode, setDataMode } = useCare();

  return (
    <div className={`text-xs py-2 px-4 border-b flex flex-wrap items-center justify-between gap-3 ${
      dataMode === "demo"
        ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-teal-50 border-teal-200 text-teal-950"
    }`}>
      <div className="flex items-center gap-2">
        {dataMode === "demo" ? (
          <>
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Development Fixture Mode:</strong> Displaying synthetic test records (Eleanor Vance, Dr. Jenkins). These are NOT real patients or medical records.
            </span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong>Authentic Production Mode:</strong> Operating strictly on verified real-world APIs, authentic patient entries, and honest empty states.
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDataMode(dataMode === "demo" ? "authentic" : "demo")}
          className={`px-3 py-1 rounded-md font-bold text-[11px] transition-colors flex items-center gap-1.5 shadow-xs ${
            dataMode === "demo"
              ? "bg-amber-800 hover:bg-amber-900 text-white"
              : "bg-teal-800 hover:bg-teal-900 text-white"
          }`}
          title="Toggle between synthetic development fixtures and authentic clean slate"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>
            {dataMode === "demo" ? "Switch to Authentic Clean Slate" : "Load Demo Fixtures"}
          </span>
        </button>
      </div>
    </div>
  );
}
