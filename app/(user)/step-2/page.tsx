"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Step2Identitas() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    domicile: "",
    last_education: "",
    phone: "",
  });

  const [errors, setErrors] = useState<any>({});

  // FITUR BARU: Menarik data dari Session jika sudah pernah diisi
  useEffect(() => {
    const savedDataStr = localStorage.getItem("respondent_data");
    if (savedDataStr) {
      try {
        const savedData = JSON.parse(savedDataStr);
        setFormData({
          name: savedData.name || "",
          age: savedData.age ? savedData.age.toString() : "",
          gender: savedData.gender || "",
          domicile: savedData.domicile || "",
          last_education: savedData.last_education || "",
          phone: savedData.phone === "-" ? "" : savedData.phone || "",
        });
      } catch (err) {
        console.error("Gagal membaca session lama", err);
      }
    }
  }, []);

  const validate = () => {
    let newErrors: any = {};
    if (formData.name.trim().length < 2)
      newErrors.name = "Nama minimal 2 karakter.";

    const ageNum = parseInt(formData.age);
    if (!formData.age || ageNum < 18 || ageNum > 25)
      newErrors.age = "Usia wajib 18-25 tahun.";

    if (!formData.gender) newErrors.gender = "Pilih jenis kelamin.";

    if (formData.domicile.trim().length < 3)
      newErrors.domicile = "Domisili tidak valid.";

    if (formData.last_education.trim().length < 2)
      newErrors.last_education = "Masukkan pendidikan terakhir yang valid.";

    if (formData.phone.trim().length > 0) {
      const phoneRegex = /^[0-9]{10,14}$/;
      if (!phoneRegex.test(formData.phone))
        newErrors.phone = "Format tidak valid (10-14 digit).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // SIMPAN KE LOCALSTORAGE
    localStorage.setItem(
      "respondent_data",
      JSON.stringify({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        domicile: formData.domicile,
        last_education: formData.last_education,
        phone: formData.phone || "-", // Handle opsional
      }),
    );

    // Ciptakan ID sementara jika belum ada
    if (!localStorage.getItem("respondent_id")) {
      const tempId = "temp-" + Date.now().toString();
      localStorage.setItem("respondent_id", tempId);
    }

    // Lanjut ke Narasi (Step 3)
    router.push("/step-3");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-x-hidden selection:bg-blue-500/20 font-serif">
      {/* BACKGROUND DEEP SPACE NAVY X WARM COFFEE GLOW (KONSISTEN STEP 1) */}
      <div className="fixed inset-0 z-0 bg-[#020514] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-20"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[75vh] h-[75vh] bg-sky-600 rounded-full blur-[140px] opacity-20 mix-blend-screen"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[80vh] h-[80vh] bg-gradient-to-tr from-amber-700 via-orange-900 to-transparent rounded-full blur-[130px] opacity-25 mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-yellow-950/20 rounded-full blur-[120px]"></div>

        {/* Biji Kopi CSS */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-amber-950/20 backdrop-blur-[1px]"></div>
      </div>

      {/* CONTAINER UTAMA / MODAL */}
      <div className="relative z-10 w-full max-w-5xl h-full md:h-[85vh] my-auto animate-in fade-in zoom-in-95 duration-700">
        {/* KARTU DARK GLASS */}
        <div className="bg-slate-950/50 backdrop-blur-3xl border border-slate-800/80 rounded-[32px] md:rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full">
          {/* --- SIDEBAR PROGRESS --- */}
          <div className="w-full md:w-[32%] bg-[#080c1d]/90 p-8 md:p-12 text-slate-100 flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80">
            <div className="space-y-4 md:space-y-6">
              <button
                onClick={() => router.back()}
                className="mb-2 flex items-center gap-2 text-[9px] font-sans font-black uppercase text-blue-400/60 tracking-[0.3em] hover:text-white transition-colors w-fit"
              >
                ← Kembali
              </button>

              {/* Indikator Step */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-800/50 shadow-inner w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-blue-300 font-sans text-[10px] font-black uppercase tracking-[0.3em]">
                  Step 02/06
                </span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight mb-3 italic drop-shadow-md text-white">
                  IDENTITAS <br />
                  RESPONDEN
                </h1>
                <p className="text-slate-400 text-xs font-bold tracking-widest leading-relaxed">
                  Data Anda dilindungi kerahasiaannya dan hanya digunakan untuk
                  keperluan penelitian ini.
                </p>
              </div>
            </div>

            <div className="hidden md:block mt-8 pt-8 border-t border-slate-800/60">
              <p className="text-[11px] text-blue-200/50 italic leading-relaxed">
                *Informasi ini diperlukan untuk memastikan kriteria partisipan
                terpenuhi sesuai standar kelayakan etik akademik.
              </p>
            </div>
          </div>

          {/* --- FORM AREA (SCROLLABLE) --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent">
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-between h-full"
            >
              <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 custom-scrollbar scroll-smooth">
                {/* Nama/Inisial */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-sans font-black text-blue-400 uppercase tracking-[0.2em] ml-2">
                    Inisial / Nama Singkat
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 bg-slate-900/40 border rounded-2xl focus:bg-slate-800/80 focus:border-blue-500 outline-none transition-all duration-300 text-white text-sm font-sans font-bold placeholder:text-slate-600 placeholder:font-normal ${errors.name ? "border-red-500/50" : "border-slate-700/80"}`}
                    placeholder="Contoh: Iqbal Bhayu Wicaksono / IBW"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-400 font-sans font-bold ml-2 italic animate-in fade-in slide-in-from-top-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Usia */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-sans font-black text-blue-400 uppercase tracking-[0.2em] ml-2">
                      Usia{" "}
                      <span className="text-slate-500 lowercase">(18-25)</span>
                    </label>
                    <input
                      type="number"
                      className={`w-full p-4 bg-slate-900/40 border rounded-2xl focus:bg-slate-800/80 focus:border-blue-500 outline-none transition-all duration-300 text-white text-sm font-sans font-bold placeholder:text-slate-600 placeholder:font-normal ${errors.age ? "border-red-500/50" : "border-slate-700/80"}`}
                      placeholder="Contoh: 20"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                    {errors.age && (
                      <p className="text-[10px] text-red-400 font-sans font-bold ml-2 italic animate-in fade-in slide-in-from-top-1">
                        {errors.age}
                      </p>
                    )}
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-sans font-black text-blue-400 uppercase tracking-[0.2em] ml-2">
                      Jenis Kelamin
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full p-4 bg-slate-900/40 border rounded-2xl focus:bg-slate-800/80 focus:border-blue-500 outline-none transition-all duration-300 text-white text-sm font-sans font-bold appearance-none cursor-pointer ${errors.gender ? "border-red-500/50" : "border-slate-700/80"}`}
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      >
                        <option
                          value=""
                          disabled
                          className="bg-slate-900 text-slate-500"
                        >
                          Pilih...
                        </option>
                        <option
                          value="Laki-laki"
                          className="bg-slate-900 text-white"
                        >
                          Laki-laki
                        </option>
                        <option
                          value="Perempuan"
                          className="bg-slate-900 text-white"
                        >
                          Perempuan
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.gender && (
                      <p className="text-[10px] text-red-400 font-sans font-bold ml-2 italic animate-in fade-in slide-in-from-top-1">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                {/* Domisili */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-sans font-black text-blue-400 uppercase tracking-[0.2em] ml-2">
                    Domisili{" "}
                    <span className="text-slate-500 lowercase">(Kota/Kab)</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 bg-slate-900/40 border rounded-2xl focus:bg-slate-800/80 focus:border-blue-500 outline-none transition-all duration-300 text-white text-sm font-sans font-bold placeholder:text-slate-600 placeholder:font-normal ${errors.domicile ? "border-red-500/50" : "border-slate-700/80"}`}
                    placeholder="Contoh: Surakarta"
                    value={formData.domicile}
                    onChange={(e) =>
                      setFormData({ ...formData, domicile: e.target.value })
                    }
                  />
                  {errors.domicile && (
                    <p className="text-[10px] text-red-400 font-sans font-bold ml-2 italic animate-in fade-in slide-in-from-top-1">
                      {errors.domicile}
                    </p>
                  )}
                </div>

                {/* Pendidikan Terakhir */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-sans font-black text-blue-400 uppercase tracking-[0.2em] ml-2">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 bg-slate-900/40 border rounded-2xl focus:bg-slate-800/80 focus:border-blue-500 outline-none transition-all duration-300 text-white text-sm font-sans font-bold placeholder:text-slate-600 placeholder:font-normal ${errors.last_education ? "border-red-500/50" : "border-slate-700/80"}`}
                    placeholder="Contoh: S1 Psikologi"
                    value={formData.last_education}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_education: e.target.value,
                      })
                    }
                  />
                  {errors.last_education && (
                    <p className="text-[10px] text-red-400 font-sans font-bold ml-2 italic animate-in fade-in slide-in-from-top-1">
                      {errors.last_education}
                    </p>
                  )}
                </div>

                {/* No WhatsApp (Opsional) */}
                <div className="space-y-2.5 pb-4">
                  <div className="flex justify-between items-end ml-2">
                    <label className="text-[10px] font-sans font-black text-blue-400 uppercase tracking-[0.2em]">
                      Nomor WhatsApp
                    </label>
                    <span className="text-[8px] font-sans font-black text-amber-500/80 bg-amber-500/10 uppercase tracking-widest mr-2 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      Opsional
                    </span>
                  </div>
                  <input
                    type="tel"
                    className={`w-full p-4 bg-slate-900/40 border rounded-2xl focus:bg-slate-800/80 focus:border-blue-500 outline-none transition-all duration-300 text-white text-sm font-sans font-bold placeholder:text-slate-600 placeholder:font-normal ${errors.phone ? "border-red-500/50" : "border-slate-700/80"}`}
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-red-400 font-sans font-bold ml-2 italic animate-in fade-in slide-in-from-top-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-6 md:p-10 bg-black/40 border-t border-slate-800/80 shrink-0 backdrop-blur-md">
                <button
                  type="submit"
                  className="group relative w-full py-5 bg-white text-black rounded-[24px] font-sans font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] shadow-2xl transition-all active:scale-[0.98] overflow-hidden flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 italic">
                    Simpan & Lanjutkan
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
