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
  const [activeTab, setActiveTab] = useState("terimakasih");

  useEffect(() => {
    // Memastikan user memiliki data dari step-step sebelumnya
    const respondentData = localStorage.getItem("respondent_data");
    if (!respondentData) {
      router.push("/step-1");
      return;
    }

    // FITUR BARU: Menarik jawaban yang belum di-submit jika user me-refresh halaman
    const savedAnswers = localStorage.getItem("answers_suspicion");
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Gagal memuat jawaban suspicion lama", e);
      }
    }

    fetchSuspicionQuestions();
  }, [router]);

  async function fetchSuspicionQuestions() {
    setLoading(true);
    try {
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

  // FITUR BARU: Auto-save jawaban ke localStorage setiap kali user mengetik
  const handleSelectAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: value };
      // Simpan langsung ke session (localStorage)
      localStorage.setItem("answers_suspicion", JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
  };

  const handleSubmitFinal = async () => {
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
        ...answers,
      };

      // Format payload untuk tabel 'answers'
      const answersPayload = Object.keys(allAnswersObj).map((qId) => ({
        respondent_id: respData.id,
        question_id: qId,
        answer_value: allAnswersObj[qId],
      }));

      // 5. MENYIMPAN KE TABEL 'answers'
      const { error: ansError } = await supabase
        .from("answers")
        .insert(answersPayload);
      if (ansError) throw ansError;

      // 6. BERSIHKAN SESSION & TAMPILKAN HALAMAN SELESAI
      // Ini akan membersihkan semua auto-save sehingga siap untuk responden baru
      localStorage.clear();
      setIsFinished(true);
    } catch (error: any) {
      console.error("Gagal Submit Final:", error);
      alert("Gagal mengirim data akhir: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage =
    questions.length > 0
      ? (Object.keys(answers).length / questions.length) * 100
      : 0;
  const isCompleted =
    Object.keys(answers).length === questions.length && questions.length > 0;

  // ==========================================
  // KOMPONEN BACKGROUND (DEEP SPACE X COFFEE)
  // ==========================================
  const SharedBackground = () => (
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
  );

  // ==========================================
  // TAMPILAN JIKA SUDAH SELESAI (DEBRIEFING)
  // ==========================================
  if (isFinished) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden selection:bg-blue-500/20 font-serif">
        <SharedBackground />

        <div className="relative z-10 w-full max-w-3xl bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.8)] p-8 md:p-12 flex flex-col justify-between min-h-[500px] animate-in fade-in zoom-in-95 duration-700">
          <div className="space-y-8">
            <div className="flex border-b border-slate-800/80 font-sans text-[10px] md:text-xs font-bold tracking-wider uppercase text-slate-500 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab("terimakasih")}
                className={`pb-3 px-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === "terimakasih"
                    ? "border-blue-500 text-white font-black"
                    : "border-transparent hover:text-slate-300 hover:border-slate-700"
                }`}
              >
                01. Apresiasi
              </button>
              <button
                onClick={() => setActiveTab("tujuan")}
                className={`pb-3 px-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === "tujuan"
                    ? "border-blue-500 text-white font-black"
                    : "border-transparent hover:text-slate-300 hover:border-slate-700"
                }`}
              >
                02. Tujuan Riset
              </button>
              <button
                onClick={() => setActiveTab("komitmen")}
                className={`pb-3 px-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === "komitmen"
                    ? "border-amber-500 text-white font-black"
                    : "border-transparent hover:text-slate-300 hover:border-slate-700"
                }`}
              >
                03. Komitmen Privasi
              </button>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed min-h-[200px]">
              {activeTab === "terimakasih" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="font-bold text-white text-base md:text-lg italic leading-snug">
                    Terima kasih atas partisipasi Anda dalam penelitian ini.
                  </p>
                  <p>
                    Perlu kami informasikan bahwa artikel/berita yang Anda baca
                    sebelumnya merupakan materi yang disusun khusus untuk
                    keperluan penelitian{" "}
                    <strong className="text-blue-400">
                      (fabricated/fiktif)
                    </strong>{" "}
                    dan tidak sepenuhnya mencerminkan kejadian nyata.
                  </p>
                  <p>
                    Informasi yang disajikan bertujuan murni sebagai stimulus
                    untuk memahami bagaimana individu memproses dan menilai
                    suatu informasi yang diterima.
                  </p>
                </div>
              )}

              {activeTab === "tujuan" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p>
                    Penelitian ini secara umum bertujuan untuk mengkaji
                    bagaimana paparan terhadap narasi tertentu dapat memengaruhi
                    penilaian, persepsi, serta tingkat kepercayaan individu
                    terhadap suatu informasi, khususnya yang berkaitan dengan
                    isu publik.
                  </p>
                  <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-3 shadow-inner">
                    <p className="font-bold text-blue-400 text-[10px] uppercase font-sans tracking-[0.2em]">
                      Fokus Pengamatan Utama:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300 text-xs md:text-sm">
                      <li>
                        Bagaimana individu menilai kredibilitas informasi.
                      </li>
                      <li>
                        Respon terhadap informasi yang bersifat spekulatif atau
                        belum terverifikasi.
                      </li>
                      <li>
                        Dampak informasi tersebut terhadap cara berpikir dan
                        pengambilan keputusan.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "komitmen" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="p-5 bg-amber-950/10 border-l-4 border-amber-500/80 rounded-r-2xl text-slate-300 shadow-inner">
                    <p className="italic">
                      Kami mohon agar Anda{" "}
                      <strong className="text-amber-400 font-normal">
                        tidak menyebarluaskan
                      </strong>{" "}
                      isi materi yang telah Anda baca sebelumnya, karena materi
                      tersebut dirancang khusus untuk kepentingan penelitian dan
                      berpotensi menimbulkan kesalahpahaman jika disebarkan di
                      luar konteks.
                    </p>
                  </div>
                  <p>
                    Seluruh jawaban yang Anda berikan akan dijaga kerahasiaannya
                    dan hanya digunakan untuk keperluan akademik.
                  </p>
                  <p>
                    Apabila Anda memiliki pertanyaan lebih lanjut terkait
                    penelitian ini, Anda dapat menghubungi peneliti melalui
                    kontak yang telah disediakan di halaman awal.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
            <div className="text-left font-sans text-center sm:text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Penutup
              </p>
              <p className="text-xs font-bold text-slate-300 mt-1 italic">
                Sekali lagi, kami mengucapkan terima kasih.
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="group relative w-full sm:w-auto px-10 py-4 bg-white text-black rounded-2xl font-sans font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-all active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 italic">Selesai & Keluar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden selection:bg-blue-500/20 font-serif">
      <SharedBackground />

      <div className="relative z-10 w-full max-w-7xl h-full md:h-[85vh] my-auto animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 rounded-[32px] md:rounded-[48px] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-full">
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
                  Step 06/06
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight mb-2 italic drop-shadow-md text-white uppercase">
                  Debriefing
                </h1>
                <p className="text-slate-400 text-[11px] font-sans font-bold tracking-[0.2em] leading-relaxed mt-4">
                  Berikan jawaban Anda dengan jujur dan sedetail mungkin.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/60">
              <div className="p-5 md:p-6 bg-slate-900/40 rounded-[24px] border border-slate-800/50 shadow-inner">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[9px] font-sans text-slate-500 font-black uppercase tracking-widest">
                    Status Tahap Akhir
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

                <p className="text-[10px] text-blue-200/50 italic leading-relaxed mt-5">
                  *Sistem akan mengirimkan seluruh data penelitian Anda setelah
                  menekan tombol submit.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-transparent relative">
            <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 space-y-8 md:space-y-10 custom-scrollbar scroll-smooth">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 animate-pulse">
                  <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                  <span className="text-xs font-sans font-bold uppercase tracking-widest">
                    Sinkronisasi Tahap Akhir...
                  </span>
                </div>
              ) : questions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <span className="text-4xl mb-2">⚠️</span>
                  <p className="text-sm font-sans font-bold uppercase tracking-widest">
                    Belum Ada Soal
                  </p>
                  <p className="text-xs italic">
                    Tidak ada soal tipe "suspicion" di database.
                  </p>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8 border-b border-slate-800/40 last:border-0 last:pb-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-4 md:gap-5 items-start">
                      <span className="text-3xl md:text-4xl font-black text-slate-700/60 italic shrink-0 leading-none mt-1 select-none">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <p className="text-sm md:text-base font-bold text-white leading-relaxed pt-0.5 md:pt-1">
                        {q.question_text}
                      </p>
                    </div>

                    <div className="pl-12 md:pl-[4.2rem]">
                      {q.answer_type === "text" && (
                        <textarea
                          className="w-full p-5 md:p-6 bg-slate-900/40 border border-slate-700/80 rounded-[24px] focus:bg-slate-900/80 focus:border-blue-500 outline-none transition-all duration-300 text-sm font-sans font-bold text-white placeholder:text-slate-600 placeholder:font-normal min-h-[140px] custom-scrollbar"
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

            <div className="p-6 md:p-8 lg:p-10 border-t border-slate-800/80 bg-black/40 shrink-0 backdrop-blur-md">
              <button
                onClick={handleSubmitFinal}
                disabled={submitting || !isCompleted}
                className={`group relative w-full py-5 md:py-6 rounded-[24px] font-sans font-black uppercase tracking-[0.4em] text-[11px] md:text-[12px] shadow-2xl transition-all overflow-hidden flex items-center justify-center gap-3 ${
                  isCompleted && !submitting
                    ? "bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] active:scale-[0.98] hover:bg-blue-500 cursor-pointer"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50"
                }`}
              >
                <span className="relative z-10 italic">
                  {submitting ? "MENGIRIM SELURUH DATA..." : "SUBMIT KUESIONER"}
                </span>

                {!submitting && isCompleted && (
                  <svg
                    className="w-4 h-4 relative z-10 text-white transform group-hover:translate-x-2 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}

                {!submitting && isCompleted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
