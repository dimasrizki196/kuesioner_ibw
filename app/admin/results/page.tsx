"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Injeksi CDN SheetJS resmi dari cdnjs agar menghasilkan biner (.xlsx) murni tanpa install npm
const XLSX_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";

export default function ResultDashboard() {
  const [activeTab, setActiveTab] = useState<"individu" | "soal">("individu");
  const [activeQuestionTab, setActiveQuestionTab] = useState("politik");

  const [respondents, setRespondents] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRespondent, setSelectedRespondent] = useState<any>(null);

  // State Untuk Fitur Hapus Massal & Modal Konfirmasi
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{
    ids: string[];
    type: "single" | "mass";
    name?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const questionTabs = [
    { id: "politik", label: "MC KE" },
    { id: "industri", label: "MC KK" },
    { id: "skala", label: "Kuesioner" },
    { id: "suspicion", label: "Suspicion Check" },
  ];

  useEffect(() => {
    fetchData();
    // Load SheetJS engine ke dalam DOM secara otomatis
    if (typeof window !== "undefined" && !(window as any).XLSX) {
      const script = document.createElement("script");
      script.src = XLSX_CDN;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: qData } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: true });
      if (qData) setQuestions(qData);

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
        const processed = rData.map((r) => {
          let assignedType = "-";
          let correctCount = 0;
          let mcTotal = 0;

          const enrichedAnswers = r.answers.map((ans: any) => {
            const q = qData.find((x) => x.id === ans.question_id);
            if (!q) return ans;

            if (q.type === "politik" || q.type === "industri") {
              assignedType = q.type;
              mcTotal++;

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(respondents.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await supabase
        .from("answers")
        .delete()
        .in("respondent_id", deleteTarget.ids);
      const { error } = await supabase
        .from("respondents")
        .delete()
        .in("id", deleteTarget.ids);
      if (error) throw error;

      setSelectedIds([]);
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      alert("Gagal menghapus data: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // 🔥 SOLUSI TOTAL: Bikin Berkas .XLSX Murni Menggunakan SheetJS Engine (Anti-Gagal)
  const exportToExcelMultiSheets = () => {
    const XLSX = (window as any).XLSX;
    if (!XLSX) {
      alert("Engine Excel sedang dimuat, mohon coba sesaat lagi.");
      return;
    }

    if (respondents.length === 0 || questions.length === 0) {
      alert("Belum ada data untuk di-export.");
      return;
    }

    const typeOrder = ["politik", "industri", "skala", "suspicion"];

    const getLabel = (type: string) => {
      if (type === "politik") return "MC KE";
      if (type === "industri") return "MC KK";
      if (type === "skala") return "KUESIONER";
      if (type === "suspicion") return "SUSPICION CHECK";
      return type.toUpperCase();
    };

    const generateSheetMatrix = (
      dataset: any[],
      allowedQuestionTypes: string[],
    ) => {
      const filteredQuestions = questions
        .filter((q) => allowedQuestionTypes.includes(q.type))
        .sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));

      const baseHeaders = [
        "ID Responden",
        "Nama/Inisial",
        "Usia",
        "Gender",
        "Domisili",
        "Pendidikan",
        "WhatsApp",
        "Kelompok",
        "Skor MC",
        "Durasi (Detik)",
        "Waktu Masuk",
      ];

      // Baris 1: Tipe / Kategori Soal
      const row1 = [...baseHeaders.map(() => "DATA RESPONDEN")];
      filteredQuestions.forEach((q) => {
        row1.push(getLabel(q.type));
      });

      // Baris 2: Detail Soal / Nama Kolom
      const row2 = [
        ...baseHeaders,
        ...filteredQuestions.map((q) => q.question_text),
      ];

      // Gabungkan Baris Konten
      const matrixData = [row1, row2];

      dataset.forEach((r) => {
        const row = [
          r.id,
          r.name,
          Number(r.age) || r.age,
          r.gender,
          r.domicile,
          r.last_education,
          r.phone || "-",
          r.assignedType,
          `${r.correctCount} / ${r.mcTotal}`,
          Number(r.duration_seconds) || r.duration_seconds,
          new Date(r.created_at).toLocaleString("id-ID"),
        ];

        filteredQuestions.forEach((q) => {
          const ansObj = r.enrichedAnswers.find(
            (a: any) => a.question_id === q.id,
          );
          row.push(ansObj ? ansObj.answer_value : "-");
        });
        matrixData.push(row);
      });

      return {
        matrixData,
        filteredQuestionsCount: filteredQuestions.length,
        baseCount: baseHeaders.length,
      };
    };

    // 1. Ambil data matriks untuk tiap-tiap lembar tab kerja
    const dataAll = generateSheetMatrix(respondents, [
      "politik",
      "industri",
      "skala",
      "suspicion",
    ]);
    const dataPol = generateSheetMatrix(
      respondents.filter((r) => r.assignedType === "politik"),
      ["politik", "skala", "suspicion"],
    );
    const dataInd = generateSheetMatrix(
      respondents.filter((r) => r.assignedType === "industri"),
      ["industri", "skala", "suspicion"],
    );

    // 2. Inisialisasi Dokumen Workbook SheetJS baru
    const wb = XLSX.utils.book_new();

    const appendSheet = (sheetName: string, sheetInfo: any) => {
      const ws = XLSX.utils.aoa_to_sheet(sheetInfo.matrixData);

      // Logika Gabung Cell (Merge) Baris 1 agar rapi otomatis
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: sheetInfo.baseCount - 1 } },
      ];
      let currentColIdx = sheetInfo.baseCount;

      const allowedTypes =
        sheetName === "Kelompok Politik"
          ? ["politik", "skala", "suspicion"]
          : sheetName === "Kelompok Ekonomi"
            ? ["industri", "skala", "suspicion"]
            : ["politik", "industri", "skala", "suspicion"];

      const filteredQuestions = questions
        .filter((q) => allowedTypes.includes(q.type))
        .sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));

      let currentType = "";
      let startIdx = currentColIdx;

      filteredQuestions.forEach((q, idx) => {
        if (q.type !== currentType) {
          if (currentType !== "") {
            merges.push({
              s: { r: 0, c: startIdx },
              e: { r: 0, c: currentColIdx - 1 },
            });
          }
          currentType = q.type;
          startIdx = currentColIdx;
        }
        currentColIdx++;
      });
      if (currentColIdx > startIdx) {
        merges.push({
          s: { r: 0, c: startIdx },
          e: { r: 0, c: currentColIdx - 1 },
        });
      }

      ws["!merges"] = merges;
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };

    appendSheet("Keseluruhan", dataAll);
    appendSheet("Kelompok Politik", dataPol);
    appendSheet("Kelompok Ekonomi", dataInd);

    // 3. Konversi menjadi berkas biner .xlsx asli (Aman dari Security Block Microsoft)
    XLSX.writeFile(
      wb,
      `Rekap_Eksperimen_Skripsi_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.xlsx`,
    );
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "-";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const filteredQuestionsInUI = questions.filter(
    (q) => q.type === activeQuestionTab,
  );

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* HEADER PANEL */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <span className="text-blue-500">❖</span> Data Masuk
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-sans tracking-wide">
            Analisis hasil kuesioner & log jawaban eksperimen.
          </p>
        </div>

        <button
          onClick={exportToExcelMultiSheets}
          disabled={loading || respondents.length === 0}
          className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.2)] w-full sm:w-auto justify-center"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export Berkas .XLSX
        </button>
      </div>

      {/* TAB UTAMA */}
      <div className="flex gap-3 mb-6 overflow-x-auto custom-scrollbar pb-2">
        <button
          onClick={() => setActiveTab("individu")}
          className={`px-5 py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === "individu"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500"
              : "bg-slate-900/50 text-slate-500 border border-slate-800"
          }`}
        >
          🧑‍🎓 By Individu
        </button>
        <button
          onClick={() => setActiveTab("soal")}
          className={`px-5 py-2.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === "soal"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500"
              : "bg-slate-900/50 text-slate-500 border border-slate-800"
          }`}
        >
          📝 By Pertanyaan
        </button>
      </div>

      {/* TAB 1: INDIVIDU */}
      {activeTab === "individu" && (
        <div className="space-y-4">
          {selectedIds.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 md:p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 animate-in fade-in">
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                {selectedIds.length} Data Terpilih
              </span>
              <button
                onClick={() =>
                  setDeleteTarget({ ids: selectedIds, type: "mass" })
                }
                className="bg-red-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest w-full sm:w-auto"
              >
                Hapus Masal
              </button>
            </div>
          )}

          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 shadow-2xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-950/80 border-b border-slate-800">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                        onChange={handleSelectAll}
                        checked={
                          selectedIds.length === respondents.length &&
                          respondents.length > 0
                        }
                      />
                    </th>
                    <th className="p-4 md:p-5 font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest">
                      Identitas
                    </th>
                    <th className="p-4 md:p-5 font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest">
                      Kelompok
                    </th>
                    <th className="p-4 md:p-5 font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest text-center">
                      Skor MC
                    </th>
                    <th className="p-4 md:p-5 font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest text-center">
                      Durasi
                    </th>
                    <th className="p-4 md:p-5 font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest">
                      Waktu Masuk
                    </th>
                    <th className="p-4 md:p-5 font-bold text-slate-400 text-[10px] md:text-xs uppercase tracking-widest text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs"
                      >
                        Menarik data dari server...
                      </td>
                    </tr>
                  ) : respondents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest text-xs"
                      >
                        Belum ada data responden.
                      </td>
                    </tr>
                  ) : (
                    respondents.map((r) => (
                      <tr
                        key={r.id}
                        className={`transition-colors ${selectedIds.includes(r.id) ? "bg-blue-900/10" : "hover:bg-slate-800/30"}`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-500 cursor-pointer"
                            checked={selectedIds.includes(r.id)}
                            onChange={() => handleSelectRow(r.id)}
                          />
                        </td>
                        <td className="p-4 md:p-5">
                          <div className="font-bold text-slate-200 text-sm">
                            {r.name}{" "}
                            <span className="text-[10px] md:text-xs font-normal text-slate-500 ml-2">
                              ({r.age} thn)
                            </span>
                          </div>
                          <div className="text-[10px] md:text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">
                            {r.last_education} • {r.domicile}
                          </div>
                        </td>
                        <td className="p-4 md:p-5">
                          <span
                            className={`px-3 py-1.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                              r.assignedType === "politik"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            {r.assignedType}
                          </span>
                        </td>
                        <td className="p-4 md:p-5 text-center">
                          <div className="inline-flex items-center justify-center bg-blue-900/30 text-blue-400 border border-blue-800/50 font-black px-3 py-1 rounded-md text-xs md:text-sm">
                            {r.correctCount} / {r.mcTotal}
                          </div>
                        </td>
                        <td className="p-4 md:p-5 text-center font-mono text-xs md:text-sm text-slate-400">
                          {formatDuration(r.duration_seconds)}
                        </td>
                        <td className="p-4 md:p-5 text-[10px] md:text-xs font-bold text-slate-500 tracking-wider">
                          {new Date(r.created_at).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="p-4 md:p-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedRespondent(r)}
                              className="bg-slate-800 text-blue-400 border border-slate-700 px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              Cek
                            </button>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  ids: [r.id],
                                  type: "single",
                                  name: r.name,
                                })
                              }
                              className="bg-slate-800/80 text-red-400 border border-slate-700 px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOAL */}
      {activeTab === "soal" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800 w-full md:w-fit justify-start">
            {questionTabs.map((qt) => (
              <button
                key={qt.id}
                onClick={() => setActiveQuestionTab(qt.id)}
                className={`px-4 py-2.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeQuestionTab === qt.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {qt.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 md:space-y-6">
            {!loading &&
              filteredQuestionsInUI.map((q, idx) => {
                const answersForQ = respondents.flatMap((r) =>
                  r.enrichedAnswers
                    .filter((a: any) => a.question_id === q.id)
                    .map((a: any) => ({ ...a, respondent_name: r.name })),
                );
                return (
                  <div
                    key={q.id}
                    className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-5 md:p-8 rounded-2xl md:rounded-[32px]"
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-8 h-8 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg flex items-center justify-center font-black text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 text-sm md:text-base leading-relaxed">
                          {q.question_text}
                        </h3>
                      </div>
                    </div>
                    <div className="pl-12">
                      <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar border-t border-slate-800/50 pt-3">
                        {answersForQ.map((ans: any, i: number) => (
                          <li
                            key={i}
                            className="text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-1"
                          >
                            <span className="font-black text-blue-400 text-[10px] uppercase shrink-0">
                              {ans.respondent_name}:
                            </span>
                            <span className="text-slate-300 font-medium">
                              "{ans.answer_value}"
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* POPUP DETAIL RESPONDEN */}
      {selectedRespondent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedRespondent(null)}
          ></div>
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-5xl h-[90vh] md:h-[75vh] rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="w-full md:w-1/3 p-4 md:p-8 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 flex flex-row md:flex-col justify-between items-center md:items-start shrink-0 gap-3">
              <div className="flex-1 md:flex-none">
                <h2 className="text-base md:text-3xl font-black text-white leading-tight truncate max-w-[180px] md:max-w-none">
                  {selectedRespondent.name}
                </h2>
                <div className="flex flex-wrap md:flex-col gap-1 md:gap-2 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded md:w-fit">
                    {selectedRespondent.gender}
                  </span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded md:w-fit">
                    {selectedRespondent.age} Thn
                  </span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded md:w-fit truncate max-w-[90px] md:max-w-none">
                    {selectedRespondent.last_education}
                  </span>
                  <span className="bg-blue-950/50 text-blue-400 px-2 py-0.5 rounded md:w-fit">
                    ⏱ {formatDuration(selectedRespondent.duration_seconds)}
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => setSelectedRespondent(null)}
                  className="md:hidden w-8 h-8 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold"
                >
                  ✕
                </button>
                <button
                  onClick={() => setSelectedRespondent(null)}
                  className="hidden md:flex w-full bg-slate-800 border border-slate-700 py-3 rounded-xl items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors uppercase font-black tracking-widest text-xs"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900/50 space-y-3 md:space-y-4 custom-scrollbar">
              <h3 className="font-black text-slate-500 uppercase tracking-widest text-[9px] md:text-xs border-b border-slate-800 pb-2">
                Log Rekaman Jawaban Partisipan
              </h3>
              {selectedRespondent.enrichedAnswers.length === 0 ? (
                <p className="text-slate-500 italic text-xs">
                  Belum ada jawaban tersimpan.
                </p>
              ) : (
                selectedRespondent.enrichedAnswers.map(
                  (ans: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-950/40 border border-slate-800/60 p-3 md:p-5 rounded-xl md:rounded-2xl"
                    >
                      <span className="text-[7px] md:text-[8px] font-black uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {ans.question?.type || "Unknown"}
                      </span>
                      <p className="font-bold text-slate-300 text-xs md:text-sm my-2 leading-relaxed">
                        {ans.question?.question_text ||
                          "Soal telah dihapus dari database"}
                      </p>
                      <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-lg text-xs text-slate-400 font-medium">
                        Menjawab:{" "}
                        <span className="text-blue-400 font-bold ml-1">
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

      {/* POPUP KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          ></div>
          <div className="relative bg-slate-900 border border-red-500/30 w-full max-w-md rounded-[24px] shadow-2xl p-6 text-center animate-in zoom-in-95">
            <h2 className="text-lg font-black text-white mb-2 uppercase tracking-widest">
              Hapus Permanen?
            </h2>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              {deleteTarget.type === "mass"
                ? `Hapus ${deleteTarget.ids.length} data responden secara massal.`
                : `Hapus data responden ${deleteTarget.name}.`}
              <br />
              Seluruh data tidak dapat dikembalikan. Lanjutkan?
            </p>
            <div className="flex gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold uppercase text-[10px]"
              >
                Batal
              </button>
              <button
                disabled={isDeleting}
                onClick={executeDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-[10px] hover:bg-red-500"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
