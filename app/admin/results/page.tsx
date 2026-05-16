"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  // 🔥 FITUR UTAMA BARU: Export ke Berkas .xlsx dengan Office OpenXML Format (Anti-Corrupt)
  const exportToExcelMultiSheets = () => {
    if (respondents.length === 0 || questions.length === 0) {
      alert("Belum ada data untuk di-export.");
      return;
    }

    const cleanString = (str: any) => {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    const typeOrder = ["politik", "industri", "skala", "suspicion"];

    const getLabel = (type: string) => {
      if (type === "politik") return "MC KEL. POLITIK";
      if (type === "industri") return "MC KEL. INDUSTRI";
      if (type === "skala") return "KUESIONER / SKALA";
      if (type === "suspicion") return "SUSPICION CHECK";
      return type.toUpperCase();
    };

    const getSheetData = (dataset: any[], allowedQuestionTypes: string[]) => {
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

      // Susun Struktur Gabung Cell (Merge) Atas
      const groupedHeaders = [
        { label: "DATA RESPONDEN", span: baseHeaders.length },
      ];
      let currentType = "";
      let currentTypeCount = 0;

      filteredQuestions.forEach((q) => {
        if (q.type !== currentType) {
          if (currentType !== "") {
            groupedHeaders.push({
              label: getLabel(currentType),
              span: currentTypeCount,
            });
          }
          currentType = q.type;
          currentTypeCount = 1;
        } else {
          currentTypeCount++;
        }
      });
      if (currentTypeCount > 0) {
        groupedHeaders.push({
          label: getLabel(currentType),
          span: currentTypeCount,
        });
      }

      const headers2 = [
        ...baseHeaders,
        ...filteredQuestions.map((q) => q.question_text),
      ];

      const rows = dataset.map((r) => {
        const row = [
          r.id,
          r.name,
          r.age,
          r.gender,
          r.domicile,
          r.last_education,
          r.phone || "-",
          r.assignedType,
          `${r.correctCount} / ${r.mcTotal}`,
          r.duration_seconds,
          new Date(r.created_at).toLocaleString("id-ID"),
        ];

        filteredQuestions.forEach((q) => {
          const ansObj = r.enrichedAnswers.find(
            (a: any) => a.question_id === q.id,
          );
          row.push(ansObj ? ansObj.answer_value : "-");
        });
        return row;
      });

      return { groupedHeaders, headers2, rows, colCount: headers2.length };
    };

    const sheetKeseluruhan = getSheetData(respondents, [
      "politik",
      "industri",
      "skala",
      "suspicion",
    ]);
    const sheetPolitik = getSheetData(
      respondents.filter((r) => r.assignedType === "politik"),
      ["politik", "skala", "suspicion"],
    );
    const sheetIndustri = getSheetData(
      respondents.filter((r) => r.assignedType === "industri"),
      ["industri", "skala", "suspicion"],
    );

    // Membangun dokumen berbasis XML OpenXML Worksheet Schema
    const buildWorksheetXml = (sheetName: string, data: any) => {
      let xml = `  <Worksheet ss:Name="${sheetName}">\n    <Table>\n`;
      for (let i = 0; i < data.colCount; i++) {
        xml += `      <Column ss:Width="${i < 11 ? "110" : "240"}" />\n`;
      }

      // Baris 1: Pengelompokan Tipe Kuesioner (Dengan Fitur Gabung Cell / MergeAcross)
      xml += '      <Row ss:Height="26">\n';
      data.groupedHeaders.forEach((gh: any) => {
        const mergeAttr = gh.span > 1 ? ` ss:MergeAcross="${gh.span - 1}"` : "";
        xml += `        <Cell${mergeAttr} ss:StyleID="HeaderType"><Data ss:Type="String">${cleanString(gh.label)}</Data></Cell>\n`;
      });
      xml += "      </Row>\n";

      // Baris 2: Judul / Butir Pertanyaan
      xml += '      <Row ss:Height="42">\n';
      data.headers2.forEach((h: string) => {
        xml += `        <Cell ss:StyleID="HeaderQuestion"><Data ss:Type="String">${cleanString(h)}</Data></Cell>\n`;
      });
      xml += "      </Row>\n";

      // Baris Konten Data Utama
      data.rows.forEach((row: any[]) => {
        xml += '      <Row ss:Height="20">\n';
        row.forEach((cell: any) => {
          const isNum = typeof cell === "number";
          xml += `        <Cell ss:StyleID="DataCell"><Data ss:Type="${isNum ? "Number" : "String"}">${cleanString(cell)}</Data></Cell>\n`;
        });
        xml += "      </Row>\n";
      });

      xml += "    </Table>\n  </Worksheet>\n";
      return xml;
    };

    let xlsxTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="workbook.xsl"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Admin IBW</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="HeaderType">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Name="Segoe UI" ss:Size="10"/>
      <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="HeaderQuestion">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:Bold="1" ss:Color="#0F172A" ss:Name="Segoe UI" ss:Size="10"/>
      <Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
    </Style>
    <Style ss:ID="DataCell">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center" ss:WrapText="1"/>
      <Font ss:Name="Segoe UI" ss:Size="9" ss:Color="#334155"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#F1F5F9"/>
      </Borders>
    </Style>
  </Styles>
`;

    xlsxTemplate += buildWorksheetXml("Keseluruhan", sheetKeseluruhan);
    xlsxTemplate += buildWorksheetXml("Kelompok Politik", sheetPolitik);
    xlsxTemplate += buildWorksheetXml("Kelompok Industri", sheetIndustri);
    xlsxTemplate += "</Workbook>";

    // Set MIME-Type resmi untuk Excel OpenXML Spreadsheet (.xlsx)
    const blob = new Blob([xlsxTemplate], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Rekap_Eksperimen_Skripsi_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.xlsx`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* ================================================================= */}
      {/* POPUP DETAIL RESPONDEN (MODAL - DESKTOP LANDSCAPE, MOBILE PORTRAIT SLIM) */}
      {/* ================================================================= */}
      {selectedRespondent && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedRespondent(null)}
          ></div>

          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-5xl h-[90vh] md:h-[75vh] rounded-[24px] md:rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
            {/* 👇 HEADER DI MOBILE DI-REMAKE: Jauh lebih sempit dan tipis agar ruang log jawaban lega 👇 */}
            <div className="w-full md:w-1/3 p-4 md:p-8 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 flex flex-row md:flex-col justify-between items-center md:items-start shrink-0 gap-3">
              <div className="flex-1 md:flex-none">
                <div className="flex justify-between items-center md:items-start mb-1 md:mb-4">
                  <h2 className="text-base md:text-3xl font-black text-white leading-tight truncate max-w-[180px] md:max-w-none">
                    {selectedRespondent.name}
                  </h2>
                </div>

                {/* Badge Identitas Flex-row kecil di HP, Stack vertical di desktop */}
                <div className="flex flex-wrap md:flex-col gap-1 md:gap-2 text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="bg-slate-800/80 px-2 py-0.5 md:py-1 rounded md:w-fit">
                    {selectedRespondent.gender}
                  </span>
                  <span className="bg-slate-800/80 px-2 py-0.5 md:py-1 rounded md:w-fit">
                    {selectedRespondent.age} Thn
                  </span>
                  <span className="bg-slate-800/80 px-2 py-0.5 md:py-1 rounded md:w-fit truncate max-w-[90px] md:max-w-none">
                    {selectedRespondent.last_education}
                  </span>
                  <span className="bg-blue-950/50 text-blue-400 px-2 py-0.5 md:py-1 rounded md:w-fit">
                    ⏱ {formatDuration(selectedRespondent.duration_seconds)}
                  </span>
                </div>
              </div>

              {/* Tombol Tutup - Fleksibel antara Pojok HP vs Bawah Layar Desktop */}
              <div className="shrink-0 flex items-center">
                <button
                  onClick={() => setSelectedRespondent(null)}
                  className="md:hidden w-8 h-8 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold active:bg-red-600 active:text-white"
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

            {/* Area Log Jawaban - Sekarang mendapatkan porsi ruang jauh lebih besar di layar HP */}
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
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {ans.question?.type || "Unknown"}
                        </span>
                      </div>
                      <p className="font-bold text-slate-300 text-xs md:text-sm mb-2 md:mb-3 leading-relaxed">
                        {ans.question?.question_text ||
                          "Soal telah dihapus dari database"}
                      </p>
                      <div className="bg-slate-900 border border-slate-800/80 p-2.5 md:p-3.5 rounded-lg text-xs text-slate-400 font-medium">
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
