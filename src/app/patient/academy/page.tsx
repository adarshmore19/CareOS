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
} from "lucide-react";
import { PublicHealthBenchmarks } from "@/components/PublicHealthBenchmarks";

export default function PatientAcademyPage() {
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

      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (quizIdx: number, optionIdx: number) => {
    if (quizSubmitted[quizIdx]) return;
    setQuizAnswers({ ...quizAnswers, [quizIdx]: optionIdx });
  };

  const handleSubmitQuiz = (quizIdx: number) => {
    setQuizSubmitted({ ...quizSubmitted, [quizIdx]: true });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
            Patient Health Education
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2">
            Health Academy
          </h1>
          <p className="text-lg text-slate-700 font-medium mt-1">
            Easy-to-understand health guides, pill safety tips, and knowledge quizzes.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border-2 border-slate-300 self-start sm:self-auto">
          {[
            { code: "en", label: "English" },
            { code: "hi", label: "हिंदी" },
            { code: "mr", label: "मराठी" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                if (speaking) {
                  window.speechSynthesis?.cancel();
                  setSpeaking(false);
                }
                setSelectedLang(lang.code as any);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedLang === lang.code
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Educational Article Content */}
      {activeArticle && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-3 border-teal-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                Lesson of the Day
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
                {activeArticle.title}
              </h2>
              <p className="text-base text-slate-600 font-medium">
                {activeArticle.summary}
              </p>
            </div>

            <button
              onClick={() => speakAudio(activeArticle.audio_script || activeArticle.content)}
              className="px-6 py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-sm transition-colors touch-target shrink-0"
            >
              {speaking ? <VolumeX className="w-6 h-6 text-amber-300" /> : <Volume2 className="w-6 h-6" />}
              <span>{speaking ? "Stop Audio" : "Listen to Lesson"}</span>
            </button>
          </div>

          <div className="text-lg text-slate-800 font-normal leading-relaxed pt-4 border-t border-slate-200">
            {activeArticle.content}
          </div>

          {/* Key Takeaways */}
          {activeArticle.key_takeaways && (
            <div className="p-6 rounded-2xl bg-teal-50/70 border-2 border-teal-200 space-y-3">
              <h3 className="font-bold text-lg text-teal-950">Important Things to Remember:</h3>
              <ul className="space-y-2">
                {activeArticle.key_takeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base text-teal-900 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Knowledge Check Quizzes */}
          {activeArticle.quiz && activeArticle.quiz.length > 0 && (
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-teal-700" />
                <span>Quick Knowledge Check</span>
              </h3>

              {activeArticle.quiz.map((q, qIdx) => {
                const userAns = quizAnswers[qIdx];
                const isSubmitted = quizSubmitted[qIdx];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div key={qIdx} className="p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                    <h4 className="font-bold text-lg text-slate-900">{q.question}</h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === optIdx;
                        return (
                          <button
                            key={optIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`w-full p-4 rounded-xl text-left font-bold text-base border-2 transition-all flex items-center justify-between touch-target ${
                              isSelected
                                ? "bg-teal-700 text-white border-teal-700"
                                : "bg-white text-slate-800 border-slate-300 hover:border-teal-500"
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted ? (
                      <button
                        disabled={userAns === undefined}
                        onClick={() => handleSubmitQuiz(qIdx)}
                        className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white font-bold text-base transition-colors"
                      >
                        Check My Answer
                      </button>
                    ) : (
                      <div className={`p-4 rounded-xl text-base font-medium ${
                        isCorrect ? "bg-emerald-100 text-emerald-950 border border-emerald-300" : "bg-rose-100 text-rose-950 border border-rose-300"
                      }`}>
                        <strong>{isCorrect ? "✓ Well Done! " : "Try again: "}</strong>
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

      {/* Public Health Benchmarks Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <PublicHealthBenchmarks />
      </div>
    </div>
  );
}
