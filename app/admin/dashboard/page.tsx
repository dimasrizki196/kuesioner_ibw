"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const TARGET_RESPONDENTS = 110;

  const [stats, setStats] = useState({
    totalRespondents: 0,
    politikCount: 0,
    industriCount: 0,
    avgDurationSec: 0,
    mcPolitikCorrect: 0,
    mcPolitikWrong: 0,
    mcIndustriCorrect: 0,
    mcIndustriWrong: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      // 1. Tarik semua soal untuk mapping tipe & kunci jawaban
      const { data: qData } = await supabase
        .from("questions")
        .select("id, type, options, answer_type");

      // 2. Tarik semua responden beserta jawabannya
      const { data: rData, error } = await supabase.from("respondents").select(`
          id, duration_seconds,
          answers ( question_id, answer_value )
        `);

      if (error) throw error;

      if (rData && qData) {
        let politik = 0;
        let industri = 0;
        let totalTime = 0;
        let validTimeCount = 0;

        let polCorrect = 0;
        let polWrong = 0;
        let indCorrect = 0;
        let indWrong = 0;

        rData.forEach((r) => {
          // Hitung rata-rata waktu
          if (r.duration_seconds && r.duration_seconds > 0) {
            totalTime += r.duration_seconds;
            validTimeCount++;
          }

          let isPolitik = false;
          let isIndustri = false;

          r.answers.forEach((ans: any) => {
            const q = qData.find((x) => x.id === ans.question_id);

            // Deteksi kelompok
            if (q?.type === "politik") isPolitik = true;
            if (q?.type === "industri") isIndustri = true;

            // Hitung Benar / Salah untuk soal Manipulation Check (Step 4)
            if (
              q?.answer_type === "multiple_choice" &&
              Array.isArray(q.options)
            ) {
              const correctOpt = q.options.find((o: any) => o.is_correct);
              if (correctOpt) {
                const isAnswerCorrect = ans.answer_value.includes(
                  correctOpt.text,
                );

                if (q.type === "politik") {
                  if (isAnswerCorrect) polCorrect++;
                  else polWrong++;
                } else if (q.type === "industri") {
                  if (isAnswerCorrect) indCorrect++;
                  else indWrong++;
                }
              }
            }
          });

          if (isPolitik) politik++;
          if (isIndustri) industri++;
        });

        setStats({
          totalRespondents: rData.length,
          politikCount: politik,
          industriCount: industri,
          avgDurationSec:
            validTimeCount > 0 ? Math.floor(totalTime / validTimeCount) : 0,
          mcPolitikCorrect: polCorrect,
          mcPolitikWrong: polWrong,
          mcIndustriCorrect: indCorrect,
          mcIndustriWrong: indWrong,
        });
      }
    } catch (error) {
      console.error("Gagal menarik data overview:", error);
    } finally {
      setLoading(false);
    }
  }

  // Helper Waktu
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds === 0) return "-";
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  // Kalkulasi Persentase Utama
  const progressPercent = Math.min(
    Math.round((stats.totalRespondents / TARGET_RESPONDENTS) * 100),
    100,
  );

  // Kalkulasi Persentase MC Politik
  const totalPolMC = stats.mcPolitikCorrect + stats.mcPolitikWrong;
  const polCorrectPct =
    totalPolMC > 0
      ? Math.round((stats.mcPolitikCorrect / totalPolMC) * 100)
      : 0;
  const polWrongPct =
    totalPolMC > 0 ? Math.round((stats.mcPolitikWrong / totalPolMC) * 100) : 0;

  // Kalkulasi Persentase MC Industri
  const totalIndMC = stats.mcIndustriCorrect + stats.mcIndustriWrong;
  const indCorrectPct =
    totalIndMC > 0
      ? Math.round((stats.mcIndustriCorrect / totalIndMC) * 100)
      : 0;
  const indWrongPct =
    totalIndMC > 0 ? Math.round((stats.mcIndustriWrong / totalIndMC) * 100) : 0;

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* HEADER DASHBOARD */}
      <header className="mb-6 md:mb-10 pb-4 border-b border-slate-800">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
          <span className="text-blue-500">❖</span> Executive Overview
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-2 font-sans tracking-wide">
          Pantauan real-time eksperimen psikologi{" "}
          <span className="text-blue-400/80 font-bold bg-blue-900/20 px-2 py-0.5 rounded-md ml-1 border border-blue-800/50">
            (Target: {TARGET_RESPONDENTS} Responden)
          </span>
        </p>
      </header>

      {/* SECTION 1: TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Progress Pencapaian */}
        <div className="bg-slate-900/40 backdrop-blur-sm p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          {/* Efek Glow Latar Hover */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-all duration-500"></div>

          <div className="relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-5 shadow-inner">
              🎯
            </div>
            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">
              Total Responden
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-4xl md:text-5xl font-black text-white drop-shadow-md">
                {stats.totalRespondents}
              </p>
              <p className="text-xs md:text-sm font-bold text-slate-500">
                / {TARGET_RESPONDENTS}
              </p>
            </div>
            <div className="mt-5 h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] md:text-xs text-right mt-2 text-blue-400 font-bold uppercase tracking-widest">
              {progressPercent}% Tercapai
            </p>
          </div>
        </div>

        {/* Card 2: Keseimbangan Kelompok */}
        <div className="bg-slate-900/40 backdrop-blur-sm p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] group-hover:bg-indigo-500/20 transition-all duration-500"></div>

          <div className="relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-xl flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-5 shadow-inner">
              ⚖️
            </div>
            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
              Distribusi Kelompok
            </p>

            <div className="space-y-4">
              {/* Bar Politik */}
              <div>
                <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5">
                  <span className="text-red-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    Politik ({stats.politikCount})
                  </span>
                  <span className="text-slate-400">
                    {stats.totalRespondents > 0
                      ? Math.round(
                          (stats.politikCount / stats.totalRespondents) * 100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-1000 ease-out"
                    style={{
                      width: `${stats.totalRespondents > 0 ? (stats.politikCount / stats.totalRespondents) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Bar Industri */}
              <div>
                <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                    Industri ({stats.industriCount})
                  </span>
                  <span className="text-slate-400">
                    {stats.totalRespondents > 0
                      ? Math.round(
                          (stats.industriCount / stats.totalRespondents) * 100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-1000 ease-out"
                    style={{
                      width: `${stats.totalRespondents > 0 ? (stats.industriCount / stats.totalRespondents) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Rata-rata Waktu */}
        <div className="bg-slate-900/40 backdrop-blur-sm p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-500/20 transition-all duration-500"></div>

          <div className="relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center text-xl md:text-2xl mb-4 md:mb-5 shadow-inner">
              ⏱️
            </div>
            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">
              Rata-Rata Waktu
            </p>
            <p className="text-4xl md:text-5xl font-black text-emerald-400 mt-1 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {formatTime(stats.avgDurationSec)}
            </p>
          </div>
          <div className="p-3 md:p-4 bg-emerald-950/20 rounded-xl mt-4 md:mt-6 border border-emerald-900/30 relative z-10">
            <p className="text-[9px] md:text-[10px] text-emerald-200/60 leading-relaxed italic font-bold">
              *Waktu yang terlalu singkat berpotensi mengindikasikan responden
              tidak membaca narasi dengan saksama.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: KOMPARASI MANIPULATION CHECK */}
      <div className="bg-slate-900/40 backdrop-blur-sm p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-800/80 shadow-[0_10px_40px_rgba(0,0,0,0.4)] mt-6">
        <div className="mb-8 border-b border-slate-800/60 pb-6 md:pb-8">
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
            <span className="text-2xl">🧠</span> Manipulation Check
          </h2>
          <p className="text-[10px] md:text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Perbandingan tingkat keberhasilan responden menjawab soal pemahaman
            narasi (Multiple Choice) antara kelompok.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="h-28 bg-slate-800/50 rounded-2xl animate-pulse"></div>
            <div className="h-28 bg-slate-800/50 rounded-2xl animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* CHART 1: POLITIK */}
            <div className="bg-slate-950/40 p-5 md:p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-black text-white flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                  Kel. Politik
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                  {totalPolMC} Soal
                </p>
              </div>

              {totalPolMC === 0 ? (
                <div className="h-10 bg-slate-900 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500 italic">
                  Belum ada partisipan
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-8 md:h-10 flex rounded-xl overflow-hidden shadow-inner border border-slate-800">
                    <div
                      className="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center text-white font-black text-[10px] transition-all duration-1000 ease-out"
                      style={{ width: `${polCorrectPct}%` }}
                    >
                      {polCorrectPct > 10 && `${polCorrectPct}%`}
                    </div>
                    <div
                      className="bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.5)] flex items-center justify-center text-white font-black text-[10px] transition-all duration-1000 ease-out"
                      style={{ width: `${polWrongPct}%` }}
                    >
                      {polWrongPct > 10 && `${polWrongPct}%`}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] md:text-xs uppercase tracking-widest bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-400">
                      Benar:{" "}
                      <span className="text-emerald-400">
                        {stats.mcPolitikCorrect}
                      </span>
                    </span>
                    <span className="font-bold text-slate-400">
                      <span className="text-rose-400">
                        {stats.mcPolitikWrong}
                      </span>{" "}
                      :Salah
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* CHART 2: INDUSTRI */}
            <div className="bg-slate-950/40 p-5 md:p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-black text-white flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                  Kel. Industri
                </h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                  {totalIndMC} Soal
                </p>
              </div>

              {totalIndMC === 0 ? (
                <div className="h-10 bg-slate-900 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-[10px] text-slate-500 italic">
                  Belum ada partisipan
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-8 md:h-10 flex rounded-xl overflow-hidden shadow-inner border border-slate-800">
                    <div
                      className="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center text-white font-black text-[10px] transition-all duration-1000 ease-out"
                      style={{ width: `${indCorrectPct}%` }}
                    >
                      {indCorrectPct > 10 && `${indCorrectPct}%`}
                    </div>
                    <div
                      className="bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.5)] flex items-center justify-center text-white font-black text-[10px] transition-all duration-1000 ease-out"
                      style={{ width: `${indWrongPct}%` }}
                    >
                      {indWrongPct > 10 && `${indWrongPct}%`}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] md:text-xs uppercase tracking-widest bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-400">
                      Benar:{" "}
                      <span className="text-emerald-400">
                        {stats.mcIndustriCorrect}
                      </span>
                    </span>
                    <span className="font-bold text-slate-400">
                      <span className="text-rose-400">
                        {stats.mcIndustriWrong}
                      </span>{" "}
                      :Salah
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
