"use client";

import React, { useState } from "react";
import { VerifiedDrug } from "@/lib/types";
import { Search, Pill, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";

interface VerifiedMedicationLookupProps {
  onSelectDrug: (drug: { name: string; dosage?: string; rxcui: string; source: string }) => void;
}

export function VerifiedMedicationLookup({ onSelectDrug }: VerifiedMedicationLookupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VerifiedDrug[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || searchTerm.length < 2) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/external/drugs?q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      setResults(data.drugs || []);
    } catch (err) {
      console.error("Drug search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>NIH RxNorm Drug Registry Verification</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Query real-world pharmaceutical monographs from the U.S. National Library of Medicine
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type generic or brand name (e.g. Metformin, Lisinopril, Amlodipine)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <button
          type="submit"
          disabled={loading || searchTerm.length < 2}
          className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>Verify Drug</span>
        </button>
      </form>

      {/* Results Dropdown / List */}
      {loading && (
        <div className="py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
          <span>Querying NIH RxNorm REST endpoint...</span>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <p className="text-xs text-slate-500 py-2 text-center">
          No matching medications found in the official RxNorm registry for &quot;{searchTerm}&quot;.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Verified Results ({results.length}):
          </span>
          {results.map((drug) => (
            <div
              key={drug.rxcui}
              onClick={() => {
                onSelectDrug({
                  name: drug.name,
                  rxcui: drug.rxcui,
                  source: "NIH RxNorm Verified Database",
                });
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer transition-all flex items-start justify-between gap-3 group"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                  {drug.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  RxCUI: <span className="font-mono text-slate-700">{drug.rxcui}</span>
                  {drug.dosage_form && <span> • Form: {drug.dosage_form}</span>}
                </div>
              </div>

              <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded group-hover:bg-teal-700 group-hover:text-white transition-colors shrink-0">
                Select
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
