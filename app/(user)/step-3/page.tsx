"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Step3Instruksi() {
  const router = useRouter();
  const [randomType, setRandomType] = useState<string>("");

  useEffect(() => {
    // Logika Random: Menentukan kelompok responden
    const types = ["umum", "conspiracy"];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    setRandomType(selectedType);

    // Simpan di localStorage agar Step 4 tahu harus ambil soal yang mana
    localStorage.setItem("survey_type", selectedType);
  }, []);

  const handleNext = () => {
    router.push("/step-4");
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-lg md:max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[92vh] md:max-h-[700px]">
        {/* --- SIDEBAR --- */}
        <div className="w-full md:w-[32%] bg-[#0f172a] p-6 md:p-10 text-white flex flex-col justify-between shrink-0">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
            >
              ← Kembali
            </button>
            <div className="inline-block w-fit px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
              Step 03/05
            </div>
            <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2">
              Petunjuk Pengisian
            </h1>
          </div>
          <div className="hidden md:block">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-2">
              Sistem Acak Aktif
            </p>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white p-6 md:p-12 justify-between">
          <div className="space-y-6 text-slate-600">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">
                Bacalah dengan Seksama
              </h2>
              <p className="text-sm">
                Berikut adalah panduan sebelum Anda menjawab butir-butir
                pernyataan:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                <div className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg">
                  💡
                </div>
                <p className="text-xs leading-relaxed">
                  Pilihlah jawaban yang <strong>paling sesuai</strong> dengan
                  kondisi Anda saat ini, tanpa ada paksaan dari pihak mana pun.
                </p>
              </div>

              <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                <div className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg">
                  🕒
                </div>
                <p className="text-xs leading-relaxed">
                  Tidak ada jawaban benar atau salah. Kerjakan dengan santai,
                  waktu yang dibutuhkan sekitar <strong>10 menit</strong>.
                </p>
              </div>

              <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center">
                <div className="w-10 h-10 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg">
                  🔒
                </div>
                <p className="text-xs leading-relaxed">
                  Jawaban Anda akan <strong>terenkripsi otomatis</strong> dan
                  hanya dapat diakses oleh peneliti untuk kepentingan akademis.
                </p>
              </div>
            </div>

            {/* DEBUG INFO: Hanya muncul saat development jika kamu mau cek */}
            <p className="text-[9px] text-slate-300 italic text-center uppercase tracking-widest pt-4">
              Sistem telah mengalokasikan tipe kuesioner secara otomatis.
            </p>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-6">
            <button
              onClick={handleNext}
              className="w-full py-5 bg-[#0f172a] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Mulai Mengerjakan
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
