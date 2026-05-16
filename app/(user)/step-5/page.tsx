"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Step5KuesionerSkala() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // PROTEKSI: Pastikan sudah mengisi identitas dan kuesioner pemahaman
    const respondentData = localStorage.getItem("respondent_data");
    const answersStep4 = localStorage.getItem("answers_data");

    if (!respondentData || !answersStep4) {
      router.push("/step-1");
      return;
    }

    // Tarik data session jika user pernah mengisi tapi me-refresh halaman
    const savedAnswers = localStorage.getItem("answers_skala");
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Gagal memuat jawaban skala lama", e);
      }
    }

    fetchScaleQuestions();
  }, [router]);

  async function fetchScaleQuestions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("type", "skala")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) setQuestions(data);
    } catch (err) {
      console.error("Error fetching scale questions:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !answers[q.id]);

    if (unanswered.length > 0) {
      alert(
        `Mohon lengkapi semua jawaban. Ada ${unanswered.length} pernyataan yang belum dijawab.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      localStorage.setItem("answers_skala", JSON.stringify(answers));
      router.push("/step-6"); // Menuju ke Step 6 (Tingkat Kepastian / Confirmation)
    } catch (error) {
      console.error("Gagal menyimpan ke session:", error);
      alert("Terjadi kesalahan saat menyimpan jawaban skala.");
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
        {/* KARTU DARK GLASS */}
        <div className="bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 rounded-[32px] md:rounded-[48px] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-full">
          {/* --- SIDEBAR PROGRESS & PETUNJUK --- */}
          <div className="w-full md:w-[32%] bg-[#080c1d]/90 p-8 md:p-10 text-white flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => router.back()}
                  className="mb-2 flex items-center gap-2 text-[9px] font-sans font-black uppercase text-blue-400/60 tracking-[0.3em] hover:text-white transition-colors w-fit"
                >
                  ← Kembali
                </button>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-800/50 shadow-inner w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  <span className="text-blue-300 font-sans text-[10px] font-black uppercase tracking-[0.3em]">
                    Step 05/06
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans font-bold uppercase tracking-[0.2em] mt-4">
                  Petunjuk Pengisian:
                </p>
              </div>

              {/* ISI PETUNJUK */}
              <div className="p-5 bg-blue-950/10 border border-blue-900/20 rounded-[24px] text-slate-300 space-y-4 shadow-inner">
                <p className="text-xs text-justify opacity-90 leading-relaxed">
                  Berikut ini terdapat sejumlah pernyataan yang berkaitan dengan
                  pandangan dan keyakinan Anda. Tidak ada jawaban benar atau
                  salah. Jawablah setiap pernyataan sesuai dengan pendapat,
                  keyakinan, dan pengalaman Anda secara jujur.
                </p>

                <div className="p-4 bg-black/40 rounded-xl border border-slate-800/60 space-y-3">
                  <p className="font-bold text-blue-400 text-[9px] font-sans uppercase tracking-[0.15em]">
                    Skala Penilaian:
                  </p>
                  <div className="flex flex-col gap-2 font-sans text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-900/30 text-blue-400 border border-blue-800/50">
                        1
                      </span>{" "}
                      Pasti tidak benar
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-900/30 text-blue-400 border border-blue-800/50">
                        2
                      </span>{" "}
                      Mungkin tidak benar
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-900/30 text-blue-400 border border-blue-800/50">
                        3
                      </span>{" "}
                      Ragu-ragu / tidak pasti
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-900/30 text-blue-400 border border-blue-800/50">
                        4
                      </span>{" "}
                      Mungkin benar
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-900/30 text-blue-400 border border-blue-800/50">
                        5
                      </span>{" "}
                      Pasti benar
                    </div>
                  </div>
                </div>
                <p className="text-[10px] italic text-red-200/80 text-justify">
                  * Mohon untuk membaca setiap pernyataan dengan cermat dan
                  menjawab seluruh pertanyaan tanpa melewatkan satu pun item.
                </p>
              </div>
            </div>

            {/* Widget Progress Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 shrink-0">
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
              </div>
            </div>
          </div>

          {/* --- SOAL AREA (MODERN, CLEAN, SLIM) --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent relative">
            <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 space-y-5 md:space-y-6 custom-scrollbar scroll-smooth">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 animate-pulse">
                  <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-xs font-sans font-bold uppercase tracking-widest">
                    Memuat Butir Kuesioner...
                  </span>
                </div>
              ) : questions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <span className="text-4xl mb-2">⚠️</span>
                  <p className="text-sm font-sans font-bold uppercase tracking-widest">
                    Belum Ada Soal
                  </p>
                  <p className="text-xs italic">
                    Tidak ada soal tipe "skala" yang ditemukan di database.
                  </p>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="p-5 md:p-6 bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-3xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:border-slate-600 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Tampilan Pertanyaan */}
                    <div className="flex gap-3 md:gap-4 items-start">
                      <span className="w-6 h-6 md:w-8 md:h-8 mt-0.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[10px] md:text-xs font-bold text-slate-400 font-sans shrink-0 shadow-inner">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <p className="text-xs md:text-[14px] font-bold text-slate-100 leading-relaxed pt-1">
                        {q.question_text}
                      </p>
                    </div>

                    {/* Pilihan Jawaban Skala 1-5 */}
                    <div className="pl-0 md:pl-12">
                      {q.answer_type === "scale" && (
                        <div className="space-y-2.5 max-w-lg mx-auto md:mx-0">
                          <div className="flex justify-between items-center bg-black/40 px-3 py-2 md:px-4 md:py-2.5 rounded-full border border-slate-800/80 shadow-inner">
                            {[1, 2, 3, 4, 5].map((num) => {
                              const isSelected =
                                answers[q.id] === num.toString();
                              return (
                                <button
                                  key={num}
                                  onClick={() =>
                                    handleSelectAnswer(q.id, num.toString())
                                  }
                                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full font-black transition-all duration-300 flex items-center justify-center text-[11px] md:text-sm font-sans ${
                                    isSelected
                                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110 border border-blue-400/50"
                                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600"
                                  }`}
                                >
                                  {num}
                                </button>
                              );
                            })}
                          </div>

                          {/* Label Skala Kiri-Kanan */}
                          <div className="flex justify-between px-3 text-[8px] md:text-[9px] font-bold text-slate-500 tracking-widest font-sans">
                            <span className="w-20 text-center">
                              Pasti
                              <br />
                              Tidak Benar
                            </span>
                            <span className="w-20 text-center">
                              Pasti
                              <br />
                              Benar
                            </span>
                          </div>
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
                  {submitting ? "Menyimpan..." : "Simpan & Lanjut"}
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
