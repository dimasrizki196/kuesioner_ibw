"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResultDashboard() {
  const [activeTab, setActiveTab] = useState<"individu" | "soal">("individu");
  const [respondents, setRespondents] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Popup Detail
  const [selectedRespondent, setSelectedRespondent] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Ambil semua soal
      const { data: qData } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: true });
      if (qData) setQuestions(qData);

      // 2. Ambil responden beserta jawabannya
      const { data: rData } = await supabase
        .from("respondents")
        .select(
          `
          *,
          answers (
            question_id,
            answer_value
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (rData && qData) {
        // Proses data untuk menghitung ringkasan per responden
        const processed = rData.map((r) => {
          let assignedType = "-";
          let correctCount = 0;
          let mcTotal = 0;

          // Gabungkan jawaban dengan teks soal aslinya
          const enrichedAnswers = r.answers.map((ans: any) => {
            const q = qData.find((x) => x.id === ans.question_id);
            if (!q) return ans;

            // Deteksi tipe partisipan (Politik/Industri) dari soal MC yang mereka jawab
            if (q.type === "politik" || q.type === "industri") {
              assignedType = q.type;
              mcTotal++;

              // Cek jawaban benar
              if (Array.isArray(q.options)) {
                const correctOpt = q.options.find((o: any) => o.is_correct);
                if (correctOpt && ans.answer_value.includes(correctOpt.text)) {
                  correctCount++;
                }
              }
            }
            return { ...ans, question: q };
          });

          return {
            ...r,
            assignedType,
            correctCount,
            mcTotal,
            enrichedAnswers,
          };
        });

        setRespondents(processed);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Helper untuk mengubah detik jadi format menit & detik
  const formatDuration = (seconds: number) => {
    if (!seconds) return "-";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans bg-slate-50 min-h-screen">
      {/* Header & Tabs */}
      <div className="mb-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500">
            Analisis hasil kuesioner eksperimen psikologi.
          </p>
        </div>

        <div className="flex gap-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("individu")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${
              activeTab === "individu"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            🧑‍🎓 Berdasarkan Individu
          </button>
          <button
            onClick={() => setActiveTab("soal")}
            className={`pb-4 px-2 font-bold transition-all border-b-2 ${
              activeTab === "soal"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            📝 Berdasarkan Soal
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* TAB 1: INDIVIDU (RESPONDEN) */}
      {/* ================================================================= */}
      {activeTab === "individu" && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-5 font-bold text-slate-600 text-sm">
                    Identitas
                  </th>
                  <th className="p-5 font-bold text-slate-600 text-sm">
                    Kelompok
                  </th>
                  <th className="p-5 font-bold text-slate-600 text-sm text-center">
                    Skor MC
                  </th>
                  <th className="p-5 font-bold text-slate-600 text-sm text-center">
                    Durasi
                  </th>
                  <th className="p-5 font-bold text-slate-600 text-sm">
                    Tanggal
                  </th>
                  <th className="p-5 font-bold text-slate-600 text-sm text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400 font-medium animate-pulse"
                    >
                      Menarik data dari server...
                    </td>
                  </tr>
                ) : respondents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400 font-medium"
                    >
                      Belum ada data responden yang masuk.
                    </td>
                  </tr>
                ) : (
                  respondents.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-5">
                        <div className="font-bold text-slate-900">
                          {r.name}{" "}
                          <span className="text-xs font-normal text-slate-400 ml-2">
                            ({r.age} thn)
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {r.last_education} • {r.domicile}
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                            r.assignedType === "politik"
                              ? "bg-red-100 text-red-700"
                              : r.assignedType === "industri"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {r.assignedType}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-black px-3 py-1 rounded-full text-sm">
                          {r.correctCount} / {r.mcTotal}
                        </div>
                      </td>
                      <td className="p-5 text-center font-mono text-sm text-slate-600">
                        ⏱️ {formatDuration(r.duration_seconds)}
                      </td>
                      <td className="p-5 text-xs font-medium text-slate-500">
                        {new Date(r.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => setSelectedRespondent(r)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-blue-600 transition-colors shadow-lg"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: SOAL (ANALISIS ITEM) */}
      {/* ================================================================= */}
      {activeTab === "soal" && (
        <div className="space-y-6">
          {loading ? (
            <div className="p-10 text-center text-slate-400 font-medium animate-pulse">
              Menarik data soal...
            </div>
          ) : (
            questions.map((q, idx) => {
              // Kumpulkan semua jawaban untuk soal ini
              const answersForQ = respondents.flatMap((r) =>
                r.enrichedAnswers
                  .filter((a: any) => a.question_id === q.id)
                  .map((a: any) => ({ ...a, respondent_name: r.name })),
              );

              return (
                <div
                  key={q.id}
                  className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                          {q.type}
                        </span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                          {q.answer_type}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">
                        {q.question_text}
                      </h3>
                    </div>
                  </div>

                  <div className="pl-14">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                      Rekap Jawaban ({answersForQ.length} Responden):
                    </p>
                    {q.answer_type === "text" ? (
                      <ul className="space-y-2 max-h-40 overflow-y-auto pr-4 custom-scrollbar">
                        {answersForQ.map((ans: any, i: number) => (
                          <li
                            key={i}
                            className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100"
                          >
                            <span className="font-bold text-slate-700 mr-2">
                              {ans.respondent_name}:
                            </span>
                            <span className="text-slate-600 italic">
                              "{ans.answer_value}"
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {/* Menampilkan list badge jawaban */}
                        {Array.from(
                          new Set(answersForQ.map((a: any) => a.answer_value)),
                        ).map((val: any, i) => {
                          const count = answersForQ.filter(
                            (a: any) => a.answer_value === val,
                          ).length;
                          return (
                            <div
                              key={i}
                              className="bg-blue-50 border border-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm flex gap-3"
                            >
                              <span className="font-medium">{val}</span>
                              <span className="font-black opacity-50">
                                {count}x
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* POPUP DETAIL RESPONDEN (MODAL) */}
      {/* ================================================================= */}
      {selectedRespondent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedRespondent(null)}
          ></div>

          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">
                  {selectedRespondent.name}
                </h2>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                    {selectedRespondent.gender}
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                    {selectedRespondent.age} Tahun
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                    {selectedRespondent.last_education}
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-1 rounded-md">
                    Waktu: {formatDuration(selectedRespondent.duration_seconds)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRespondent(null)}
                className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Daftar Jawaban) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white space-y-6 custom-scrollbar">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-4 border-b pb-2">
                Log Jawaban
              </h3>

              {selectedRespondent.enrichedAnswers.length === 0 ? (
                <p className="text-slate-400 italic">
                  Belum ada jawaban tersimpan.
                </p>
              ) : (
                selectedRespondent.enrichedAnswers.map(
                  (ans: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-100 p-5 rounded-2xl"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {ans.question?.type || "Unknown"}
                        </span>
                      </div>
                      <p className="font-bold text-slate-700 text-sm mb-3">
                        {ans.question?.question_text ||
                          "Soal tidak ditemukan / telah dihapus"}
                      </p>
                      <div className="bg-white border border-slate-200 p-3 rounded-xl text-sm text-slate-600 font-medium">
                        Jawaban:{" "}
                        <span className="text-blue-600 font-bold">
                          {ans.answer_value}
                        </span>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
