"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const TARGET_RESPONDENTS = 70;

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 font-sans bg-slate-50 min-h-screen">
      <header>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Executive Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Pantauan real-time eksperimen psikologi (Target: {TARGET_RESPONDENTS}{" "}
          Responden).
        </p>
      </header>

      {/* SECTION 1: TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Progress Pencapaian */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4">
              🎯
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Total Responden
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-4xl font-black text-slate-800">
                {stats.totalRespondents}
              </p>
              <p className="text-sm font-bold text-slate-400">
                / {TARGET_RESPONDENTS}
              </p>
            </div>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-right mt-2 text-blue-600 font-bold">
              {progressPercent}% Tercapai
            </p>
          </div>
        </div>

        {/* Card 2: Keseimbangan Kelompok */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-4">
            ⚖️
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Distribusi Kelompok
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-red-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
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
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-1000"
                  style={{
                    width: `${stats.totalRespondents > 0 ? (stats.politikCount / stats.totalRespondents) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>{" "}
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
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-1000"
                  style={{
                    width: `${stats.totalRespondents > 0 ? (stats.industriCount / stats.totalRespondents) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Rata-rata Waktu */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4">
              ⏱️
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Rata-Rata Pengerjaan
            </p>
            <p className="text-4xl font-black text-emerald-600 mt-1">
              {formatTime(stats.avgDurationSec)}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl mt-4 border border-slate-100">
            <p className="text-[10px] text-slate-500 leading-relaxed italic font-medium">
              *Perhatikan waktu rata-rata. Waktu yang terlalu singkat berpotensi
              mengindikasikan responden tidak membaca narasi dengan saksama.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: KOMPARASI MANIPULATION CHECK */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🧠</span> Manipulation Check Success Rate
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Perbandingan tingkat keberhasilan partisipan dalam menjawab soal
            pemahaman narasi (Multiple Choice) antara Kelompok Politik dan
            Kelompok Industri.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* CHART 1: POLITIK */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>{" "}
                  Kelompok Politik
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {totalPolMC} Total Soal
                </p>
              </div>
              {totalPolMC === 0 ? (
                <div className="h-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 italic">
                  Belum ada data
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-10 flex rounded-xl overflow-hidden shadow-inner border border-slate-100">
                    <div
                      className="bg-emerald-500 flex items-center justify-center text-white font-black text-xs transition-all duration-1000"
                      style={{ width: `${polCorrectPct}%` }}
                    >
                      {polCorrectPct > 10 && `${polCorrectPct}%`}
                    </div>
                    <div
                      className="bg-rose-500 flex items-center justify-center text-white font-black text-xs transition-all duration-1000"
                      style={{ width: `${polWrongPct}%` }}
                    >
                      {polWrongPct > 10 && `${polWrongPct}%`}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">
                      Benar:{" "}
                      <span className="text-emerald-600">
                        {stats.mcPolitikCorrect}
                      </span>
                    </span>
                    <span className="font-bold text-slate-600">
                      <span className="text-rose-600">
                        {stats.mcPolitikWrong}
                      </span>{" "}
                      :Salah
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* CHART 2: INDUSTRI */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>{" "}
                  Kelompok Industri
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {totalIndMC} Total Soal
                </p>
              </div>
              {totalIndMC === 0 ? (
                <div className="h-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 italic">
                  Belum ada data
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-10 flex rounded-xl overflow-hidden shadow-inner border border-slate-100">
                    <div
                      className="bg-emerald-500 flex items-center justify-center text-white font-black text-xs transition-all duration-1000"
                      style={{ width: `${indCorrectPct}%` }}
                    >
                      {indCorrectPct > 10 && `${indCorrectPct}%`}
                    </div>
                    <div
                      className="bg-rose-500 flex items-center justify-center text-white font-black text-xs transition-all duration-1000"
                      style={{ width: `${indWrongPct}%` }}
                    >
                      {indWrongPct > 10 && `${indWrongPct}%`}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600">
                      Benar:{" "}
                      <span className="text-emerald-600">
                        {stats.mcIndustriCorrect}
                      </span>
                    </span>
                    <span className="font-bold text-slate-600">
                      <span className="text-rose-600">
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
