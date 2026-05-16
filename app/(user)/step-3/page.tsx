"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Memuat CDN PDF.js secara dinamis agar kompatibel dengan Next.js Client Component tanpa ribet install local binary
const PDFJS_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function Step3Narasi() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [surveyType, setSurveyType] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pdfPath, setPdfPath] = useState<string>("");
  const [hasRead, setHasRead] = useState(false);

  // STATE BARU: Manajemen Skala Zoom PDF Dinamis (Aman untuk Mobile & Fullscreen)
  const [zoomScale, setZoomScale] = useState(1.0);
  const [popupZoomScale, setPopupZoomScale] = useState(1.2);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfDocPopup, setPdfDocPopup] = useState<any>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  useEffect(() => {
    // 1. PROTEKSI HALAMAN (GUARDRAIL)
    const respondentData = localStorage.getItem("respondent_data");
    if (!respondentData) {
      router.push("/step-1");
      return;
    }

    // 2. RANDOMIZER KELOMPOK
    let type = localStorage.getItem("survey_type");
    if (!type) {
      const types = ["politik", "industri"];
      type = types[Math.floor(Math.random() * types.length)];
      localStorage.setItem("survey_type", type);
    }
    setSurveyType(type);

    const path =
      type === "politik" ? "/NARASI_POLITIK.pdf" : "/NARASI_EKONOMI.pdf";
    setPdfPath(path);

    // 3. LOGIKA MEMUAT ENGINE MOZILLA PDF.JS SEBAGAI CANVAS RENDERER
    const loadPdfEngine = async () => {
      try {
        if (typeof window !== "undefined") {
          // Injeksi Script PDFJS ke Window jika belum ada
          if (!(window as any).pdfjsLib) {
            const script = document.createElement("script");
            script.src = PDFJS_CDN;
            script.async = true;
            document.body.appendChild(script);
            await new Promise((resolve) => (script.onload = resolve));
          }

          const pdfjsLib = (window as any).pdfjsLib;
          pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;

          // Ambil dokumen untuk area utama
          const doc = await pdfjsLib.getDocument(path).promise;
          setPdfDoc(doc);
          setIsPdfLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat engine PDF:", err);
        setIsPdfLoading(false);
      }
    };

    loadPdfEngine();
  }, [router]);

  // LOGIKA RENDER HALAMAN UTAMA KE CANVAS (SETIAP ZOOM BERUBAH)
  useEffect(() => {
    if (!pdfDoc) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(1); // Ambil halaman pertama narasi
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Sesuaikan viewport berdasarkan skala zoom state
        const viewport = page.getViewport({ scale: zoomScale });

        // Atur resolusi internal canvas tinggi agar tulisan tajam saat di-zoom di HP
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Gagal merender halaman PDF:", err);
      }
    };

    renderPage();
  }, [pdfDoc, zoomScale]);

  // FUNGSI KONTROL ZOOM UNTUK RESPONDEN VIA HP
  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () =>
    setZoomScale((prev) => Math.max(prev - 0.25, 0.75));

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden selection:bg-blue-500/20 font-serif">
      {/* BACKGROUND DEEP SPACE */}
      <div className="fixed inset-0 z-0 bg-[#020514] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[75vh] h-[75vh] bg-sky-600 rounded-full blur-[140px] opacity-20 mix-blend-screen"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[80vh] h-[80vh] bg-gradient-to-tr from-amber-700 via-orange-900 to-transparent rounded-full blur-[130px] opacity-25 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-amber-950/20 backdrop-blur-[1px]"></div>
      </div>

      {/* CONTAINER MODAL */}
      <div className="relative z-10 w-full max-w-5xl h-full md:h-[85vh] my-auto animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full">
          {/* SIDEBAR PROGRESS PANEL */}
          <div className="w-full md:w-[35%] bg-[#080c1d]/90 p-6 md:p-12 text-slate-100 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80">
            <div className="space-y-4 md:space-y-6">
              <button
                onClick={() => router.back()}
                className="mb-2 flex items-center gap-2 text-[9px] font-sans font-black uppercase text-blue-400/60 tracking-[0.3em] hover:text-white transition-colors w-fit"
              >
                ← Kembali
              </button>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-800/50 shadow-inner w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-blue-300 font-sans text-[10px] font-black uppercase tracking-[0.3em]">
                  Step 03/06
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tight mb-2 italic drop-shadow-md text-white">
                  STUDI <br /> NARASI
                </h1>
                <span className="inline-block mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-sans font-black uppercase tracking-widest rounded-md">
                  {surveyType === "politik"
                    ? "BEHIND THE POWER!"
                    : "BEHIND THE ECO!"}
                </span>
              </div>
            </div>

            <div className="mt-6 md:mt-8 space-y-4 pt-4 md:pt-8 border-t border-slate-800/60">
              <div className="bg-red-950/20 border-l-2 border-red-500/50 p-4 rounded-r-xl">
                <p className="text-[11px] md:text-xs text-red-200/80 italic leading-relaxed text-justify">
                  *Harap baca narasi yang telah disiapkan dengan
                  sungguh-sungguh, agar Anda dapat memahami dan mengevaluasi
                  informasi dengan saksama.
                </p>
              </div>
              <button
                onClick={() => setShowPopup(true)}
                className="w-full flex items-center justify-center gap-3 py-3.5 md:py-5 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-2xl text-[10px] font-sans font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg"
              >
                全画面 MODE LAYAR PENUH
              </button>
            </div>
          </div>

          {/* MAIN CONTENT AREA (INTERACTIVE CANVAS VIEWER DENGAN FITUR ZOOM) */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-start overflow-hidden relative">
              {/* TOMBOL MANAJEMEN ZOOM FLOATING - KHUSUS SMARTPHONE */}
              <div className="absolute top-6 right-6 z-30 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all text-sm"
                  title="Perkecil"
                >
                  −
                </button>
                <span className="text-[9px] font-sans text-slate-400 font-bold px-1 min-w-[45px] text-center uppercase tracking-wider">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all text-sm"
                  title="Perbesar"
                >
                  +
                </button>
              </div>

              {/* Tempat Dokumen Di-render (Scrollable Mulus di Android/iOS) */}
              <div className="w-full h-full rounded-2xl border border-slate-800 bg-slate-950/40 shadow-inner overflow-auto custom-scrollbar flex p-2 justify-center items-start">
                {isPdfLoading ? (
                  <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse my-auto">
                    <div className="w-8 h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[9px] font-sans font-bold uppercase tracking-widest">
                      Sinkronisasi Dokumen...
                    </p>
                  </div>
                ) : (
                  <div className="origin-top transition-transform duration-100 shadow-2xl">
                    <canvas
                      ref={canvasRef}
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ACTION FOOTER DENGAN VALIDASI CHECKBOX */}
            <div className="p-5 md:px-10 md:pb-10 md:pt-6 border-t border-slate-800/80 bg-black/40 shrink-0 backdrop-blur-md flex flex-col gap-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={hasRead}
                    onChange={(e) => setHasRead(e.target.checked)}
                  />
                  <div className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-900/50 peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-all"></div>
                  <svg
                    className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-[11px] md:text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed font-sans">
                  Saya menyatakan bahwa saya telah{" "}
                  <strong className="text-white">membaca dan memahami</strong>{" "}
                  narasi di atas dengan sungguh-sungguh.
                </span>
              </label>

              <button
                onClick={() => router.push("/step-4")}
                disabled={!hasRead}
                className={`group relative w-full py-4 md:py-5 rounded-2xl font-sans font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] shadow-2xl transition-all overflow-hidden flex items-center justify-center gap-3 ${
                  hasRead
                    ? "bg-white text-black active:scale-[0.98] hover:bg-slate-200 cursor-pointer"
                    : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50"
                }`}
              >
                <span className="relative z-10 italic">
                  Lanjut ke Pertanyaan
                </span>
                <svg
                  className={`w-4 h-4 relative z-10 transition-all duration-300 ${hasRead ? "text-amber-500 group-hover:text-blue-600 transform group-hover:translate-x-2" : "text-slate-600"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                {hasRead && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- POP-UP DETAIL FULLSCREEN PDF (MODAL - TERINTEGRASI IFRAME AMAN) --- */}
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-8 animate-in fade-in zoom-in-95 duration-300">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            onClick={() => setShowPopup(false)}
          ></div>
          <div className="relative bg-slate-900 border border-slate-700 w-full max-w-5xl h-[95vh] rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[10px] font-sans font-black text-slate-400 uppercase tracking-widest">
                  Membaca Dokumen Fullscreen
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Untuk Fullscreen, gabungkan iframe native karena area pandang sudah 95vw, sangat lega di mobile */}
            <div className="flex-1 w-full bg-slate-900 p-1 md:p-4">
              <iframe
                src={`${pdfPath}#toolbar=1`}
                className="w-full h-full border-none rounded-xl"
                title="Narasi Penelitian Full"
              />
            </div>

            <div className="p-4 border-t border-slate-800 text-center bg-slate-950 shrink-0">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 text-white rounded-xl font-sans font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-95 transition-all"
              >
                Selesai Membaca & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tambahan Custom Scrollbar CSS Style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
