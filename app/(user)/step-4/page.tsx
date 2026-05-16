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
    // PROTEKSI: Pastikan sudah lewat step narasi
    const surveyType = localStorage.getItem("survey_type");
    const respondentId = localStorage.getItem("respondent_id");

    if (!surveyType || !respondentId) {
      router.push("/step-1");
      return;
    }

    // FITUR BARU: Tarik data jawaban jika sebelumnya sudah mengisi lalu me-refresh
    const savedAnswers = localStorage.getItem("answers_data");
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Gagal memuat jawaban lama", e);
      }
    }

    fetchQuestions(surveyType);
  }, [router]);

  async function fetchQuestions(type: string) {
    setLoading(true);
    try {
      // Mengambil soal pemahaman narasi berdasarkan tipe
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

  // FUNGSI DIPERBARUI: Single Choice & Auto-Save
  const handleSelectOption = (questionId: string, optionText: string) => {
    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [questionId]: optionText, // Langsung menimpa jawaban lama
      };

      // Simpan langsung ke session (localStorage) secara real-time
      localStorage.setItem("answers_data", JSON.stringify(updatedAnswers));

      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    // Validasi apakah semua soal sudah dijawab
    const unanswered = questions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === "",
    );
    if (unanswered.length > 0) {
      alert(
        `Mohon lengkapi semua jawaban. Ada ${unanswered.length} soal yang belum terjawab.`,
      );
      return;
    }

    setSubmitting(true);

    try {
      // Data sebenarnya sudah di-auto-save setiap klik,
      // tapi kita set ulang untuk memastikan tidak ada yang terlewat.
      localStorage.setItem("answers_data", JSON.stringify(answers));

      // Lanjut ke Step 5 (Kuesioner Skala Utama)
      router.push("/step-5");
    } catch (error) {
      console.error("Gagal menyimpan ke session:", error);
      alert("Terjadi kesalahan saat melanjutkan halaman.");
      setSubmitting(false);
    }
  };

  const progressPercentage =
    questions.length > 0
      ? (Object.keys(answers).length / questions.length) * 100
      : 0;
  const isCompleted =
    Object.keys(answers).length === questions.length && questions.length > 0;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden selection:bg-blue-500/20 font-serif">
      {/* BACKGROUND DEEP SPACE NAVY X WARM COFFEE GLOW */}
      <div className="fixed inset-0 z-0 bg-[#020514] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[75vh] h-[75vh] bg-sky-600 rounded-full blur-[140px] opacity-20 mix-blend-screen"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[80vh] h-[80vh] bg-gradient-to-tr from-amber-700 via-orange-900 to-transparent rounded-full blur-[130px] opacity-25 mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-yellow-950/20 rounded-full blur-[120px]"></div>

        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none">
          <div className="absolute top-[20%] right-[12%] w-16 h-24 bg-[#3d251e] rounded-[50%] rotate-45 opacity-40 blur-[2px] shadow-2xl">
            <div className="absolute top-[5%] left-1/2 w-[2px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>
          <div className="absolute top-[55%] right-[22%] w-12 h-16 bg-[#4e342e] rounded-[50%] -rotate-12 opacity-30 blur-[1px]">
            <div className="absolute top-[5%] left-1/2 w-[2px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>
          <div className="absolute bottom-[15%] right-[8%] w-24 h-32 bg-[#2b1814] rounded-[50%] rotate-[110deg] opacity-50 drop-shadow-2xl">
            <div className="absolute top-[5%] left-1/2 w-[3px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-amber-950/20 backdrop-blur-[1px]"></div>
      </div>

      {/* CONTAINER UTAMA */}
      <div className="relative z-10 w-full max-w-7xl h-full md:h-[85vh] my-auto animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 rounded-[32px] md:rounded-[48px] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-full">
          {/* --- SIDEBAR PROGRESS --- */}
          <div className="w-full md:w-[28%] bg-[#080c1d]/90 p-8 md:p-12 text-slate-100 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80">
            <div className="space-y-4 md:space-y-6">
              <button
                onClick={() => router.back()}
                className="mb-2 flex items-center gap-2 text-[9px] font-sans font-black uppercase text-blue-400/60 tracking-[0.3em] hover:text-white transition-colors w-fit"
              >
                ← Kembali
              </button>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-800/50 shadow-inner w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-blue-300 font-sans text-[10px] font-black uppercase tracking-[0.3em]">
                  Step 04/06
                </span>
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-2 italic drop-shadow-md text-white">
                  LEMBAR <br /> SOAL
                </h1>
                <p className="text-slate-400 text-[11px] font-sans font-bold uppercase tracking-[0.2em] leading-relaxed mt-4">
                  Uji Pemahaman Narasi
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/60">
              <div className="p-5 md:p-6 bg-slate-900/40 rounded-[24px] border border-slate-800/50 shadow-inner">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[9px] font-sans text-slate-500 font-black uppercase tracking-widest">
                    Status Pengerjaan
                  </p>
                  <p
                    className={`text-[10px] font-sans font-black tracking-widest ${isCompleted ? "text-green-400" : "text-blue-400"}`}
                  >
                    {Object.keys(answers).length} / {questions.length}
                  </p>
                </div>

                <div className="h-1.5 w-full bg-slate-800/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${isCompleted ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {isCompleted && (
                  <p className="text-[9px] text-green-400/80 font-sans font-bold uppercase tracking-widest mt-4 text-center animate-in fade-in">
                    ✓ Semua soal terjawab
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* --- SOAL AREA (SCROLLABLE - COMPACT DESIGN) --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent relative">
            <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 space-y-8 md:space-y-10 custom-scrollbar scroll-smooth">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 animate-pulse">
                  <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-xs font-sans font-bold uppercase tracking-widest">
                    Sinkronisasi Butir Pertanyaan...
                  </span>
                </div>
              ) : questions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <svg
                    className="w-12 h-12 text-slate-600 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-sans font-bold uppercase tracking-widest">
                    Belum Ada Soal
                  </p>
                  <p className="text-xs italic">
                    Hubungi peneliti untuk mengonfigurasi database.
                  </p>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-6 border-b border-slate-800/40 last:border-0 last:pb-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Header Soal - Lebih Compact */}
                    <div className="flex gap-4 md:gap-5 items-start">
                      <span className="text-2xl md:text-4xl font-black text-slate-700/60 italic shrink-0 leading-none select-none mt-1">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <p className="text-sm md:text-base font-bold text-white leading-relaxed pt-0.5 md:pt-1">
                        {q.question_text}
                      </p>
                    </div>

                    {/* Opsi Jawaban (Single Choice - Compact Padding) */}
                    <div className="pl-10 md:pl-14">
                      {q.answer_type === "multiple_choice" &&
                        Array.isArray(q.options) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
                            {q.options.map((opt: any, i: number) => {
                              const isSelected = answers[q.id] === opt.text; // Logika Exact Match

                              return (
                                <button
                                  key={i}
                                  onClick={() =>
                                    handleSelectOption(q.id, opt.text)
                                  }
                                  className={`p-3.5 md:p-4 rounded-xl md:rounded-2xl text-left text-xs md:text-[13px] font-sans font-bold border transition-all duration-300 flex items-start gap-3.5 group ${
                                    isSelected
                                      ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/50"
                                      : "bg-slate-900/40 border-slate-700/80 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50"
                                  }`}
                                >
                                  {/* Radio Button Indicator Custom */}
                                  <div
                                    className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                                      isSelected
                                        ? "border-blue-500 bg-slate-900"
                                        : "border-slate-600 bg-slate-800 group-hover:border-slate-400"
                                    }`}
                                  >
                                    {/* Titik Biru di tengah Radio Button */}
                                    <div
                                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        isSelected
                                          ? "bg-blue-500 scale-100"
                                          : "bg-transparent scale-0"
                                      }`}
                                    />
                                  </div>
                                  <span className="leading-relaxed pt-0.5">
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

            {/* --- ACTION FOOTER --- */}
            <div className="p-6 md:p-8 lg:p-10 border-t border-slate-800/80 bg-black/40 shrink-0 backdrop-blur-md">
              <button
                onClick={handleSubmit}
                disabled={submitting || !isCompleted}
                className={`group relative w-full py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-sans font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] shadow-2xl transition-all overflow-hidden flex items-center justify-center gap-3 ${
                  isCompleted && !submitting
                    ? "bg-white text-black active:scale-[0.98] hover:bg-slate-200 cursor-pointer"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50"
                }`}
              >
                <span className="relative z-10 italic">
                  {submitting ? "Memproses..." : "Simpan & Lanjutkan"}
                </span>

                {!submitting && isCompleted && (
                  <svg
                    className="w-4 h-4 relative z-10 text-amber-500 group-hover:text-blue-600 transform group-hover:translate-x-2 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}

                {!submitting && isCompleted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
