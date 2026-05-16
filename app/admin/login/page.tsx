"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError("Akses ditolak. Kode tidak valid.");
      }
    } catch (err) {
      setError("Koneksi ke server gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020514] font-sans selection:bg-blue-500/20">
      {/* BACKGROUND DEEP SPACE NAVY X WARM COFFEE GLOW (KONSISTEN) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[75vh] h-[75vh] bg-sky-600 rounded-full blur-[140px] opacity-20 mix-blend-screen"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[80vh] h-[80vh] bg-gradient-to-tr from-amber-700 via-orange-900 to-transparent rounded-full blur-[130px] opacity-25 mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-yellow-950/20 rounded-full blur-[120px]"></div>

        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none">
          <div className="absolute top-[20%] right-[12%] w-16 h-24 bg-[#3d251e] rounded-[50%] rotate-45 opacity-40 blur-[2px] shadow-2xl">
            <div className="absolute top-[5%] left-1/2 w-[2px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>
          <div className="absolute top-[55%] right-[22%] w-12 h-16 bg-[#4e342e] rounded-[50%] -rotate-12 opacity-30 blur-[1px]">
            <div className="absolute top-[5%] left-1/2 w-[2px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>
          <div className="absolute bottom-[15%] right-[8%] w-24 h-32 bg-[#2b1814] rounded-[50%] rotate-[110deg] opacity-50 drop-shadow-2xl">
            <div className="absolute top-[5%] left-1/2 w-[3px] h-[90%] bg-[#1a0f0c] -translate-x-1/2 rounded-full" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-amber-950/20 backdrop-blur-[2px]"></div>
      </div>

      {/* KARTU LOGIN */}
      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-700">
        <form
          onSubmit={handleLogin}
          className="bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 p-10 md:p-12 rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.8)] space-y-10"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-800/50 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-blue-400 text-[9px] font-black uppercase tracking-[0.4em]">
                Restricted Area
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic drop-shadow-md font-serif">
              Admin Login
            </h1>
          </div>

          {/* Input Area */}
          <div className="space-y-8 pt-4">
            <div className="relative group">
              <input
                type="password"
                placeholder="CODE"
                className="w-full bg-transparent border-b-2 border-slate-700 pb-4 text-white focus:border-blue-500 outline-none transition-all duration-300 text-center tracking-[1em] text-xl font-bold placeholder:text-slate-700 placeholder:tracking-[1em]"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoComplete="off"
              />
              {/* Garis glowing halus saat input aktif */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-500 transition-all duration-500 group-focus-within:w-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            </div>

            {/* Pesan Error */}
            <div className="h-4">
              {error && (
                <p className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em] text-center animate-in slide-in-from-top-2 fade-in">
                  ⚠️ {error}
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            disabled={loading || !code}
            className={`group relative w-full py-5 rounded-[24px] font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] overflow-hidden transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 ${
              loading || !code
                ? "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-white text-black hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            }`}
          >
            <span className="relative z-10 italic">
              {loading ? "Verifying..." : "Authorize"}
            </span>

            {/* Ikon Panah/Loading */}
            {!loading && code && (
              <svg
                className="w-4 h-4 relative z-10 text-amber-500 group-hover:text-blue-600 transform group-hover:translate-x-2 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            )}

            {/* Shimmer Effect */}
            {!loading && code && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
