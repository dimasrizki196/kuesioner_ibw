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
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("type", type)
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
      alert("Mohon jawab semua pertanyaan.");
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

      router.push("/step-5");
    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-2 md:p-4 font-sans">
      <div className="w-full max-w-lg md:max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[96vh] md:max-h-[800px]">
        {/* --- SIDEBAR PROGRESS --- */}
        <div className="w-full md:w-[30%] bg-[#0f172a] p-6 md:p-10 text-white flex flex-col justify-between shrink-0">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Survey Active
            </div>
            <h1 className="text-2xl md:text-3xl font-black leading-tight">
              Lembar <br />
              Kuesioner
            </h1>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
                Progress Anda
              </p>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-[10px] text-right mt-2 text-blue-400 font-bold italic">
                {Object.keys(answers).length} dari {questions.length} Soal
              </p>
            </div>
          </div>
        </div>

        {/* --- SOAL AREA (SCROLLABLE) --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 custom-scrollbar scroll-smooth">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Memuat butir pertanyaan...
              </div>
            ) : (
              questions.map((q, index) => (
                <div
                  key={q.id}
                  className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="flex gap-4">
                    <span className="text-2xl font-black text-slate-100 italic">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <p className="text-sm md:text-base font-extrabold text-slate-800 leading-relaxed">
                      {q.question_text}
                    </p>
                  </div>

                  {/* ADAPTIF BERDASARKAN ANSWER_TYPE */}
                  <div className="px-2 md:px-6">
                    {/* TIPE 1: SCALE (1-5) */}
                    {q.answer_type === "scale" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-3xl border border-slate-100">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              onClick={() =>
                                handleSelectAnswer(q.id, num.toString())
                              }
                              className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl font-black transition-all flex items-center justify-center text-sm md:text-lg ${
                                answers[q.id] === num.toString()
                                  ? "bg-blue-600 text-white shadow-xl scale-110"
                                  : "bg-white text-slate-300 hover:text-blue-500 shadow-sm"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between px-2 text-[10px] font-black text-slate-400 uppercase italic">
                          <span>{q.options["1"] || "Sangat Tidak Setuju"}</span>
                          <span>{q.options["5"] || "Sangat Setuju"}</span>
                        </div>
                      </div>
                    )}

                    {/* TIPE 2: MULTIPLE CHOICE */}
                    {q.answer_type === "multiple_choice" && (
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(q.options || {}).map(
                          ([key, label]: any) => (
                            <button
                              key={key}
                              onClick={() => handleSelectAnswer(q.id, label)}
                              className={`p-4 rounded-2xl text-left text-sm font-bold border-2 transition-all ${
                                answers[q.id] === label
                                  ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm"
                                  : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                              }`}
                            >
                              {label}
                            </button>
                          ),
                        )}
                      </div>
                    )}

                    {/* TIPE 3: TEXT / OPEN ENDED */}
                    {q.answer_type === "text" && (
                      <textarea
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold min-h-[100px]"
                        placeholder="Ketik jawaban Anda di sini..."
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

          {/* --- FIXED SUBMIT AREA --- */}
          <div className="p-6 md:p-10 bg-white border-t border-slate-100 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={
                submitting || Object.keys(answers).length < questions.length
              }
              className="w-full py-5 bg-[#0f172a] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl disabled:opacity-10 transition-all active:scale-95"
            >
              {submitting ? "Memproses..." : "Kirim Jawaban Akhir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
