"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step1InformedConsent() {
  const router = useRouter();
  const [agreed, setAgreed] = useState<boolean | null>(null);

  const handleNext = () => {
    if (agreed === true) {
      router.push("/step-2");
    } else {
      alert("Mohon maaf, Anda harus memberikan persetujuan untuk melanjutkan.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-lg md:max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[92vh] md:max-h-[700px]">
        {/* --- SIDEBAR INFO --- */}
        <div className="w-full md:w-[32%] bg-[#0f172a] p-6 md:p-10 text-white flex flex-col justify-between shrink-0">
          <div>
            {/* Tombol Kembali (Mobile) */}
            <button
              onClick={() => router.back()}
              className="md:hidden mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest hover:text-white transition-colors"
            >
              ← Kembali
            </button>

            <div className="inline-block w-fit px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
              Step 01/05
            </div>
            <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2">
              Informed <br className="hidden md:block" /> Consent
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed opacity-80 uppercase tracking-widest font-bold">
              Fakultas Psikologi UMS
            </p>
          </div>

          {/* Tombol Kembali (Desktop) */}
          <button
            onClick={() => router.back()}
            className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-widest hover:text-white transition-colors"
          >
            <span className="text-lg">←</span> Kembali ke Beranda
          </button>
        </div>

        {/* --- TEXT CONTENT --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <div className="flex-1 p-5 md:p-10 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 md:space-y-4 text-slate-700 text-[11px] md:text-[13px] leading-[1.5]">
              <p className="font-bold text-slate-900 font-serif italic">
                Assalamu’alaikum Warahmatullahi Wabarakatuh,
              </p>

              <p>
                Perkenalkan, saya <strong>Iqbal Bhayu Wicaksono</strong>,
                mahasiswa Fakultas Psikologi Universitas Muhammadiyah Surakarta
                yang saat ini sedang menyusun penelitian tugas akhir di bawah
                bimbingan{" "}
                <strong>Bapak Audi Ahmad Rikardi, S. Psi., M.A.</strong> untuk
                memenuhi salah satu syarat memperoleh gelar Sarjana Psikologi.
                Saya mengundang Saudara/i untuk berpartisipasi dengan mengisi
                kuesioner penelitian. Waktu pengisian kurang lebih 10–15 menit.
              </p>

              {/* Kriteria Responden */}
              <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 space-y-2">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  Adapun kriteria responden yang dibutuhkan:
                </p>
                <div className="space-y-1 font-medium text-slate-800">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold mt-0.5">
                      1
                    </span>
                    <p>
                      Berusia minimal 18 tahun dan maksimal 25 tahun pada saat
                      pengisian kuesioner.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold mt-0.5">
                      2
                    </span>
                    <p>Mampu membaca dan memahami Bahasa Indonesia.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold mt-0.5">
                      3
                    </span>
                    <p>WNI yang berdomisili di Indonesia.</p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] md:text-[11px] leading-relaxed">
                Seluruh identitas dan informasi yang Saudara/i berikan akan
                dijaga kerahasiaannya dan hanya digunakan untuk keperluan
                penelitian. Saudara/i terlibat dalam penelitian ini secara
                sukarela dan memiliki hak untuk tidak berpartisipasi serta
                berhak mengundurkan diri di tengah proses penelitian. Besar
                harapan saya Saudara/i berkenan meluangkan waktu untuk
                berpartisipasi. Terima kasih atas perhatian dan kesediaannya.
                Semoga Allah SWT senantiasa memberikan kesehatan, kemudahan, dan
                keberkahan dalam setiap langkah kita.
              </p>

              {/* Narahubung */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 pt-2 border-t border-slate-100">
                <p className="text-[9px] text-slate-500 flex items-center gap-1">
                  📧 f100220218@student.ums.ac.id
                </p>
                <a
                  href="https://wa.me/6281295568720"
                  className="text-[9px] text-blue-600 font-bold flex items-center gap-1 underline underline-offset-2"
                >
                  💬 WA: 081295568720
                </a>
              </div>
            </div>

            {/* Area Konfirmasi */}
            <div className="pt-4 space-y-3 shrink-0">
              <p className="text-[11px] font-black text-slate-900 text-center uppercase tracking-wider">
                Apakah Anda bersedia berpartisipasi?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setAgreed(true)}
                  className={`flex-1 py-4 rounded-2xl font-bold text-[11px] transition-all border-2 ${
                    agreed === true
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-white border-slate-100 text-slate-400 hover:border-blue-200"
                  }`}
                >
                  Ya, Bersedia
                </button>
                <button
                  onClick={() => setAgreed(false)}
                  className={`flex-1 py-4 rounded-2xl font-bold text-[11px] transition-all border-2 ${
                    agreed === false
                      ? "bg-slate-800 border-slate-800 text-white"
                      : "bg-white border-slate-100 text-slate-400 hover:border-red-200"
                  }`}
                >
                  Tidak Bersedia
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={agreed !== true}
                className="w-full py-5 bg-[#0f172a] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl disabled:opacity-10 transition-all active:scale-[0.98]"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
