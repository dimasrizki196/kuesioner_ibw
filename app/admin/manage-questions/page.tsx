"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ManageQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    type: "umum" as string | null,
    answer_type: "scale",
    options: {} as any,
  });

  const [tempOption, setTempOption] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    setLoading(true);
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setQuestions(data);
    setLoading(false);
  }

  const handleAddOption = () => {
    if (!tempOption.trim()) return;
    const currentOptions = Array.isArray(newQuestion.options)
      ? newQuestion.options
      : [];
    setNewQuestion({
      ...newQuestion,
      options: [...currentOptions, tempOption.trim()],
    });
    setTempOption("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Logic Backend: Menyesuaikan payload sebelum dikirim
    const payload = {
      question_text: newQuestion.question_text,
      type: newQuestion.type === "evaluasi" ? null : newQuestion.type,
      answer_type: newQuestion.answer_type,
      // Jika skala, kita set default labels agar tidak kosong di DB
      options:
        newQuestion.answer_type === "scale"
          ? { "1": "Sangat Tidak Setuju", "5": "Sangat Setuju" }
          : newQuestion.options || {},
    };

    try {
      if (isEditing && currentId) {
        await supabase.from("questions").update(payload).eq("id", currentId);
      } else {
        await supabase.from("questions").insert([payload]);
      }
      closeModal();
      fetchQuestions();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  const openEditModal = (q: any) => {
    setIsEditing(true);
    setCurrentId(q.id);
    setNewQuestion({
      question_text: q.question_text,
      type: q.type === null ? "evaluasi" : q.type,
      answer_type: q.answer_type,
      options: q.options || {},
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewQuestion({
      question_text: "",
      type: "umum",
      answer_type: "scale",
      options: {},
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto font-sans text-slate-900 bg-[#fafafa] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200">
        <h1 className="text-xl font-black uppercase tracking-widest text-[#0f172a]">
          Instrument Bank
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0f172a] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          + Add New
        </button>
      </div>

      {/* LIST SOAL */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-20 text-[10px] font-bold text-slate-400 tracking-[0.3em]">
            SYNCHRONIZING...
          </p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className={`p-7 rounded-[35px] border flex justify-between items-center transition-all ${
                q.type === "conspiracy"
                  ? "bg-[#121212] border-slate-800 text-white shadow-2xl"
                  : q.type === "umum"
                    ? "bg-[#fdf8f4] border-[#ebdccb] text-[#5d4037]"
                    : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex-1 pr-10">
                <div className="flex gap-3 mb-3 text-[8px] font-black uppercase tracking-widest opacity-60">
                  <span>{q.type || "Evaluasi"}</span>
                  <span className="text-blue-400">
                    / {q.answer_type.replace("_", " ")}
                  </span>
                </div>
                <p className="font-bold text-sm md:text-base leading-relaxed">
                  {q.question_text}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(q)}
                  className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-black/5 hover:bg-white/10 transition-all text-xs"
                >
                  ✏️
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Hapus soal ini?")) {
                      await supabase.from("questions").delete().eq("id", q.id);
                      fetchQuestions();
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-red-500/5 text-red-500 rounded-xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all text-xs"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/30 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl space-y-8 animate-in zoom-in-95"
          >
            <div className="space-y-1 text-center">
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em]">
                Survey Manager
              </p>
              <h2 className="text-xl font-black text-[#0f172a] uppercase">
                {isEditing ? "Update Soal" : "Tambah Soal"}
              </h2>
            </div>

            <textarea
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[30px] p-7 focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all min-h-[140px]"
              placeholder="Tulis butir pertanyaan kuesioner..."
              value={newQuestion.question_text}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  question_text: e.target.value,
                })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full bg-slate-50 p-4 rounded-2xl text-[10px] font-black uppercase outline-none"
                value={newQuestion.type || "evaluasi"}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, type: e.target.value })
                }
              >
                <option value="umum">Umum</option>
                <option value="conspiracy">Conspiracy</option>
                <option value="evaluasi">Evaluasi</option>
              </select>

              <select
                className="w-full bg-slate-50 p-4 rounded-2xl text-[10px] font-black uppercase outline-none"
                value={newQuestion.answer_type}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewQuestion({
                    ...newQuestion,
                    answer_type: val,
                    options: val === "multiple_choice" ? [] : {},
                  });
                }}
              >
                <option value="scale">Skala 1-5</option>
                <option value="multiple_choice">Pilihan Ganda</option>
                <option value="text">Teks Bebas</option>
              </select>
            </div>

            {/* OPSI PILIHAN GANDA (Hanya muncul jika multiple_choice) */}
            {newQuestion.answer_type === "multiple_choice" && (
              <div className="space-y-3 bg-purple-50 p-4 rounded-[24px]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempOption}
                    onChange={(e) => setTempOption(e.target.value)}
                    className="flex-1 p-3 bg-white rounded-xl text-[10px] font-bold outline-none"
                    placeholder="Tambah opsi..."
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="bg-purple-600 text-white w-12 rounded-xl font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {(newQuestion.options as string[])?.map((opt, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold bg-white px-3 py-1.5 rounded-lg border border-purple-100 flex items-center gap-2"
                    >
                      {opt}
                      <button
                        type="button"
                        onClick={() =>
                          setNewQuestion({
                            ...newQuestion,
                            options: (newQuestion.options as string[]).filter(
                              (_, idx) => idx !== i,
                            ),
                          })
                        }
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 text-[10px] font-black uppercase text-slate-400 tracking-widest"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#0f172a] text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
