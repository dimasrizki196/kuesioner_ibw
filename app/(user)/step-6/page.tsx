"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Step6Suspicion() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  // State untuk menandakan kuesioner telah selesai 100%
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Memastikan user memiliki data dari step-step sebelumnya
    const respondentData = localStorage.getItem("respondent_data");
    if (!respondentData) {
      router.push("/step-1");
      return;
    }

    fetchSuspicionQuestions();
  }, []);

  async function fetchSuspicionQuestions() {
    setLoading(true);
    try {
      // Mengambil soal khusus untuk Suspicion Check
      // Pastikan di database Supabase kolom 'type' isinya "suspicion" (huruf kecil)
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("type", "suspicion")
        .order("created_at", { ascending: true });

      if (error) throw error;
      if (data) setQuestions(data);
    } catch (err) {
      console.error("Error fetching suspicion questions:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitFinal = async () => {
    // Validasi soal suspicion (Pastikan tidak kosong)
    const unanswered = questions.filter(
      (q) => !answers[q.id] || answers[q.id].trim() === "",
    );
    if (unanswered.length > 0) {
      alert(
        `Mohon lengkapi jawaban Anda. Ada ${unanswered.length} pertanyaan yang belum dijawab.`,
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. MENGAMBIL SEMUA DATA DARI SESSION (LOCALSTORAGE)
      const startTimeStr = localStorage.getItem("start_time");
      const respondentDataStr = localStorage.getItem("respondent_data");
      const mcAnswersStr = localStorage.getItem("answers_data") || "{}";
      const skalaAnswersStr = localStorage.getItem("answers_skala") || "{}";

      if (!respondentDataStr) throw new Error("Data responden hilang.");

      // 2. MENGHITUNG DURASI TOTAL (dalam Detik)
      const startTime = parseInt(startTimeStr || Date.now().toString());
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

      // 3. MENYIMPAN KE TABEL 'respondents'
      const respondentObj = JSON.parse(respondentDataStr);
      // Tambahkan durasi ke objek responden
      respondentObj.duration_seconds = durationSeconds;

      const { data: respData, error: respError } = await supabase
        .from("respondents")
        .insert([respondentObj])
        .select()
        .single();

      if (respError) throw respError;

      // 4. MENGGABUNGKAN SEMUA JAWABAN (Step 4 + Step 5 + Step 6)
      const allAnswersObj = {
        ...JSON.parse(mcAnswersStr),
        ...JSON.parse(skalaAnswersStr),
        ...answers, // Jawaban suspicion check dari state saat ini
      };

      // Format payload untuk tabel 'answers'
      const answersPayload = Object.keys(allAnswersObj).map((qId) => ({
        respondent_id: respData.id, // Gunakan ID asli dari Supabase yang baru dibuat
        question_id: qId,
        answer_value: allAnswersObj[qId],
      }));

      // 5. MENYIMPAN KE TABEL 'answers'
      const { error: ansError } = await supabase
        .from("answers")
        .insert(answersPayload);
      if (ansError) throw ansError;

      // 6. BERSIHKAN SESSION & TAMPILKAN HALAMAN SELESAI
      localStorage.clear();
      setIsFinished(true);
    } catch (error: any) {
      console.error("Gagal Submit Final:", error);
      alert("Gagal mengirim data akhir: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // TAMPILAN JIKA SUDAH SELESAI (DEBRIEFING)
  // ==========================================
  if (isFinished) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden font-serif selection:bg-blue-500/20">
        <div className="fixed inset-0 z-0 bg-[#000105]">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl bg-slate-950/60 backdrop-blur-3xl border border-blue-900/50 rounded-[40px] shadow-[0_0_80px_rgba(37,99,235,0.2)] p-10 md:p-16 text-center animate-in zoom-in duration-1000">
          <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(37,99,235,0.5)] border border-blue-500/30">
            <span className="text-5xl">✅</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white italic mb-6">
            Terima Kasih!
          </h1>
          <p className="text-slate-300 leading-relaxed mb-8">
            Anda telah berhasil menyelesaikan seluruh rangkaian penelitian ini.
            Partisipasi dan jawaban Anda sangat berharga bagi kelancaran tugas
            akhir kami.
          </p>
          <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 text-left space-y-4">
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">
              Debriefing (Penjelasan)
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sebagai informasi, narasi berita yang Anda baca pada awal
              kuesioner adalah materi manipulasi eksperimen yang dirancang
              khusus untuk keperluan akademis guna melihat respons kognitif.
              Seluruh data Anda telah terenkripsi dan disimpan dengan aman.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-blue-900/30 border border-blue-600/50 text-blue-300 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]"
            >
              Kembali ke Halaman Awal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN KUESIONER SUSPICION CHECK
  // ==========================================
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden font-serif selection:bg-blue-500/20">
      {/* BACKGROUND DEEP SPACE */}
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
                Step 06/06
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-[0.9] italic mb-4 tracking-tighter">
                EVALUASI <br /> AKHIR
              </h1>
              <p className="text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em]">
                Tahap Final
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-[11px] text-blue-200/50 italic leading-relaxed">
                *Ini adalah tahap terakhir. Sistem akan mengirimkan seluruh data
                Anda setelah Anda menekan tombol submit.
              </p>
            </div>
          </div>

          {/* --- SOAL AREA --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <div className="flex-1 overflow-y-auto p-8 md:p-14 lg:p-16 space-y-12 md:space-y-16 custom-scrollbar scroll-smooth">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-sm animate-pulse">
                  Sinkronisasi tahap akhir...
                </div>
              ) : questions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <span className="text-4xl">⚠️</span>
                  <p className="italic text-center text-sm max-w-md">
                    Tidak ada soal tipe "suspicion" yang ditemukan di database.
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
                      {/* RENDER JAWABAN TEXT (ISIAN TERBUKA) */}
                      {q.answer_type === "text" && (
                        <textarea
                          className="w-full p-6 bg-slate-900/50 border-2 border-slate-800 rounded-[28px] focus:bg-black/50 focus:border-blue-500 outline-none transition-all text-sm font-bold text-white placeholder:text-slate-600 min-h-[150px] custom-scrollbar"
                          placeholder="Ketik jawaban Anda di sini dengan jujur..."
                          value={answers[q.id] || ""}
                          onChange={(e) =>
                            handleSelectAnswer(q.id, e.target.value)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* --- ACTION BUTTON (FINAL SUBMIT) --- */}
            <div className="p-8 md:p-10 lg:p-12 bg-black/60 border-t border-slate-800 shrink-0">
              <button
                onClick={handleSubmitFinal}
                disabled={
                  submitting ||
                  Object.keys(answers).length < questions.length ||
                  questions.length === 0
                }
                className="group relative w-full py-6 md:py-7 bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-[0.4em] text-[11px] md:text-[12px] shadow-[0_0_40px_rgba(37,99,235,0.4)] disabled:opacity-30 disabled:bg-slate-800 transition-all active:scale-95 overflow-hidden flex items-center justify-center gap-3"
              >
                <span className="relative z-10 italic">
                  {submitting ? "MENGIRIM SELURUH DATA..." : "SUBMIT KUESIONER"}
                </span>
                {!submitting &&
                  Object.keys(answers).length >= questions.length &&
                  questions.length > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
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
