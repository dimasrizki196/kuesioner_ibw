"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Step3Narasi() {
  const router = useRouter();
  const [surveyType, setSurveyType] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pdfPath, setPdfPath] = useState<string>("");

  useEffect(() => {
    // 1. PROTEKSI HALAMAN (GUARDRAIL)
    // Cek apakah data identitas dari Step 2 sudah ada di memori.
    // JANGAN cek survey_type di sini, karena survey_type baru akan dibuat di bawah.
    const respondentData = localStorage.getItem("respondent_data");

    if (!respondentData) {
      // Kalau tidak ada data diri, tendang balik ke awal!
      router.push("/step-1");
      return;
    }

    // 2. CEK ATAU BUAT TIPE SURVEI (RANDOMIZER)
    let type = localStorage.getItem("survey_type");

    if (!type) {
      const types = ["politik", "industri"];
      type = types[Math.floor(Math.random() * types.length)];
      localStorage.setItem("survey_type", type);
    }

    setSurveyType(type);

    // 3. TENTUKAN FILE PDF YANG DITAMPILKAN
    if (type === "politik") {
      setPdfPath("/NARASI_POLITIK.pdf");
    } else {
      setPdfPath("/NARASI_EKONOMI.pdf");
    }
  }, [router]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-x-hidden font-serif selection:bg-blue-500/20">
      {/* BACKGROUND PURE CODING: DEEP SPACE */}
      <div className="fixed inset-0 z-0 bg-[#000105]">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[60vh] h-[60vh] bg-sky-900 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[60vh] h-[60vh] bg-indigo-900 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg md:max-w-6xl my-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-slate-950/40 backdrop-blur-3xl border border-slate-800 rounded-[45px] shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row h-full md:max-h-[800px]">
          {/* --- SIDEBAR --- */}
          <div className="w-full md:w-[30%] bg-[#080c1d]/80 p-8 md:p-12 text-white flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-700">
            <div>
              <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase text-blue-400/60 tracking-[0.3em] hover:text-white transition-colors font-serif"
              >
                ← Kembali
              </button>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6 font-serif">
                Step 03/05
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-none italic mb-4 tracking-tighter font-serif">
                STUDI <br /> NARASI
              </h1>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] font-serif">
                {surveyType === "politik"
                  ? "BEHIND THE POWER!"
                  : "BEHIND THE ECO!"}
              </p>
            </div>

            <div className="pt-8 border-t border-slate-800 space-y-4">
              <p className="text-[11px] text-blue-300/60 italic leading-relaxed font-serif">
                *Harap baca dokumen di samping dengan saksama. Anda akan
                diberikan pertanyaan berdasarkan narasi ini pada tahap
                selanjutnya.
              </p>
              <button
                onClick={() => setShowPopup(true)}
                className="w-full py-4 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all font-serif"
              >
                🔍 Perbesar Dokumen
              </button>
            </div>
          </div>

          {/* --- MAIN CONTENT AREA (PDF VIEWER) --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50">
            <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center">
              {/* FRAME PDF DI DALAM KARTU */}
              {pdfPath ? (
                <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-slate-700 shadow-inner bg-white">
                  <iframe
                    src={`${pdfPath}#toolbar=0`}
                    className="w-full h-full border-none"
                    title="Narasi Penelitian"
                  />
                </div>
              ) : (
                <p className="text-slate-500 animate-pulse font-serif">
                  Memuat dokumen...
                </p>
              )}
            </div>

            {/* NEXT STEP BUTTON */}
            <div className="p-8 border-t border-slate-800 bg-black/40 shrink-0">
              <button
                // Diarahkan langsung ke Step 4 (Kuesioner)
                onClick={() => router.push("/step-4")}
                className="group relative w-full py-6 bg-white text-black rounded-[28px] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-slate-200 transition-all active:scale-95 shadow-2xl overflow-hidden font-serif flex items-center justify-center gap-2"
              >
                <span className="relative z-10 italic">
                  Lanjut ke Pertanyaan
                </span>
                <span className="relative z-10 text-lg group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- POP-UP DETAIL FULLSCREEN PDF --- */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setShowPopup(false)}
          ></div>

          <div className="relative bg-slate-900 border border-slate-700 w-full max-w-5xl h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden">
            {/* Header Pop-up */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-black/50 shrink-0">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-serif">
                Membaca: Narasi
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="text-slate-400 hover:text-white text-3xl font-light leading-none"
              >
                ×
              </button>
            </div>

            {/* PDF Viewer Fullscreen */}
            <div className="flex-1 w-full bg-slate-100">
              <iframe
                src={`${pdfPath}`}
                className="w-full h-full border-none"
                title="Narasi Penelitian Full"
              />
            </div>

            {/* Footer Pop-up */}
            <div className="p-6 border-t border-slate-800 text-center bg-black/50 shrink-0">
              <button
                onClick={() => setShowPopup(false)}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all font-serif"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
