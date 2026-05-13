"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResultDashboard() {
  const [respondents, setRespondents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    // Mengambil data responden dan menghitung jumlah jawaban mereka
    const { data, error } = await supabase
      .from("respondents")
      .select(`
        *,
        answers (id)
      `)
      .order("created_at", { ascending: false });

    if (data) setRespondents(data);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Hasil Responden</h1>
        <p className="text-gray-500">Daftar partisipan yang telah menyelesaikan kuesioner.</p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Nama Responden</th>
              <th className="p-4 font-semibold text-gray-600">Tipe</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Keyakinan</th>
              <th className="p-4 font-semibold text-gray-600">Tanggal</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Memuat data responden...</td></tr>
            ) : respondents.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">Belum ada responden.</td></tr>
            ) : (
              respondents.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      r.assigned_type === 'conspiracy' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.assigned_type}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono font-bold text-blue-600">
                    {r.confidence_score}%
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(r.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                      onClick={() => alert(`Fitur detail jawaban untuk ID: ${r.id} sedang dikembangkan.`)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}