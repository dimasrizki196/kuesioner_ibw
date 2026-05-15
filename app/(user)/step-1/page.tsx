"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step1InformedConsent() {
  const router = useRouter();
  const [agreed, setAgreed] = useState<boolean | null>(null);

  const handleNext = () => {
    if (agreed === true) {
      // 1. Bersihkan session lama (jaga-jaga kalau dia mengulang kuesioner)
      localStorage.clear();

      // 2. Catat Waktu Mulai (dalam milliseconds)
      const startTime = Date.now();
      localStorage.setItem("start_time", startTime.toString());

      // 3. Lanjut ke Step 2
      router.push("/step-2");
    } else {
      alert("Mohon maaf, Anda harus memberikan persetujuan untuk melanjutkan.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 md:p-6 overflow-x-hidden font-serif selection:bg-blue-500/20">
      {/* BACKGROUND DEEP SPACE */}
      <div className="fixed inset-0 z-0 bg-[#000105]">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[60vh] h-[60vh] bg-sky-950 rounded-full blur-[120px] opacity-25"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[60vh] h-[60vh] bg-indigo-950 rounded-full blur-[120px] opacity-25"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* CONTAINER UTAMA */}
      <div className="relative z-10 w-full max-w-lg md:max-w-5xl my-auto animate-in fade-in zoom-in-95 duration-1000">
        {/* KARTU DARK GLASS */}
        <div className="bg-slate-950/40 backdrop-blur-3xl border border-slate-800 rounded-[40px] shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row h-full md:max-h-[750px]">
          {/* --- SIDEBAR --- */}
          <div className="w-full md:w-[35%] bg-[#080c1d]/80 p-8 md:p-12 text-slate-100 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-700">
            <div className="space-y-1">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-950/30 border border-blue-800 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6 font-serif">
                Step 01/05
              </div>
              <h1 className="text-3xl md:text-5xl font-black leading-[0.9] tracking-tighter mb-4 italic drop-shadow-lg text-white font-serif">
                INFORMED <br />
                CONSENT
              </h1>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed font-serif">
                Fakultas Psikologi <br />
                UMS
              </p>
            </div>

            <div className="mt-10 space-y-4 pt-8 border-t border-slate-700 font-serif">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-serif">
                  Narahubung / Email
                </p>
                <p className="text-[11px] font-bold text-blue-400 break-all font-serif">
                  f100220218@student.ums.ac.id
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-serif">
                  WhatsApp Support
                </p>
                <p className="text-[11px] font-bold text-blue-400 font-serif">
                  0812-9556-8720
                </p>
              </div>
            </div>
          </div>

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent font-serif">
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 custom-scrollbar text-slate-300 font-serif leading-relaxed">
              <div className="space-y-4 leading-relaxed font-serif">
                <p className="font-bold text-white italic text-sm md:text-base font-serif">
                  Assalamu’alaikum Warahmatullahi Wabarakatuh,
                </p>

                <p className="text-xs md:text-sm opacity-95 font-serif">
                  Perkenalkan, saya <strong>Iqbal Bhayu Wicaksono</strong>,
                  mahasiswa Fakultas Psikologi Universitas Muhammadiyah
                  Surakarta. Saya mengundang Saudara/i untuk berpartisipasi
                  dalam penelitian tugas akhir saya di bawah bimbingan{" "}
                  <strong>Bapak Audi Ahmad Rikardi, S. Psi., M.A.</strong>
                </p>

                <div className="p-5 bg-blue-950/20 border border-blue-900 rounded-2xl font-serif">
                  <p className="text-[10px] md:text-[11px] font-bold text-blue-300 leading-relaxed italic tracking-wide font-serif">
                    "Penelitian ini sudah memenuhi Kelayakan Etik No.
                    6310/B.1/KEPK-FKUMS/IV/2026"
                  </p>
                </div>

                <div className="bg-slate-800/30 p-8 rounded-[40px] border border-slate-700 space-y-4 font-serif">
                  <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] font-serif">
                    Kriteria Responden:
                  </p>
                  <ul className="space-y-4 text-xs md:text-sm font-serif">
                    <li className="flex gap-4 items-start font-serif">
                      <span className="text-blue-500 font-black font-serif">
                        01.
                      </span>{" "}
                      Berusia 18 - 25 tahun saat pengisian kuesioner.
                    </li>
                    <li className="flex gap-4 items-start font-serif">
                      <span className="text-blue-500 font-black font-serif">
                        02.
                      </span>{" "}
                      Mampu memahami Bahasa Indonesia dengan baik.
                    </li>
                    <li className="flex gap-4 items-start font-serif">
                      <span className="text-blue-500 font-black font-serif">
                        03.
                      </span>{" "}
                      WNI yang berdomisili di Indonesia.
                    </li>
                  </ul>
                </div>

                <p className="text-[11px] opacity-50 italic pt-4 font-serif">
                  Partisipasi dalam penelitian ini bersifat sukarela, sehingga
                  keterlibatan Anda merupakan keputusan pribadi tanpa adanya
                  paksaan dari pihak manapun. Seluruh data dan informasi yang
                  Anda berikan akan dijaga kerahasiaannya dan hanya digunakan
                  untuk kepentingan penelitian. Hasil Penelitian ini akan
                  dipublikasikan untuk kepentingan akademik tanpa mencantumkan
                  identitas pribadi responden, sehingga privasi Anda tetap
                  terjamin.
                </p>
              </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="p-8 md:p-12 bg-black/60 border-t border-slate-800 shrink-0 space-y-6 font-serif">
              <p className="text-[10px] font-black text-slate-500 text-center uppercase tracking-[0.3em] font-serif">
                Apakah Anda bersedia berpartisipasi?
              </p>

              <div className="flex gap-3 font-serif">
                <button
                  onClick={() => setAgreed(true)}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 font-serif ${
                    agreed === true
                      ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                      : "bg-white/5 border-slate-700 text-slate-500 hover:border-blue-500 hover:text-white"
                  }`}
                >
                  Ya, Bersedia
                </button>
                <button
                  onClick={() => setAgreed(false)}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 font-serif ${
                    agreed === false
                      ? "bg-slate-200 border-slate-200 text-black hover:border-slate-300"
                      : "bg-white/5 border-slate-700 text-slate-500 hover:border-red-500 hover:text-white"
                  }`}
                >
                  Tidak
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={agreed !== true}
                className="group relative w-full py-6 bg-white text-black rounded-[28px] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl disabled:opacity-20 transition-all active:scale-95 overflow-hidden font-serif"
              >
                <span className="relative z-10 italic font-serif">
                  Lanjutkan Pengisian
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
