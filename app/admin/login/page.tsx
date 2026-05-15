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
        setError("Invalid access code.");
      }
    } catch (err) {
      setError("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-[#02040a] font-sans">
      {/* BACKGROUND NEBULA */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 animate-pulse-slow"
        style={{ backgroundImage: `url('/images/nebula-bg.jpg')` }}
      >
        {/* Overlay Gelap agar form tetap pop-out */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 backdrop-blur-[1px]"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-sm px-6">
        <form
          onSubmit={handleLogin}
          className="bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[45px] shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-10"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.4em]">
              System Access
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">
              Admin Login
            </h1>
          </div>

          {/* Input Area */}
          <div className="space-y-6">
            <div className="space-y-2">
              <input
                type="password"
                placeholder="ACCESS CODE"
                className="w-full bg-white/5 border-b-2 border-white/10 p-4 text-white focus:border-blue-500 outline-none transition-all text-center tracking-[1.2em] text-lg font-bold placeholder:text-slate-700 placeholder:tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                {error}
              </p>
            )}
          </div>

          {/* Action Button */}
          <button
            disabled={loading}
            className={`group relative w-full py-5 rounded-[22px] font-black uppercase tracking-[0.4em] text-[10px] overflow-hidden transition-all active:scale-95 ${
              loading
                ? "bg-slate-800 text-slate-500"
                : "bg-white text-black hover:bg-blue-500 hover:text-white shadow-2xl shadow-blue-500/20"
            }`}
          >
            <span className="relative z-10">
              {loading ? "Verifying..." : "Authorize"}
            </span>
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
            )}
          </button>
        </form>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
          animation-iteration-count: 2;
        }
      `}</style>
    </div>
  );
}
