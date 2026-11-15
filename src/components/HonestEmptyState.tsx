"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, AlertCircle, Plus, Bluetooth, RefreshCw } from "lucide-react";

interface HonestEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  badge?: string;
}

export function HonestEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon: Icon = AlertCircle,
  badge = "Authentic State • Zero Fabricated Data",
}: HonestEmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-slate-700" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-3">
        <ShieldAlert className="w-3.5 h-3.5 text-teal-700" />
        <span>{badge}</span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-6 flex justify-center">
          {actionHref ? (
            <Link
              href={actionHref}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

