"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const tabs = [
    { name: "Ringkasan", href: "/admin/dashboard", icon: "📊" },
    { name: "Kelola Soal", href: "/admin/manage-questions", icon: "📝" },
    { name: "Hasil Data", href: "/admin/results", icon: "👥" },
  ];

  return (
    <div className="relative min-h-screen bg-[#020514] font-sans selection:bg-blue-500/20">
      {/* BACKGROUND DEEP SPACE */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[75vh] h-[75vh] bg-sky-700 rounded-full blur-[150px] opacity-10 mix-blend-screen"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[80vh] h-[80vh] bg-indigo-900 rounded-full blur-[150px] opacity-15 mix-blend-screen"></div>
      </div>

      {/* HEADER & TAB NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-2xl border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Brand & Logout */}
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30 shrink-0">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-black tracking-widest text-white text-xs md:text-base uppercase flex items-center gap-1.5 md:gap-2">
                  Admin{" "}
                  <span className="text-blue-500 font-serif italic">ibw</span>
                </h1>
                <p className="text-[8px] md:text-[9px] text-blue-300/70 uppercase tracking-[0.3em] font-bold">
                  Control Panel
                </p>
              </div>
            </div>

            <Link
              href="/admin/login"
              className="group flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-red-500/10 border border-red-500/20 rounded-lg md:rounded-xl hover:bg-red-500 transition-all duration-300 active:scale-95 shrink-0"
            >
              <span className="hidden sm:block text-[10px] font-black tracking-widest uppercase text-red-400 group-hover:text-white transition-colors">
                Keluar
              </span>
              <svg
                className="w-4 h-4 md:w-3.5 md:h-3.5 text-red-400 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Link>
          </div>

          {/* Bottom Row: Tab Navigation (DI-TENGAHKAN / CENTERED) */}
          <div className="pb-4 pt-1 flex justify-center w-full">
            <div className="grid grid-cols-3 sm:flex sm:flex-row gap-2 md:gap-4 w-full sm:w-auto">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5 px-2 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 border text-center sm:text-left ${
                      isActive
                        ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                        : "bg-slate-900/40 sm:bg-transparent border-slate-800/80 sm:border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-sm md:text-base">{tab.icon}</span>
                    <span className="text-[8px] sm:text-[10px] md:text-xs font-black tracking-widest uppercase leading-none sm:leading-normal">
                      {tab.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT AREA (Menghapus relative z-10 agar Modal bisa Full Screen) */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-140px)]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
