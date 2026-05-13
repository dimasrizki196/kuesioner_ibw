import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] font-sans">
      {/* --- SISI CONSPIRACY (KIRI) --- */}
      <div className="absolute top-0 left-0 w-full md:w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_2px,2px_100%]" />
      </div>

      {/* --- SISI UMUM/KOPI (KANAN) --- */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-900/20 via-transparent to-transparent" />

        {/* Biji Kopi buatan CSS (Bisa kamu ganti <img> nanti kalau sudah ada file-nya) */}
        <div className="absolute top-[25%] right-[15%] w-8 h-10 bg-[#3d251e] rounded-[50%] rotate-45 opacity-40 blur-[1px] shadow-inner">
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
        </div>
        <div className="absolute top-[60%] right-[20%] w-6 h-8 bg-[#4e342e] rounded-[50%] -rotate-12 opacity-30 blur-[1px]">
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
        </div>
        <div className="absolute bottom-[20%] right-[10%] w-10 h-12 bg-[#2b1814] rounded-[50%] rotate-[110deg] opacity-50">
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-10 w-full max-w-5xl px-10 text-center">
        <div className="inline-block px-4 py-1 mb-8 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-bold">
          Research Database Access
        </div>

        {/* Perbaikan Teks Terpotong: Pakai w-full, leading normal, dan padding-right */}
        <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-tight">
          Kuesioner Penelitian <br />
          <span className="relative inline-block pr-6 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-200 italic">
            Skripsi
          </span>
        </h1>

        <p className="text-base md:text-lg text-white max-w-xl mx-auto mb-16 font-light tracking-wide leading-relaxed">
          By: Iqbal Bhayu Wicaksono
          <br />
          F100220218.
        </p>

        <div className="relative inline-block group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-900 to-amber-900 rounded-2xl blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>

          <Link
            href="/step-1"
            className="relative inline-flex items-center justify-center px-12 py-5 font-bold text-zinc-200 bg-black rounded-2xl border border-zinc-800 hover:border-zinc-400 transition-all duration-500 group-hover:text-white"
          >
            Mulai Kuesioner
            <div className="ml-3 w-2 h-2 bg-red-600 rounded-full animate-ping" />
          </Link>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="absolute bottom-10 w-full text-center">
        <p className="text-zinc-700 text-[10px] tracking-[0.5em] font-bold uppercase">
          &copy; ibw
        </p>
      </footer>
    </div>
  );
}
