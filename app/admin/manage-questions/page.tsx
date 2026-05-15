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
      .order("created_at", { ascending: false });
    if (data) setQuestions(data);
    setLoading(false);
  }

  // FILTER: Sekarang filter berdasarkan string "suspicion", bukan null
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

  const toggleCorrectAnswer = (index: number) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index].is_correct = !updatedOptions[index].is_correct;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      question_text: newQuestion.question_text,
      type: newQuestion.type, // Langsung kirim string (politik/industri/skala/suspicion)
      answer_type: newQuestion.answer_type,
      options:
        newQuestion.answer_type === "scale"
          ? {
              "1": "Pasti tidak benar",
              "2": "Mungkin tidak benar",
              "3": "Ragu-ragu / tidak bisa memastikan",
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

  const openEditModal = (q: any) => {
    setIsEditing(true);
    setCurrentId(q.id);
    setNewQuestion({
      question_text: q.question_text,
      type: q.type, // Tidak perlu pengecekan null lagi
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
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-[#fafafa]">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-xl font-black uppercase tracking-widest text-[#0f172a]">
          Instrument Bank
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0f172a] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          + Add Question
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-[#0f172a] text-white shadow-lg scale-105"
                : "bg-white text-slate-400 border border-slate-200 hover:border-blue-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-20 text-[10px] font-bold text-slate-400 tracking-[0.3em]">
            SYNCHRONIZING...
          </p>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
              Belum ada data di kategori ini.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className={`p-7 rounded-[35px] border flex justify-between items-center transition-all ${
                q.type === "politik"
                  ? "bg-[#121212] border-slate-800 text-white shadow-2xl"
                  : q.type === "industri"
                    ? "bg-[#fdf8f4] border-[#ebdccb] text-[#5d4037]"
                    : "bg-white border-slate-200 text-slate-600 shadow-sm"
              }`}
            >
              <div className="flex-1 pr-10">
                <div className="flex gap-3 mb-3 text-[8px] font-black uppercase tracking-widest opacity-60">
                  <span>{tabs.find((t) => t.id === q.type)?.label}</span>
                  <span className="text-blue-400">
                    / {q.answer_type.replace("_", " ")}
                  </span>
                </div>
                <p className="font-bold text-sm md:text-base leading-relaxed">
                  {q.question_text}
                </p>
                {q.answer_type === "multiple_choice" &&
                  Array.isArray(q.options) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.options
                        .filter((o: any) => o.is_correct)
                        .map((o: any, i: number) => (
                          <span
                            key={i}
                            className="text-[7px] font-black bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase"
                          >
                            ✓ {o.text}
                          </span>
                        ))}
                    </div>
                  )}
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
                  className="w-10 h-10 flex items-center justify-center bg-red-500/5 text-red-500 rounded-xl border border-red-500/10 hover:bg-red-500 transition-all text-xs"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/30 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl space-y-6 animate-in zoom-in-95 overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <h2 className="text-xl font-black text-[#0f172a] uppercase text-center">
              {isEditing ? "Update" : "Create"} Instrument
            </h2>

            <textarea
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-[30px] p-7 focus:bg-white focus:border-blue-500 outline-none text-sm font-bold min-h-[140px]"
              placeholder="Butir pertanyaan..."
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
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Kategori
                </label>
                <select
                  className="w-full bg-slate-50 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-1 ring-blue-500"
                  value={newQuestion.type}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, type: e.target.value })
                  }
                >
                  {tabs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Format Jawaban
                </label>
                <select
                  className="w-full bg-slate-50 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-1 ring-blue-500"
                  value={newQuestion.answer_type}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewQuestion({
                      ...newQuestion,
                      answer_type: val,
                      options: [],
                    });
                  }}
                >
                  <option value="scale">Skala 1-5</option>
                  <option value="multiple_choice">Pilihan Ganda (Multi)</option>
                  <option value="text">Teks Bebas</option>
                </select>
              </div>
            </div>

            {newQuestion.answer_type === "multiple_choice" && (
              <div className="space-y-3 bg-slate-50 p-6 rounded-[30px] border border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempOption}
                    onChange={(e) => setTempOption(e.target.value)}
                    className="flex-1 p-3 bg-white rounded-xl text-[10px] font-bold border border-slate-200 outline-none focus:border-blue-500"
                    placeholder="Tambah opsi jawaban..."
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="bg-slate-900 text-white w-12 rounded-xl font-bold hover:bg-black transition-all"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-2 mt-4 max-h-40 overflow-y-auto pr-1">
                  {newQuestion.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${opt.is_correct ? "bg-green-50 border-green-200" : "bg-white border-slate-100"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={opt.is_correct}
                          onChange={() => toggleCorrectAnswer(i)}
                          className="w-4 h-4 accent-green-600 cursor-pointer"
                        />
                        <span
                          className={`text-[10px] font-bold ${opt.is_correct ? "text-green-700" : "text-slate-600"}`}
                        >
                          {opt.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setNewQuestion({
                            ...newQuestion,
                            options: newQuestion.options.filter(
                              (_, idx) => idx !== i,
                            ),
                          })
                        }
                        className="text-red-400 text-xs hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] hover:text-slate-600"
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
