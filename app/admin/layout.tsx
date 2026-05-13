"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Jangan tampilkan navigasi jika sedang di halaman login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const tabs = [
    { name: "Ringkasan", href: "/admin/dashboard", icon: "📊" },
    { name: "Kelola Soal", href: "/admin/manage-questions", icon: "📝" },
    { name: "Hasil", href: "/admin/results", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header & Tab Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tighter text-gray-900">
                ADMIN PANEL
              </span>
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">
                PRO
              </span>
            </div>
            <Link
              href="/"
              className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition"
            >
              Keluar
            </Link>
          </div>

          {/* Scrollable Tabs for Mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-px">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
