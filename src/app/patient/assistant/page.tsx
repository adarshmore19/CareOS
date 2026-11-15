"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Loader2,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function PatientAssistantPage() {
  const { activePatient, events, appointments } = useCare();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const suggestedQuestions = [
    "What medicines do I have scheduled for today?",
    "Have I taken my morning medicines?",
    "When is my next doctor appointment?",
    "Who is my assigned caregiver?",
    "What is my adherence compliance score?",
  ];

  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is supported in Google Chrome, Edge, and Android browsers.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleAsk(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleAsk = async (questionText?: string) => {
    const q = questionText || query;
    if (!q.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q.trim(),
          role: "elderly",
          events,
          appointments,
        }),
      });

      const data = await res.json();
      const answer = data.answer || "I checked your healthcare records for today.";
      setResponse(answer);
      handleSpeak(answer);
    } catch (err: any) {
      setResponse("I could not reach the healthcare voice service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
          Voice-Enabled Healthcare Assistant
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
          CareVoice Assistant
        </h1>
        <p className="text-lg text-slate-700 font-medium mt-1">
          Ask questions aloud or tap on any suggested question below.
        </p>
      </div>

      {/* Voice Interaction Hero Box */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border-3 border-teal-300 shadow-md text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Tap Microphone to Speak
          </span>
          <div className="flex justify-center">
            <button
              onClick={handleToggleVoiceInput}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-lg touch-target ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse ring-8 ring-rose-200"
                  : "bg-teal-700 hover:bg-teal-800 text-white ring-8 ring-teal-100"
              }`}
              aria-label="Toggle microphone speech recognition"
            >
              {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </button>
          </div>
          <p className="text-sm font-bold text-slate-600 pt-2">
            {isListening ? "Listening... Speak your question now" : "Press the big green button and speak"}
          </p>
        </div>

        {/* Text Input Fallback */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex gap-2 max-w-xl mx-auto pt-2"
        >
          <input
            type="text"
            placeholder="Or type your question here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-300 text-base focus:border-teal-700 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base flex items-center gap-2 disabled:opacity-50 touch-target"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>Ask</span>
          </button>
        </form>

        {/* Spoken Response Box */}
        {response && (
          <div className="p-6 rounded-2xl bg-teal-50 border-2 border-teal-300 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>CareVoice Spoken Answer</span>
              </span>

              <button
                onClick={() => handleSpeak(response)}
                className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1"
              >
                {speaking ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4" />}
                <span>{speaking ? "Stop" : "Replay"}</span>
              </button>
            </div>

            <p className="text-lg text-slate-900 font-semibold leading-relaxed">
              {response}
            </p>
          </div>
        )}
      </div>

      {/* Suggested Questions Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg text-slate-900">Suggested Questions You Can Tap:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleAsk(q);
              }}
              className="p-4 rounded-2xl bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 text-left transition-all text-base font-bold text-slate-800 flex items-center justify-between group touch-target"
            >
              <span>{q}</span>
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

