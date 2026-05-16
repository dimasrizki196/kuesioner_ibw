"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ManageQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("politik");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // STATE BARU: Untuk Modal Konfirmasi Hapus Soal
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    type: "politik",
    answer_type: "scale",
    options: [] as any[],
  });

  const [tempOption, setTempOption] = useState("");

  const tabs = [
    { id: "politik", label: "MC KE (Politik)" },
    { id: "industri", label: "MC KK (Industri)" },
    { id: "skala", label: "Kuesioner Skala" },
    { id: "suspicion", label: "Suspicion Check" },
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    setLoading(true);
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setQuestions(data);
    setLoading(false);
  }

  const filteredQuestions = questions.filter((q) => q.type === activeTab);

  const handleAddOption = () => {
    if (!tempOption.trim()) return;
    const currentOptions = Array.isArray(newQuestion.options)
      ? newQuestion.options
      : [];
    setNewQuestion({
      ...newQuestion,
      options: [
        ...currentOptions,
        { text: tempOption.trim(), is_correct: false },
      ],
    });
    setTempOption("");
  };

  // LOGIKA DIPERBAIKI: Memastikan hanya 1 jawaban yang bisa "Benar" (Single Choice)
  const setCorrectAnswer = (index: number) => {
    const updatedOptions = newQuestion.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index, // Hanya opsi yang di-klik yang menjadi true
    }));
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      question_text: newQuestion.question_text,
      type: newQuestion.type,
      answer_type: newQuestion.answer_type,
      options:
        newQuestion.answer_type === "scale"
          ? {
              "1": "Pasti tidak benar",
              "2": "Mungkin tidak benar",
              "3": "Ragu-ragu / tidak pasti",
              "4": "Mungkin benar",
              "5": "Pasti benar",
            }
          : newQuestion.options,
    };

    try {
      if (isEditing && currentId) {
        const { error } = await supabase
          .from("questions")
          .update(payload)
          .eq("id", currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("questions").insert([payload]);
        if (error) throw error;
      }
      closeModal();
      fetchQuestions();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", deleteTarget.id);
      if (error) throw error;

      setDeleteTarget(null);
      fetchQuestions();
    } catch (err: any) {
      alert("Gagal menghapus soal: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (q: any) => {
    setIsEditing(true);
    setCurrentId(q.id);
    setNewQuestion({
      question_text: q.question_text,
      type: q.type,
      answer_type: q.answer_type,
      options: Array.isArray(q.options) ? q.options : [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewQuestion({
      question_text: "",
      type: activeTab,
      answer_type: "scale",
      options: [],
    });
  };

  return (
    <div className="w-full">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 pb-4 md:pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-lg md:text-2xl font-black uppercase tracking-widest text-white flex items-center gap-2 md:gap-3">
            <span className="text-blue-500 text-xl md:text-2xl">❖</span>{" "}
            Instrument Bank
          </h1>
          <p className="text-[10px] md:text-xs text-slate-400 font-sans tracking-widest uppercase mt-0.5 md:mt-1">
            Kelola Database Pertanyaan
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none mt-[-2px]">+</span> Tambah Soal
        </button>
      </div>

      {/* Tabs / Kategori */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-3 mb-4 md:mb-6">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500 shadow-inner"
                  : "bg-slate-900/50 text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area Daftar Soal */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-slate-500 animate-pulse gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase">
              Memuat Data...
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-16 md:py-20 bg-slate-900/30 rounded-2xl md:rounded-3xl border border-dashed border-slate-800">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
              Belum ada butir soal di kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 md:p-6 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-slate-600 transition-colors flex flex-col justify-between"
              >
                <div className="mb-3 md:mb-4">
                  <div className="flex justify-between items-start gap-3 mb-2 md:mb-3">
                    <span className="text-[10px] md:text-xs font-black text-slate-600 bg-slate-950 px-2 py-1 rounded">
                      #{idx + 1}
                    </span>
                    <span className="text-[7px] md:text-[8px] font-bold text-blue-400/80 uppercase tracking-widest px-2 py-1 bg-blue-950/30 rounded-md border border-blue-900/50">
                      {q.answer_type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-bold text-xs md:text-sm text-slate-200 leading-relaxed line-clamp-4">
                    {q.question_text}
                  </p>

                  {q.answer_type === "multiple_choice" &&
                    Array.isArray(q.options) && (
                      <div className="mt-3 md:mt-4 flex flex-wrap gap-1 md:gap-1.5">
                        {q.options.map((o: any, i: number) => (
                          <span
                            key={i}
                            className={`text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded border ${o.is_correct ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-slate-800 border-slate-700 text-slate-400"}`}
                          >
                            {o.is_correct && "✓ "} {o.text}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-800/60 pt-2.5 md:pt-3">
                  <button
                    onClick={() => openEditModal(q)}
                    className="flex items-center justify-center px-3 py-1.5 md:px-4 md:py-1.5 bg-slate-800 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 rounded-lg text-[9px] md:text-[10px] font-bold transition-colors uppercase tracking-widest"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteTarget({ id: q.id, text: q.question_text })
                    }
                    className="flex items-center justify-center px-3 py-1.5 md:px-4 md:py-1.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg text-[9px] md:text-[10px] font-bold transition-colors uppercase tracking-widest"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL FORM COMPACT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-4 z-[100] animate-in fade-in zoom-in-95 duration-200">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-[24px] md:rounded-[32px] p-5 md:p-8 w-full max-w-lg shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col max-h-[95vh] md:max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 md:pb-4 shrink-0">
              <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></span>
                {isEditing ? "Edit Soal" : "Tambah Soal"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-500 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 py-4 md:py-5 pr-1">
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Pertanyaan
                </label>
                <textarea
                  className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl p-3 md:p-4 focus:bg-black focus:border-blue-500 outline-none text-xs md:text-sm font-bold text-white min-h-[80px] md:min-h-[100px] custom-scrollbar transition-colors"
                  placeholder="Ketik butir pertanyaan di sini..."
                  value={newQuestion.question_text}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question_text: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Grup
                  </label>
                  <select
                    className="w-full bg-slate-950/50 border border-slate-700/80 p-2.5 md:p-3 rounded-lg text-[10px] md:text-xs font-bold text-slate-300 outline-none focus:border-blue-500"
                    value={newQuestion.type}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, type: e.target.value })
                    }
                  >
                    {tabs.map((t) => (
                      <option key={t.id} value={t.id} className="bg-slate-900">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Format
                  </label>
                  <select
                    className="w-full bg-slate-950/50 border border-slate-700/80 p-2.5 md:p-3 rounded-lg text-[10px] md:text-xs font-bold text-slate-300 outline-none focus:border-blue-500"
                    value={newQuestion.answer_type}
                    onChange={(e) => {
                      setNewQuestion({
                        ...newQuestion,
                        answer_type: e.target.value,
                        options: [],
                      });
                    }}
                  >
                    <option value="scale" className="bg-slate-900">
                      Skala 1-5
                    </option>
                    <option value="multiple_choice" className="bg-slate-900">
                      Pilihan Ganda
                    </option>
                    <option value="text" className="bg-slate-900">
                      Teks Bebas
                    </option>
                  </select>
                </div>
              </div>

              {newQuestion.answer_type === "multiple_choice" && (
                <div className="space-y-3 bg-slate-950/30 p-3 md:p-4 rounded-xl border border-slate-800/80">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Opsi Jawaban
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempOption}
                      onChange={(e) => setTempOption(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddOption())
                      }
                      className="flex-1 p-2 bg-slate-900 rounded-lg text-[10px] md:text-xs text-white font-bold border border-slate-700 outline-none focus:border-blue-500 placeholder:text-slate-600"
                      placeholder="Ketik opsi..."
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="bg-slate-800 text-blue-400 border border-slate-700 px-3 md:px-4 rounded-lg font-black hover:bg-blue-600 hover:text-white transition-all text-[10px] md:text-xs"
                    >
                      + ADD
                    </button>
                  </div>

                  {/* UI OPSI JAWABAN DIPERBAIKI UNTUK MOBILE */}
                  <div className="space-y-2 md:space-y-2.5 mt-3 max-h-36 md:max-h-40 overflow-y-auto custom-scrollbar pr-1">
                    {newQuestion.options.map((opt, i) => (
                      <div
                        key={i}
                        onClick={() => setCorrectAnswer(i)}
                        className={`flex items-center justify-between p-3 md:p-3.5 rounded-xl border cursor-pointer transition-all ${
                          opt.is_correct
                            ? "bg-blue-600/10 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                            : "bg-slate-900 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Custom Radio Button */}
                          <div
                            className={`w-4 h-4 md:w-4 md:h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              opt.is_correct
                                ? "border-blue-500 bg-slate-900"
                                : "border-slate-600 bg-slate-800"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full transition-all ${
                                opt.is_correct
                                  ? "bg-blue-500 scale-100"
                                  : "bg-transparent scale-0"
                              }`}
                            />
                          </div>

                          <span
                            className={`text-xs md:text-sm font-bold ${
                              opt.is_correct
                                ? "text-blue-400"
                                : "text-slate-300"
                            }`}
                          >
                            {opt.text}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah setCorrectAnswer terpanggil saat menghapus opsi
                            setNewQuestion({
                              ...newQuestion,
                              options: newQuestion.options.filter(
                                (_, idx) => idx !== i,
                              ),
                            });
                          }}
                          className="text-slate-500 hover:text-red-400 text-sm px-2 py-1 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 md:gap-3 pt-3 md:pt-4 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-3 md:py-3.5 text-[9px] md:text-[10px] font-black uppercase text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-[2] bg-blue-600 text-white py-3 md:py-3.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 active:scale-95 transition-all"
              >
                Simpan Ke DB
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL KONFIRMASI HAPUS SOAL (DANGER ZONE) --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          ></div>

          <div className="relative bg-slate-900 border border-red-500/30 w-full max-w-md rounded-[32px] shadow-[0_0_80px_rgba(220,38,38,0.4)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-500/30 shadow-inner">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest">
              Hapus Permanen?
            </h2>

            <p className="text-slate-400 text-xs md:text-sm mb-8 leading-relaxed">
              Tindakan ini akan menghapus soal{" "}
              <span className="text-slate-300 font-bold italic">
                "
                {deleteTarget.text.length > 50
                  ? deleteTarget.text.substring(0, 50) + "..."
                  : deleteTarget.text}
                "
              </span>{" "}
              secara permanen dari database. Lanjutkan?
            </p>

            <div className="flex gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                disabled={isDeleting}
                onClick={executeDelete}
                className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                {isDeleting ? "Menghapus..." : "Ya, Musnahkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
