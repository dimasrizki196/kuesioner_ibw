"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    respondents: 0,
    questions: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    async function getStats() {
      const { count: resCount } = await supabase
        .from("respondents")
        .select("*", { count: "exact", head: true });
      const { count: quesCount } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true });
      setStats({
        respondents: resCount || 0,
        questions: quesCount || 0,
        avgConfidence: 0, // Bisa dihitung nanti dari data asli
      });
    }
    getStats();
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Overview
        </h1>
        <p className="text-gray-500">
          Data statistik penelitian skripsi kamu saat ini.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Responden"
          value={stats.respondents}
          icon="👥"
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Total Soal"
          value={stats.questions}
          icon="📝"
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          title="Rata-rata Yakin"
          value={`${stats.avgConfidence}%`}
          icon="🎯"
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          📈
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Analisis Data Terpusat
        </h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">
          Setelah responden terkumpul lebih dari 10 orang, grafik perbandingan
          tipe kuesioner akan otomatis muncul di sini.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center text-lg mb-4`}
      >
        {icon}
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <p className={`text-4xl font-black ${color} mt-1`}>{value}</p>
    </div>
  );
}
