"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCare } from "@/context/CareContext";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Bot,
  User,
  Wrench,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  toolUsed?: string;
  toolData?: any;
  provider?: string;
  timestamp: string;
}

export default function AssistantPage() {
  const { events, appointments, elderlyProfile } = useCare();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: `Hello Eleanor! I am your CareVoice healthcare companion. You can ask me what medicines you have today, check if your morning pills are confirmed, see your next doctor visit, or ask me to message Nurse Priya.`,
      toolUsed: "system_greeting",
      provider: "carevoice-engine",
      timestamp: "Just now",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceAutoPlay, setVoiceAutoPlay] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Text-to-speech helper
  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && voiceAutoPlay) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Browser speech recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
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
        setInput(transcript);
        handleSendQuery(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          role: "elderly",
          events,
          appointments,
        }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "assistant",
        text: data.answer || "I could not retrieve that information right now.",
        toolUsed: data.toolUsed,
        toolData: data.toolData,
        provider: data.provider,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (voiceAutoPlay && data.answer) {
        speak(data.answer);
      }
    } catch (err) {
      const errMsg: Message = {
        id: "bot-err-" + Date.now(),
        sender: "assistant",
        text: "I am having difficulty connecting to the care service right now. Please try again.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    "What medicines do I need today?",
    "Have I taken my morning medicines?",
    "When is my next doctor appointment?",
    "Show my medication history",
    "Tell my caretaker that I need help with my appointment",
    "What is my PillGuard adherence score?",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>CareVoice • Conversational Healthcare Assistant</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Conversational Health Assistant
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Natural language and voice-enabled access to your medications, schedules, and care team.
          </p>
        </div>

        {/* Audio response toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceAutoPlay(!voiceAutoPlay)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              voiceAutoPlay
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-slate-100 border-slate-300 text-slate-600"
            }`}
          >
            {voiceAutoPlay ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span>Voice Readout: {voiceAutoPlay ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Try Asking:
        </span>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSendQuery(p)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors shadow-2xs"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-2xl ${
                m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                  m.sender === "user" ? "bg-slate-900" : "bg-emerald-600"
                }`}
              >
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-slate-900 text-white rounded-tr-xs"
                      : "bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-xs"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Backend Tool Execution Visualizer */}
                  {m.toolUsed && m.toolUsed !== "system_greeting" && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                      <Wrench className="w-3 h-3 text-teal-600" />
                      <span>Tool Executed:</span>
                      <strong className="text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                        {m.toolUsed}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 px-1">
                  {m.timestamp} {m.provider && `• ${m.provider}`}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs text-slate-500">
                CareVoice is checking your health records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-xl transition-all shadow-xs ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
              title="Speak your question"
              aria-label="Toggle voice input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-600" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? "Listening... speak now" : "Ask about your medicines, appointments, or caregiver..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>

          <div className="mt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>CareVoice executes authorized tools only. It never prescribes drugs or modifies dosages.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
