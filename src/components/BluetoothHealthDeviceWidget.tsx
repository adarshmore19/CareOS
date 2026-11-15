"use client";

import React, { useState } from "react";
import { isBluetoothSupported, connectHeartRateMonitor, disconnectHealthDevice, BluetoothDeviceSession } from "@/lib/devices/bluetooth";
import { Activity, Bluetooth, BluetoothConnected, BluetoothOff, AlertCircle, Heart, Loader2 } from "lucide-react";

export function BluetoothHealthDeviceWidget() {
  const [session, setSession] = useState<BluetoothDeviceSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [liveBpm, setLiveBpm] = useState<number | null>(null);
  const [lastReadingTime, setLastReadingTime] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supported = isBluetoothSupported();

  const handleConnect = async () => {
    setErrorMessage(null);
    setIsConnecting(true);
    setStatusMessage("Opening Bluetooth device pairing request...");

    try {
      const devSession = await connectHeartRateMonitor(
        (bpm) => {
          setLiveBpm(bpm);
          setLastReadingTime(new Date().toLocaleTimeString());
        },
        () => {
          setSession(null);
          setLiveBpm(null);
          setStatusMessage("Device disconnected.");
        }
      );

      setSession(devSession);
      setStatusMessage(`Connected to ${devSession.device.name || "Bluetooth Health Device"}`);
    } catch (err: any) {
      if (err.name === "NotFoundError") {
        setStatusMessage("Bluetooth pairing cancelled or device not selected.");
      } else {
        setErrorMessage(err.message || "Failed to establish Bluetooth GATT session.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectHealthDevice(session);
    setSession(null);
    setLiveBpm(null);
    setStatusMessage("Device disconnected.");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            session ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-700"
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Bluetooth LE Vital Monitor
            </h3>
            <p className="text-[11px] text-slate-500">
              Standard Bluetooth SIG GATT Heart Rate Service (0x180D)
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
          session
            ? "bg-teal-100 text-teal-800 border border-teal-200"
            : "bg-slate-100 text-slate-600 border border-slate-200"
        }`}>
          {session ? (
            <>
              <BluetoothConnected className="w-3 h-3 text-teal-700" />
              <span>Live Sensor Connected</span>
            </>
          ) : (
            <>
              <BluetoothOff className="w-3 h-3 text-slate-400" />
              <span>Device Disconnected</span>
            </>
          )}
        </span>
      </div>

      {/* Honest Reading Display */}
      {session && liveBpm !== null ? (
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-800">
            <Heart className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>Real-time Heart Rate (Hardware GATT)</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">
            {liveBpm} <span className="text-lg font-bold text-slate-600">BPM</span>
          </div>
          <p className="text-[11px] text-teal-700">
            Last hardware packet received: {lastReadingTime}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
          <p className="text-xs font-medium text-slate-600">
            No active Bluetooth medical sensor connected.
          </p>
          <p className="text-[11px] text-slate-400">
            CareOS operates strictly on authentic hardware readings. No synthetic vitals are fabricated.
          </p>
        </div>
      )}

      {/* Status & Error Messages */}
      {statusMessage && (
        <p className="text-xs text-slate-600 text-center">{statusMessage}</p>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Actions */}
      <div className="pt-1">
        {session ? (
          <button
            onClick={handleDisconnect}
            className="w-full py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <BluetoothOff className="w-3.5 h-3.5" />
            <span>Disconnect Monitor</span>
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting || !supported}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Pairing Bluetooth Sensor...</span>
              </>
            ) : (
              <>
                <Bluetooth className="w-3.5 h-3.5" />
                <span>Connect Bluetooth Health Device</span>
              </>
            )}
          </button>
        )}

        {!supported && (
          <p className="text-[11px] text-amber-700 text-center mt-2">
            Note: Web Bluetooth requires Google Chrome, Edge, or Opera with Bluetooth enabled.
          </p>
        )}
      </div>
    </div>
  );
}

