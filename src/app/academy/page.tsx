"use client";

import React, { useState } from "react";
import { useCare } from "@/context/CareContext";
import {
  GraduationCap,
  Volume2,
  VolumeX,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Languages,
  Award,
  ArrowRight,
} from "lucide-react";

export default function AcademyPage() {
  const { articles } = useCare();
  const [selectedLang, setSelectedLang] = useState<"en" | "hi" | "mr">("en");
  const [speaking, setSpeaking] = useState(false);
  const [activeArticleId, setActiveArticleId] = useState(articles[0]?.id || "");
  const [quizAnswers, setQuizAnswers] = useState<{ [quizIndex: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [quizIndex: string]: boolean }>({});

  const filteredArticles = articles.filter((a) => a.language === selectedLang);
  const activeArticle =
    filteredArticles.find((a) => a.id === activeArticleId) || filteredArticles[0] || articles[0];

  const speakAudio = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedLang === "hi") utterance.lang = "hi-IN";
      else if (selectedLang === "mr") utterance.lang = "mr-IN";
      else utterance.lang = "en-US";

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [`${activeArticle.id}-${qIdx}`]: optIdx }));
  };

  const handleSubmitQuiz = (qIdx: number) => {
    setQuizSubmitted((prev) => ({ ...prev, [`${activeArticle.id}-${qIdx}`]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
            <span>Health Academy • Interactive Health Literacy</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient & Family Education
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Verified, accessible health literacy cards and interactive quizzes with full audio read-aloud.
          </p>
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <Languages className="w-4 h-4 text-slate-500 ml-2" />
          <button
            onClick={() => {
              setSelectedLang("en");
              setActiveArticleId(articles.find((a) => a.language === "en")?.id || "");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === "en"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            English
          </button>

          <button
            onClick={() => {
              setSelectedLang("hi");
              setActiveArticleId(articles.find((a) => a.language === "hi")?.id || "");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === "hi"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            हिंदी (Hindi)
          </button>

          <button
            onClick={() => {
              setSelectedLang("mr");
              setActiveArticleId(articles.find((a) => a.language === "mr")?.id || "");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === "mr"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            मराठी (Marathi)
          </button>
        </div>
      </div>

      {/* Main Learning Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Lessons in Language */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Lessons ({filteredArticles.length})</span>
          </h3>

          <div className="space-y-3">
            {filteredArticles.map((art) => (
              <button
                key={art.id}
                onClick={() => {
                  setActiveArticleId(art.id);
                  if (speaking) {
                    window.speechSynthesis?.cancel();
                    setSpeaking(false);
                  }
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeArticle.id === art.id
                    ? "bg-amber-50 border-amber-400 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {art.category.replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {art.language}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-2">{art.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{art.summary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Article Content & Interactive Quiz */}
        <div className="lg:col-span-2 space-y-6">
          {activeArticle && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Article Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                    Healthcare Education
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    {activeArticle.title}
                  </h2>
                </div>

                <button
                  onClick={() => speakAudio(activeArticle.audio_script || activeArticle.content)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-center"
                >
                  {speaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                  <span>{speaking ? "Stop Audio" : "Listen to Lesson"}</span>
                </button>
              </div>

              {/* Lesson Text */}
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base">
                <p>{activeArticle.content}</p>
              </div>

              {/* Key Takeaways */}
              {activeArticle.key_takeaways && (
                <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-5 space-y-2">
                  <h4 className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Key Safety Rules to Remember:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-teal-900">
                    {activeArticle.key_takeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive Quiz */}
              {activeArticle.quiz && activeArticle.quiz.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-6">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <h3 className="text-xl font-bold text-slate-900">Knowledge Check Quiz</h3>
                  </div>

                  {activeArticle.quiz.map((q, qIdx) => {
                    const ansKey = `${activeArticle.id}-${qIdx}`;
                    const userAns = quizAnswers[ansKey];
                    const isSubmitted = quizSubmitted[ansKey];
                    const isCorrect = userAns === q.correctIndex;

                    return (
                      <div key={qIdx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                        <p className="font-bold text-sm text-slate-900">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAns === optIdx;
                            let btnStyle = "bg-white border-slate-300 text-slate-700";

                            if (isSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold";
                              } else if (isSelected && !isCorrect) {
                                btnStyle = "bg-rose-100 border-rose-500 text-rose-950";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-amber-100 border-amber-500 text-amber-950 font-bold";
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {!isSubmitted ? (
                          <button
                            disabled={userAns === undefined}
                            onClick={() => handleSubmitQuiz(qIdx)}
                            className="px-4 py-2 rounded-lg bg-amber-600 disabled:opacity-40 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <div className={`p-3 rounded-xl text-xs ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
                            <strong>{isCorrect ? "Correct! " : "Incorrect. "}</strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
