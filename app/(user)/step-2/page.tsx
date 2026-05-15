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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-x-hidden font-serif selection:bg-blue-500/20">
      {/* BACKGROUND DEEP SPACE PURE CODING */}
      <div className="fixed inset-0 z-0 bg-[#000105]">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[60vh] h-[60vh] bg-sky-950 rounded-full blur-[120px] opacity-25"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[60vh] h-[60vh] bg-indigo-950 rounded-full blur-[120px] opacity-25"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg md:max-w-5xl my-auto animate-in fade-in zoom-in-95 duration-700">
        {/* KARTU DARK GLASS */}
        <div className="bg-slate-950/40 backdrop-blur-3xl border border-slate-800 rounded-[40px] shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row h-full md:max-h-[750px]">
          {/* --- SIDEBAR --- */}
          <div className="w-full md:w-[35%] bg-[#080c1d]/80 p-8 md:p-12 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-700">
            <div>
              <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-[9px] font-black uppercase text-blue-400/60 tracking-[0.3em] hover:text-white transition-colors font-serif"
              >
                ← Kembali
              </button>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-950/30 border border-blue-800 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6 font-serif">
                Step 02/05
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-none italic mb-4 font-serif drop-shadow-lg text-white">
                IDENTITAS
                <br />
                RESPONDEN
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed font-serif">
                Data Anda dilindungi enkripsi
              </p>
            </div>

            <p className="hidden md:block text-[11px] text-blue-200/50 italic leading-relaxed pt-8 border-t border-slate-700 font-serif">
              *Informasi ini diperlukan untuk memastikan kriteria partisipan
              terpenuhi sesuai kelayakan etik.
            </p>
          </div>

          {/* --- FORM AREA --- */}
          <div className="flex-1 flex flex-col min-h-0 bg-transparent font-serif">
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-between h-full"
            >
              <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-6 custom-scrollbar">
                {/* Nama/Inisial */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] ml-2 font-serif">
                    Inisial / Nama Singkat
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 bg-slate-900/50 border border-slate-700 rounded-[20px] focus:bg-slate-800 focus:border-blue-500 outline-none transition-all text-white text-sm font-bold placeholder:text-slate-600 font-serif ${errors.name ? "border-red-500/50" : ""}`}
                    placeholder="Contoh: IBW"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-400 font-bold ml-2 italic font-serif">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Usia */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] ml-2 font-serif">
                      Usia (18-25)
                    </label>
                    <input
                      type="number"
                      className={`w-full p-4 bg-slate-900/50 border border-slate-700 rounded-[20px] focus:bg-slate-800 focus:border-blue-500 outline-none transition-all text-white text-sm font-bold placeholder:text-slate-600 font-serif ${errors.age ? "border-red-500/50" : ""}`}
                      placeholder="20"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    />
                    {errors.age && (
                      <p className="text-[10px] text-red-400 font-bold ml-2 italic font-serif">
                        {errors.age}
                      </p>
                    )}
                  </div>

                  {/* Jenis Kelamin */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] ml-2 font-serif">
                      Jenis Kelamin
                    </label>
                    <select
                      className={`w-full p-4 bg-slate-900/50 border border-slate-700 rounded-[20px] focus:bg-slate-800 focus:border-blue-500 outline-none transition-all text-white text-sm font-bold appearance-none cursor-pointer font-serif ${errors.gender ? "border-red-500/50" : ""}`}
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="" className="text-slate-500 font-serif">
                        Pilih
                      </option>
                      <option
                        value="Laki-laki"
                        className="text-black font-serif"
                      >
                        Laki-laki
                      </option>
                      <option
                        value="Perempuan"
                        className="text-black font-serif"
                      >
                        Perempuan
                      </option>
                    </select>
                    {errors.gender && (
                      <p className="text-[10px] text-red-400 font-bold ml-2 italic font-serif">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                {/* Domisili */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] ml-2 font-serif">
                    Domisili (Kota/Kab)
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 bg-slate-900/50 border border-slate-700 rounded-[20px] focus:bg-slate-800 focus:border-blue-500 outline-none transition-all text-white text-sm font-bold placeholder:text-slate-600 font-serif ${errors.domicile ? "border-red-500/50" : ""}`}
                    placeholder="Contoh: Surakarta"
                    value={formData.domicile}
                    onChange={(e) =>
                      setFormData({ ...formData, domicile: e.target.value })
                    }
                  />
                  {errors.domicile && (
                    <p className="text-[10px] text-red-400 font-bold ml-2 italic font-serif">
                      {errors.domicile}
                    </p>
                  )}
                </div>

                {/* Pendidikan Terakhir */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] ml-2 font-serif">
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    className={`w-full p-4 bg-slate-900/50 border border-slate-700 rounded-[20px] focus:bg-slate-800 focus:border-blue-500 outline-none transition-all text-white text-sm font-bold placeholder:text-slate-600 font-serif ${errors.last_education ? "border-red-500/50" : ""}`}
                    placeholder="Contoh: SMA, S1 Psikologi, dll."
                    value={formData.last_education}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_education: e.target.value,
                      })
                    }
                  />
                  {errors.last_education && (
                    <p className="text-[10px] text-red-400 font-bold ml-2 italic font-serif">
                      {errors.last_education}
                    </p>
                  )}
                </div>

                {/* No WhatsApp (Opsional) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end ml-2">
                    <label className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] font-serif">
                      Nomor WhatsApp
                    </label>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mr-2 border border-slate-700 px-2 py-0.5 rounded-full font-serif">
                      Opsional
                    </span>
                  </div>
                  <input
                    type="tel"
                    className={`w-full p-4 bg-slate-900/50 border border-slate-700 rounded-[20px] focus:bg-slate-800 focus:border-blue-500 outline-none transition-all text-white text-sm font-bold placeholder:text-slate-600 font-serif ${errors.phone ? "border-red-500/50" : ""}`}
                    placeholder="0812XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-red-400 font-bold ml-2 italic font-serif">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-8 md:p-12 bg-black/60 border-t border-slate-800 shrink-0">
                <button
                  type="submit"
                  className="group relative w-full py-6 bg-white text-black rounded-[28px] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl transition-all active:scale-95 overflow-hidden font-serif"
                >
                  <span className="relative z-10 italic font-serif">
                    Simpan & Lanjutkan
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
