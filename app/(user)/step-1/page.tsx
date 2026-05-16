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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden selection:bg-blue-500/20 font-serif">
      {/* BACKGROUND DEEP SPACE NAVY X WARM COFFEE GLOW */}
      <div className="fixed inset-0 z-0 bg-[#020514] overflow-hidden pointer-events-none">
        {/* 1. Efek Bintang / Grid Kosmik */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20"></div>

        {/* 2. Pendaran Kosmik Kanan Atas: Deep Sky Blue Navy */}
        <div className="absolute -top-1/4 -right-1/4 w-[75vh] h-[75vh] bg-sky-600 rounded-full blur-[140px] opacity-20 mix-blend-screen"></div>

        {/* 3. Pendaran Kosmik Kiri Bawah: WARM ROASTED COFFEE */}
        <div className="absolute -bottom-1/4 -left-1/4 w-[80vh] h-[80vh] bg-gradient-to-tr from-amber-700 via-orange-900 to-transparent rounded-full blur-[130px] opacity-25 mix-blend-screen"></div>

        {/* 4. Ambient Cahaya Kopi Tengah */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-yellow-950/20 rounded-full blur-[120px]"></div>

        {/* 5. ☕ BIJI KOPI CSS (KONSISTEN DENGAN LANDING PAGE) ☕ */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none">
          {/* Biji Kopi CSS 1 (Atas) */}
          <div className="absolute top-[20%] right-[12%] w-16 h-24 bg-[#3d251e] rounded-[50%] rotate-45 opacity-40 blur-[2px] shadow-2xl">
            <div className="absolute top-[5%] left-1/2 w-[2px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>

          {/* Biji Kopi CSS 2 (Tengah) */}
          <div className="absolute top-[55%] right-[22%] w-12 h-16 bg-[#4e342e] rounded-[50%] -rotate-12 opacity-30 blur-[1px]">
            <div className="absolute top-[5%] left-1/2 w-[2px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>

          {/* Biji Kopi CSS 3 (Bawah) */}
          <div className="absolute bottom-[15%] right-[8%] w-24 h-32 bg-[#2b1814] rounded-[50%] rotate-[110deg] opacity-50 drop-shadow-2xl">
            <div className="absolute top-[5%] left-1/2 w-[3px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>
        </div>

        {/* 6. Lapisan Tint Gelap Penutup */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-amber-950/20 backdrop-blur-[1px]"></div>
      </div>

      {/* CONTAINER UTAMA / MODAL */}
      <div className="relative z-10 w-full max-w-5xl h-full md:h-[85vh] my-auto animate-in fade-in zoom-in-95 duration-700">
        {/* KARTU DARK GLASS */}
        <div className="bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full">
          {/* --- SIDEBAR PROGRESS --- */}
          <div className="w-full md:w-[32%] bg-[#080c1d]/90 p-8 md:p-12 text-slate-100 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80">
            <div className="space-y-4 md:space-y-6">
              {/* Indikator Step */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-800/50 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-blue-300 font-sans text-[10px] font-black uppercase tracking-[0.3em]">
                  Step 01/06
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight mb-2 italic drop-shadow-md text-white">
                  INFORMED <br />
                  CONSENT
                </h1>
                <p className="text-slate-400 text-xs font-bold tracking-widest leading-relaxed">
                  Fakultas Psikologi <br />
                  Universitas Muhammadiyah Surakarta
                </p>
              </div>
            </div>

            {/* Info Kontak (Hanya tampil penuh di Desktop) */}
            <div className="hidden md:block mt-8 space-y-5 pt-8 border-t border-slate-800/60">
              <div className="space-y-1.5">
                <p className="text-[9px] font-sans font-black text-slate-500 uppercase tracking-widest">
                  Narahubung / Email
                </p>
                {/* Link langsung buka aplikasi Email */}
                <a
                  href="mailto:f100220218@student.ums.ac.id"
                  className="block text-xs font-bold text-blue-400 break-all transition-all duration-300 hover:text-blue-300 hover:underline underline-offset-4 cursor-pointer"
                >
                  f100220218@student.ums.ac.id
                </a>
              </div>
              <div className="space-y-1.5">
                <p className="text-[9px] font-sans font-black text-slate-500 uppercase tracking-widest">
                  WhatsApp Support
                </p>
                {/* Link langsung buka chat WhatsApp (nomor format 62) */}
                <a
                  href="https://wa.me/6281295568720"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs font-bold text-blue-400 transition-all duration-300 hover:text-blue-300 hover:underline underline-offset-4 cursor-pointer"
                >
                  0812-9556-8720
                </a>
              </div>
            </div>
          </div>

          {/* --- CONTENT AREA (SCROLLABLE) --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 custom-scrollbar text-slate-300 leading-relaxed scroll-smooth">
              {/* Teks Pembuka */}
              <div className="space-y-5">
                <p className="font-bold text-white italic text-sm md:text-base">
                  Assalamu’alaikum Warahmatullahi Wabarakatuh,
                </p>
                <p className="text-xs md:text-sm opacity-95 text-justify">
                  Perkenalkan, saya{" "}
                  <strong className="text-blue-300">
                    Iqbal Bhayu Wicaksono
                  </strong>
                  , mahasiswa Fakultas Psikologi Universitas Muhammadiyah
                  Surakarta. Saya mengundang Saudara/i untuk berpartisipasi
                  dalam penelitian tugas akhir saya di bawah bimbingan{" "}
                  <strong className="text-slate-200">
                    Bapak Audi Ahmad Rikardi, S. Psi., M.A.
                  </strong>
                </p>
              </div>

              {/* Box Kelayakan Etik */}
              <div className="p-5 bg-blue-950/20 border-l-4 border-l-blue-500 border border-y-blue-900/30 border-r-blue-900/30 rounded-r-2xl shadow-inner">
                <p className="text-[11px] font-bold text-blue-300 leading-relaxed italic tracking-wide">
                  "Penelitian ini sudah memenuhi Kelayakan Etik No.
                  6310/B.1/KEPK-FKUMS/IV/2026"
                </p>
              </div>

              {/* Kriteria Responden */}
              <div className="bg-slate-900/40 p-6 md:p-8 rounded-[32px] border border-slate-800 space-y-5">
                <p className="text-[11px] font-sans font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Kriteria Responden:
                </p>
                <ul className="space-y-4 text-xs md:text-sm">
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-500 font-sans font-black mt-0.5">
                      01.
                    </span>
                    <span className="opacity-90">
                      Berusia 18 - 25 tahun saat pengisian kuesioner.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-500 font-sans font-black mt-0.5">
                      02.
                    </span>
                    <span className="opacity-90">
                      Mampu memahami Bahasa Indonesia dengan baik.
                    </span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-amber-500 font-sans font-black mt-0.5">
                      03.
                    </span>
                    <span className="opacity-90">
                      WNI yang berdomisili di Indonesia.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Teks Penutup / Jaminan Privasi */}
              <p className="text-[11px] md:text-xs text-slate-400 italic pt-2 text-justify">
                Partisipasi dalam penelitian ini bersifat sukarela, sehingga
                keterlibatan Anda merupakan keputusan pribadi tanpa adanya
                paksaan dari pihak manapun. Seluruh data dan informasi yang Anda
                berikan akan{" "}
                <strong className="text-slate-300 font-normal">
                  dijaga kerahasiaannya
                </strong>{" "}
                dan hanya digunakan untuk kepentingan akademik tanpa
                mencantumkan identitas pribadi responden.
              </p>
            </div>

            {/* --- ACTION FOOTER --- */}
            <div className="p-6 md:p-10 bg-black/40 border-t border-slate-800/80 shrink-0 space-y-6 backdrop-blur-md">
              <p className="text-[10px] font-sans font-black text-slate-500 text-center uppercase tracking-[0.3em]">
                Apakah Anda bersedia berpartisipasi?
              </p>

              <div className="flex gap-3 font-sans">
                <button
                  onClick={() => setAgreed(true)}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 border-2 ${
                    agreed === true
                      ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-[1.02]"
                      : "bg-transparent border-slate-700 text-slate-400 hover:border-blue-500/50 hover:text-white hover:bg-blue-900/20"
                  }`}
                >
                  Ya, Bersedia
                </button>
                <button
                  onClick={() => setAgreed(false)}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 border-2 ${
                    agreed === false
                      ? "bg-red-600/20 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)] scale-[1.02]"
                      : "bg-transparent border-slate-700 text-slate-400 hover:border-red-500/50 hover:text-white hover:bg-red-900/20"
                  }`}
                >
                  Tidak
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={agreed !== true}
                className="group relative w-full py-5 bg-white text-black rounded-[24px] font-sans font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] overflow-hidden flex items-center justify-center gap-2"
              >
                <span className="relative z-10 italic">
                  Lanjutkan Pengisian
                </span>
                {/* Animasi Shimmer (Hanya jalan saat tombol aktif/agreed true) */}
                {agreed === true && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
