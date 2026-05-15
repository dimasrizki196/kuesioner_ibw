"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Step4Kuesioner() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const surveyType = localStorage.getItem("survey_type");
    const respondentId = localStorage.getItem("respondent_id");

    if (!surveyType || !respondentId) {
      router.push("/step-1");
      return;
    }

    fetchQuestions(surveyType);
  }, []);

  async function fetchQuestions(type: string) {
    setLoading(true);
    try {
      // Mengambil soal yang tipe datanya sama dengan hasil undian narasi
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) setQuestions(data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleMultiChoice = (questionId: string, optionText: string) => {
    setAnswers((prev) => {
      const currentAnswerStr = prev[questionId] || "";
      const currentAnswers = currentAnswerStr
        ? currentAnswerStr.split("|")
        : [];

      if (currentAnswers.includes(optionText)) {
        const updated = currentAnswers.filter((ans) => ans !== optionText);
        return { ...prev, [questionId]: updated.join("|") };
      } else {
        const updated = [...currentAnswers, optionText];
        return { ...prev, [questionId]: updated.join("|") };
      }
    });
  };

  const handleSubmit = () => {
    // Validasi apakah semua soal sudah dijawab
    const unanswered = questions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === "",
    );
    if (unanswered.length > 0) {
      alert(
        `Mohon lengkapi semua jawaban. Ada ${unanswered.length} soal yang terlewat.`,
      );
      return;
    }

    setSubmitting(true);

    // SIMPAN KE LOCALSTORAGE (Sistem Session)
    // Jawaban ini akan dikumpulkan dan dikirim di Step terakhir (Step 6)
    try {
      localStorage.setItem("answers_data", JSON.stringify(answers));

      // Meluncur ke Step 5 (Kuesioner Skala Utama)
      router.push("/step-5");
    } catch (error) {
      console.error("Gagal menyimpan ke session:", error);
      alert("Terjadi kesalahan saat menyimpan jawaban.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden font-serif selection:bg-blue-500/20">
      {/* BACKGROUND DEEP SPACE PURE CODING */}
      <div className="fixed inset-0 z-0 bg-[#000105]">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[60vh] h-[60vh] bg-sky-900 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[60vh] h-[60vh] bg-indigo-950 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg md:max-w-7xl my-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-slate-950/40 backdrop-blur-3xl border border-slate-800 rounded-[40px] md:rounded-[50px] shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row h-full md:h-[85vh]">
          {/* --- SIDEBAR PROGRESS --- */}
          <div className="w-full md:w-[25%] bg-[#080c1d]/90 p-8 md:p-10 text-white flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-700">
            <div>
              <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase text-blue-400/60 tracking-[0.3em] hover:text-white transition-colors font-serif"
              >
                ← Kembali
              </button>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">
                Step 04/05
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-[0.9] italic mb-4 tracking-tighter">
                LEMBAR <br /> KUESIONER
              </h1>
              <p className="text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                Analisis Kognitif
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <div className="p-5 md:p-6 bg-slate-900/50 rounded-[24px] border border-slate-800">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-3">
                  Progress Pengerjaan
                </p>
                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{
                      width: `${questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-right mt-3 text-blue-400 font-bold italic">
                  {Object.keys(answers).length} dari {questions.length} Soal
                </p>
              </div>
            </div>
          </div>

          {/* --- SOAL AREA --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <div className="flex-1 overflow-y-auto p-8 md:p-14 lg:p-16 space-y-12 md:space-y-16 custom-scrollbar scroll-smooth">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-sm animate-pulse">
                  Sinkronisasi butir pertanyaan...
                </div>
              ) : questions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <p className="italic text-center text-sm max-w-md">
                    Tidak ada soal yang ditemukan untuk sesi Anda.
                  </p>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="space-y-6 md:space-y-8 animate-in fade-in duration-700"
                  >
                    <div className="flex gap-4 md:gap-6 items-start">
                      <span className="text-3xl md:text-5xl font-black text-slate-800 italic shrink-0 leading-none">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <p className="text-sm md:text-lg font-bold text-white leading-relaxed pt-1 md:pt-2">
                        {q.question_text}
                      </p>
                    </div>

                    <div className="pl-10 md:pl-[4.5rem]">
                      {q.answer_type === "multiple_choice" &&
                        Array.isArray(q.options) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt: any, i: number) => {
                              const isSelected = (answers[q.id] || "")
                                .split("|")
                                .includes(opt.text);
                              return (
                                <button
                                  key={i}
                                  onClick={() =>
                                    handleToggleMultiChoice(q.id, opt.text)
                                  }
                                  className={`p-5 rounded-[24px] text-left text-sm font-bold border-2 transition-all flex items-start md:items-center gap-4 ${
                                    isSelected
                                      ? "bg-blue-900/30 border-blue-600 text-blue-200 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                                      : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 mt-0.5 md:mt-0 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"}`}
                                  >
                                    {isSelected && (
                                      <span className="text-white text-xs">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                  <span className="leading-relaxed">
                                    {opt.text}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* --- ACTION BUTTON --- */}
            <div className="p-8 md:p-10 lg:p-12 bg-black/60 border-t border-slate-800 shrink-0">
              <button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  Object.keys(answers).length < questions.length ||
                  questions.length === 0
                }
                className="group relative w-full py-6 md:py-7 bg-white text-black rounded-[28px] font-black uppercase tracking-[0.4em] text-[11px] md:text-[12px] shadow-2xl disabled:opacity-20 transition-all active:scale-95 overflow-hidden flex items-center justify-center gap-3"
              >
                <span className="relative z-10 italic">
                  {submitting ? "Menyimpan Sementara..." : "Simpan & Lanjutkan"}
                </span>
                {!submitting &&
                  Object.keys(answers).length >= questions.length &&
                  questions.length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
