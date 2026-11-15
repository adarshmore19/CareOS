"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  CheckCheck,
  Filter,
} from "lucide-react";
import { HonestEmptyState } from "@/components/HonestEmptyState";

export default function FamilyNotificationsPage() {
  const { notifications, markNotificationRead } = useCare();
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "critical") return n.type === "critical" || n.priority === "high" || n.priority === "urgent";
    return true;
  });

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.is_read) markNotificationRead(n.id);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-teal-600" />
            <span>Alert Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Family Care Alerts & Updates
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Real-time notifications for medication adherence, critical delays, and caregiver updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === "all"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
            filter === "unread"
              ? "bg-teal-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter("critical")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            filter === "critical"
              ? "bg-rose-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Critical Only
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <HonestEmptyState
          title="No Notifications Found"
          description={
            filter === "unread"
              ? "All notifications have been acknowledged."
              : "No alert records match your current filter."
          }
          icon={Bell}
          badge="Zero Fabricated Alerts"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isCritical = item.type === "critical" || item.priority === "high" || item.priority === "urgent";
            const isRead = item.is_read;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  isRead
                    ? "bg-white border-slate-200 opacity-75"
                    : isCritical
                    ? "bg-rose-50/60 border-rose-200 shadow-xs"
                    : "bg-teal-50/40 border-teal-200 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isCritical
                        ? "bg-rose-100 text-rose-700"
                        : isRead
                        ? "bg-slate-100 text-slate-500"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {isCritical ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                      )}
                      {isCritical && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800">
                          CRITICAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.created_at ? new Date(item.created_at).toLocaleString() : "Recent"}</span>
                    </div>
                  </div>
                </div>

                {!isRead && (
                  <button
                    onClick={() => markNotificationRead(item.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-white border border-slate-200 transition-colors shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
