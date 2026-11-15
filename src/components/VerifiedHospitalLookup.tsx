"use client";

import React, { useState } from "react";
import { VerifiedFacility } from "@/lib/types";
import { Search, Building2, MapPin, ShieldCheck, Loader2, Navigation } from "lucide-react";

interface VerifiedHospitalLookupProps {
  onSelectFacility: (facility: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    source: string;
  }) => void;
}

export function VerifiedHospitalLookup({ onSelectFacility }: VerifiedHospitalLookupProps) {
  const [city, setCity] = useState("Delhi");
  const [customSearch, setCustomSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState<VerifiedFacility[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const q = customSearch.trim() || `hospital in ${city}`;
      const res = await fetch(`/api/external/hospitals?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setFacilities(data.facilities || []);
    } catch (err) {
      console.error("Facility search error:", err);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <div>
        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Verified Healthcare Facility Directory</span>
        </h4>
        <p className="text-[11px] text-slate-500">
          Query authenticated hospital, clinic, and medical center locations with real addresses
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex gap-2">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
          >
            <option value="Delhi">Delhi / NCR</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Pune">Pune</option>
          </select>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by facility name or hospital (e.g. AIIMS, Apollo, Fortis)..."
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700 focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Building2 className="w-3.5 h-3.5" />}
            <span>Find Facilities</span>
          </button>
        </div>
      </form>

      {loading && (
        <div className="py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
          <span>Searching verified OpenStreetMap & Government healthcare directory...</span>
        </div>
      )}

      {!loading && hasSearched && facilities.length === 0 && (
        <p className="text-xs text-slate-500 py-2 text-center">
          No verified medical facilities found for the current query.
        </p>
      )}

      {!loading && facilities.length > 0 && (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Verified Healthcare Centers ({facilities.length}):
          </span>
          {facilities.map((fac) => (
            <div
              key={fac.id}
              onClick={() => {
                onSelectFacility({
                  name: fac.name,
                  address: fac.address,
                  latitude: fac.latitude,
                  longitude: fac.longitude,
                  source: "OpenStreetMap Verified Healthcare Registry",
                });
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 cursor-pointer transition-all flex items-start justify-between gap-3 group"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{fac.name}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{fac.address}</span>
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
