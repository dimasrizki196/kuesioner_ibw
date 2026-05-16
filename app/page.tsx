import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] font-sans selection:bg-zinc-800 selection:text-white">
      {/* --- SISI CONSPIRACY / ALAM SEMESTA (KIRI) --- */}
      <div className="absolute top-0 left-0 w-full md:w-1/2 h-full pointer-events-none">
        {/* Base gradient navy pekat misterius */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/60 via-transparent to-transparent" />

        {/* LAYER 1: Bintang sangat samar (Existing Field Stars) */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,#64748b_1px,transparent_1px)] [background-size:40px_40px] opacity-10"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, black 20%, transparent 80%)",
          }}
        />

        {/* LAYER 2: Nebula Samar & Redup */}
        <div className="absolute -top-[10%] -left-[10%] w-[50vh] h-[50vh] bg-sky-900 rounded-full blur-[150px] opacity-15 mix-blend-screen" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40vh] h-[40vh] bg-indigo-950 rounded-full blur-[130px] opacity-20 mix-blend-screen" />

        {/* 👇 LAYER 3: NEW - BINTANG BERKILAUAN (SPARKLING STARS) 👇 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Bintang Besar - Kiri Atas */}
          <div
            className="absolute top-[20%] left-[15%] w-1 h-1 bg-white rounded-full animate-sparkle shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ animationDelay: "0s" }}
          />

          {/* Bintang Sedang - Tengah Atas */}
          <div
            className="absolute top-[10%] left-[35%] w-0.5 h-0.5 bg-blue-100 rounded-full animate-sparkle shadow-[0_0_8px_rgba(191,219,254,0.6)]"
            style={{ animationDelay: "1.5s", animationDuration: "4s" }}
          />

          {/* Bintang Besar - Tengah Kiri */}
          <div
            className="absolute top-[45%] left-[10%] w-1 h-1 bg-white rounded-full animate-sparkle shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ animationDelay: "3s", animationDuration: "3s" }}
          />

          {/* Bintang Kecil - Kiri Bawah */}
          <div
            className="absolute top-[75%] left-[20%] w-0.5 h-0.5 bg-sky-100 rounded-full animate-sparkle shadow-[0_0_8px_rgba(186,230,253,0.6)]"
            style={{ animationDelay: "0.5s", animationDuration: "5s" }}
          />

          {/* Bintang Sedang - Dekat Tengah */}
          <div
            className="absolute top-[30%] left-[45%] w-0.5 h-0.5 bg-white rounded-full animate-sparkle shadow-[0_0_8px_rgba(255,255,255,0.7)]"
            style={{ animationDelay: "2.5s", animationDuration: "3.5s" }}
          />
        </div>
      </div>

      {/* --- SISI UMUM/KOPI (KANAN) --- */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-900/20 via-transparent to-transparent" />

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

      {/* --- PEMBATAS HITAM HALUS (BLACK FADE BLEND) --- */}
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a] via-50% to-transparent opacity-100" />
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-10 w-full max-w-5xl px-10 text-center">
        <div className="inline-block px-4 py-1 mb-8 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          Research Database Access
        </div>

        {/* Tipografi Judul Modern */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-tight drop-shadow-2xl">
          Kuesioner Penelitian <br />
          <span className="relative inline-block pr-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-200 italic">
            Skripsi
          </span>
        </h1>

        <p className="text-base md:text-lg text-white max-w-xl mx-auto mb-16 font-light tracking-wide leading-relaxed drop-shadow-md">
          By: Iqbal Bhayu Wicaksono
          <br />
          F100220218.
        </p>

        {/* Tombol Mulai dengan Animasi Glow Halus (Netral) */}
        <div className="relative inline-block group">
          {/* Efek Glow Aura 3 Warna (Sky, Indigo, Amber) yang makin terang saat di-hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-700 rounded-full blur-xl opacity-30 group-hover:opacity-70 transition-all duration-700 group-hover:duration-300"></div>

          <Link
            href="/step-1"
            className="relative flex items-center justify-center px-10 md:px-12 py-5 bg-[#050505]/80 backdrop-blur-xl rounded-full border border-zinc-800 group-hover:border-zinc-500 transition-all duration-500 overflow-hidden group-hover:scale-[1.05] group-hover:-translate-y-1 active:scale-[0.98] shadow-2xl"
          >
            {/* Efek Cahaya Menyapu (Shimmer) saat di-hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>

            {/* Teks & Ikon */}
            <span className="relative z-10 flex items-center gap-3 font-black text-[11px] md:text-xs text-zinc-300 group-hover:text-white uppercase tracking-[0.3em] transition-colors duration-300">
              Mulai Kuesioner
              {/* Ikon Panah Bergerak */}
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-amber-500 group-hover:text-sky-400 transform group-hover:translate-x-2 transition-all duration-300"
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
            </span>
          </Link>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="absolute bottom-10 w-full text-center z-10">
        <p className="text-zinc-600 text-[10px] tracking-[0.5em] font-bold uppercase drop-shadow-md">
          &copy; ibw
        </p>
      </footer>
    </div>
  );
}
