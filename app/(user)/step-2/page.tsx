"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Step2Identitas() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    domicile: "",
    last_education: "",
    phone: "",
  });

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let newErrors: any = {};
    if (formData.name.trim().length < 2)
      newErrors.name = "Nama/Inisial minimal 2 karakter.";

    const ageNum = parseInt(formData.age);
    if (!formData.age || ageNum < 18 || ageNum > 25)
      newErrors.age = "Usia wajib antara 18-25 tahun.";

    if (!formData.gender) newErrors.gender = "Silakan pilih jenis kelamin.";
    if (formData.domicile.trim().length < 3)
      newErrors.domicile = "Masukan domisili yang valid.";
    if (!formData.last_education)
      newErrors.last_education = "Pilih pendidikan terakhir.";

    const phoneRegex = /^[0-9]{10,14}$/;
    if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Nomor WhatsApp tidak valid (10-14 digit).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("respondents")
        .insert([
          {
            name: formData.name,
            age: parseInt(formData.age),
            gender: formData.gender,
            domicile: formData.domicile,
            last_education: formData.last_education,
            phone: formData.phone,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Simpan ID untuk relasi tabel 'answers' nanti
      localStorage.setItem("respondent_id", data.id);
      router.push("/step-3");
    } catch (error: any) {
      console.error(error);
      alert(`Gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-lg md:max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[94vh] md:max-h-[700px]">
        {/* --- SIDEBAR --- */}
        <div className="w-full md:w-[32%] bg-[#0f172a] p-6 md:p-10 text-white flex flex-col justify-between shrink-0">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-widest hover:text-white transition-colors"
            >
              ← Kembali
            </button>
            <div className="inline-block w-fit px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">
              Step 02/05
            </div>
            <h1 className="text-2xl md:text-4xl font-black leading-tight mb-2">
              Identitas Responden
            </h1>
          </div>
          <p className="hidden md:block text-[10px] text-slate-500 italic leading-relaxed">
            *Data Anda aman dan terenkripsi sesuai protokol penelitian psikologi
            UMS.
          </p>
        </div>

        {/* --- FORM AREA --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white p-5 md:p-10">
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
              {/* Nama */}
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Inisial
                </label>
                <input
                  type="text"
                  className={`w-full mt-1 p-3.5 bg-slate-50 border-2 rounded-2xl focus:bg-white text-gray-700 focus:border-blue-500 outline-none transition-all text-sm font-bold ${errors.name ? "border-red-200" : "border-slate-50"}`}
                  placeholder="Contoh: IBW"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 tracking-tight">
                    *{errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Usia */}
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Usia (18-25)
                  </label>
                  <input
                    type="number"
                    className={`w-full mt-1 p-3.5 bg-slate-50 border-2 rounded-2xl focus:bg-white text-gray-700 focus:border-blue-500 outline-none transition-all text-sm font-bold ${errors.age ? "border-red-200" : "border-slate-50"}`}
                    placeholder="20"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                  {errors.age && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 italic">
                      *{errors.age}
                    </p>
                  )}
                </div>
                {/* Jenis Kelamin */}
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Jenis Kelamin
                  </label>
                  <select
                    className={`w-full mt-1 p-3.5 bg-slate-50 border-2 rounded-2xl focus:bg-white text-gray-700 focus:border-blue-500 outline-none transition-all text-sm font-bold appearance-none cursor-pointer ${errors.gender ? "border-red-200" : "border-slate-50"}`}
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                  >
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {errors.gender && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 italic">
                      *{errors.gender}
                    </p>
                  )}
                </div>
              </div>

              {/* Domisili */}
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Domisili (Kota/Kabupaten)
                </label>
                <input
                  type="text"
                  className={`w-full mt-1 p-3.5 bg-slate-50 border-2 rounded-2xl focus:bg-white text-gray-700 focus:border-blue-500 outline-none transition-all text-sm font-bold ${errors.domicile ? "border-red-200" : "border-slate-50"}`}
                  placeholder="Contoh: Surakarta"
                  value={formData.domicile}
                  onChange={(e) =>
                    setFormData({ ...formData, domicile: e.target.value })
                  }
                />
                {errors.domicile && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 italic">
                    *{errors.domicile}
                  </p>
                )}
              </div>

              {/* Pendidikan Terakhir */}
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Pendidikan Terakhir
                </label>
                <select
                  className={`w-full mt-1 p-3.5 bg-slate-50 border-2 rounded-2xl focus:bg-white text-gray-700 focus:border-blue-500 outline-none transition-all text-sm font-bold appearance-none cursor-pointer ${errors.last_education ? "border-red-200" : "border-slate-50"}`}
                  value={formData.last_education}
                  onChange={(e) =>
                    setFormData({ ...formData, last_education: e.target.value })
                  }
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value="SMA/SMK">SMA / SMK / Sederajat</option>
                  <option value="D3/D4">Diploma (D3/D4)</option>
                  <option value="S1">Sarjana (S1)</option>
                </select>
                {errors.last_education && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 italic">
                    *{errors.last_education}
                  </p>
                )}
              </div>

              {/* No WhatsApp */}
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  className={`w-full mt-1 p-3.5 bg-slate-50 border-2 rounded-2xl focus:bg-white text-gray-700 focus:border-blue-500 outline-none transition-all text-sm font-bold ${errors.phone ? "border-red-200" : "border-slate-50"}`}
                  placeholder="0812XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 italic">
                    *{errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-5 shrink-0">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-5 bg-[#0f172a] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Menyimpan Data..." : "Simpan & Lanjutkan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
