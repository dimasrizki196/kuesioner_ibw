"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Step5Evaluasi() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const respondentId = localStorage.getItem("respondent_id");
    if (!respondentId) {
      router.push("/step-1");
      return;
    }
    fetchFinalQuestions();
  }, []);

  async function fetchFinalQuestions() {
    setLoading(true);
    // Mengambil soal yang 'type' nya NULL (Soal evaluasi/umum akhir)
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .is("type", null)
      .order("created_at", { ascending: true });

    if (data) setQuestions(data);
    setLoading(false);
  }

  const handleSelectAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const respondentId = localStorage.getItem("respondent_id");

    if (Object.keys(answers).length < questions.length) {
      alert("Mohon isi evaluasi singkat ini sebelum selesai.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({
        respondent_id: respondentId,
        question_id: q.id,
        answer_value: answers[q.id],
      }));

      const { error } = await supabase.from("answers").insert(payload);
      if (error) throw error;

      // Selesai total, hapus semua jejak di localStorage
      localStorage.clear();
      router.push("/finish");
    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-lg md:max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[92vh] md:max-h-[700px]">
        {/* --- SIDEBAR --- */}
        <div className="w-full md:w-[32%] bg-[#0f172a] p-6 md:p-10 text-white flex flex-col justify-between shrink-0">
          <div>
            <div className="inline-block w-fit px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
              Step 05/05
            </div>
            <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2">
              Tahap Akhir
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed opacity-80 uppercase tracking-widest font-bold">
              Evaluasi Pengisian
            </p>
          </div>
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/20">
            <p className="text-[10px] font-bold text-blue-100 uppercase mb-1">
              Status
            </p>
            <p className="text-xs font-black">Sedikit lagi selesai!</p>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white p-6 md:p-12 justify-between">
          <div className="flex-1 overflow-y-auto space-y-10 pr-2 custom-scrollbar">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">
                Evaluasi & Penutup
              </h2>
              <p className="text-sm text-slate-500">
                Bagaimana pendapat Anda mengenai kuesioner ini?
              </p>
            </div>

            {loading ? (
              <p className="italic text-slate-400">Memuat soal evaluasi...</p>
            ) : questions.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-sm font-bold text-slate-400">
                  Tidak ada soal evaluasi. Silakan klik selesai.
                </p>
              </div>
            ) : (
              questions.map((q) => (
                <div
                  key={q.id}
                  className="space-y-6 animate-in fade-in duration-700"
                >
                  <p className="text-sm md:text-base font-bold text-slate-800">
                    {q.question_text}
                  </p>

                  {/* Render Scale jika tipenya scale */}
                  {q.answer_type === "scale" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-3xl">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() =>
                              handleSelectAnswer(q.id, num.toString())
                            }
                            className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl font-black transition-all flex items-center justify-center ${
                              answers[q.id] === num.toString()
                                ? "bg-blue-600 text-white shadow-xl"
                                : "bg-white text-slate-300 shadow-sm"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between px-2 text-[9px] font-bold text-slate-400 uppercase italic">
                        <span>{q.options["1"] || "Sangat Buruk"}</span>
                        <span>{q.options["5"] || "Sangat Baik"}</span>
                      </div>
                    </div>
                  )}

                  {/* Render Text jika tipenya text */}
                  {q.answer_type === "text" && (
                    <textarea
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold min-h-[100px]"
                      placeholder="Tuliskan jawaban Anda..."
                      onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                    />
                  )}
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              (questions.length > 0 &&
                Object.keys(answers).length < questions.length)
            }
            className="w-full py-5 mt-8 bg-[#0f172a] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all"
          >
            {submitting ? "Memproses..." : "Kirim & Selesai"}
          </button>
        </div>
      </div>
    </div>
  );
}
