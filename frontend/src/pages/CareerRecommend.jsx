import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  GraduationCap, Brain, Search, CheckCircle2, 
  ArrowRight, Sparkles, ChevronRight 
} from "lucide-react";

const aiApi = axios.create({
    baseURL: "http://localhost:8001"
});

const INTEREST_GROUPS = [
    { label: "Arts & Creativity", emoji: "🎨", items: ["Drawing", "Cartooning", "Designing", "Crafting", "Makeup", "Knitting"] },
    { label: "Performing Arts", emoji: "🎵", items: ["Dancing", "Singing", "Acting", "Director", "Listening Music"] },
    { label: "Technology", emoji: "💻", items: ["Coding", "Electricity Components", "Mechanic Parts", "Computer Parts", "Engineering", "Architecture"] },
    { label: "Academic & Science", emoji: "📚", items: ["Physics", "Chemistry", "Mathematics", "Biology", "Science", "Botany", "Zoology", "Researching"] },
    { label: "Humanities & Languages", emoji: "📖", items: ["History", "Geography", "Sociology", "Hindi", "French", "English", "Urdu", "Other Language", "Literature", "Reading", "Astrology"] },
    { label: "Business & Finance", emoji: "💼", items: ["Accounting", "Economics", "Business", "Business Education", "Journalism", "Content writing", "Debating"] },
    { label: "Health & Medicine", emoji: "⚕️", items: ["Doctor", "Pharmacist", "Psychology", "Teaching"] },
    { label: "Sports & Lifestyle", emoji: "🏃", items: ["Sports", "Exercise", "Gymnastics", "Yoga", "Cycling", "Travelling", "Gardening", "Animals", "Photography", "Video Game", "Solving Puzzles", "Historic Collection"] },
];

const CoursePredictor = () => {
    const [selected, setSelected] = useState(new Set());
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const toggleInterest = useCallback((name) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
        setResult(null);
    }, []);

    const predict = async () => {
        if (selected.size === 0) return;
        setLoading(true);
        const interestsPayload = {};
        INTEREST_GROUPS.forEach(({ items }) => {
            items.forEach((item) => {
                interestsPayload[item] = selected.has(item) ? 1 : 0;
            });
        });
        try {
            const res = await aiApi.post("/predict_course", { interests: interestsPayload });
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search your hobbies or interests..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-slate-700"
                />
            </div>

            {/* Interests Grid */}
            <div className="space-y-8">
                {INTEREST_GROUPS.map(({ label, emoji, items }) => {
                    const filteredItems = items.filter(i => i.toLowerCase().includes(search.toLowerCase()));
                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={label} className="bg-white/50 p-6 rounded-3xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span>{emoji}</span> {label}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {filteredItems.map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => toggleInterest(name)}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 transform active:scale-95 ${
                                            selected.has(name)
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                                        }`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Predict Button */}
            <div className="sticky bottom-6">
                <button
                    onClick={predict}
                    disabled={selected.size === 0 || loading}
                    className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                        <>
                            <span>Analyze My Future</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>

            {/* Result Modal-style */}
            {result && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-3xl text-white shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Sparkles size={18} />
                        <span className="text-sm font-semibold uppercase tracking-widest">Recommended Path</span>
                    </div>
                    <h2 className="text-3xl font-black">{result.predicted_course}</h2>
                </div>
            )}
        </div>
    );
};

const PersonalityTest = () => {
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        aiApi.get("/personality_questions").then((res) => {
            setQuestions(res.data);
            const initial = {};
            Object.keys(res.data).forEach((type) => {
                initial[type] = res.data[type].map(() => 2);
            });
            setAnswers(initial);
        });
    }, []);

    const submit = async () => {
        const res = await aiApi.post("/personality_test", { answers });
        setResult(res.data);
    };

    if (!questions) return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="animate-bounce mb-4"><Brain size={48} /></div>
            <p>Loading psychological profiles...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {Object.entries(questions).map(([type, qList]) => (
                <div key={type} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-8 w-1 bg-indigo-500 rounded-full" />
                        <h3 className="font-bold text-xl text-slate-800 tracking-tight">{type}</h3>
                    </div>

                    <div className="space-y-8">
                        {qList.map((q, idx) => (
                            <div key={idx} className="group">
                                <p className="text-slate-700 font-medium mb-4 group-hover:text-indigo-600 transition-colors">
                                   {idx + 1}. {q}
                                </p>
                                <div className="grid grid-cols-5 gap-3 max-w-md">
                                    {[0, 1, 2, 3, 4].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => {
                                                setAnswers(prev => ({
                                                    ...prev,
                                                    [type]: prev[type].map((v, i) => i === idx ? val : v)
                                                }));
                                            }}
                                            className={`py-3 rounded-xl border-2 transition-all font-bold ${
                                                answers[type]?.[idx] === val
                                                    ? "bg-indigo-600 border-indigo-600 text-white scale-105 shadow-md"
                                                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-indigo-200"
                                            }`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={submit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all"
            >
                Calculate Results
            </button>

            {result && (
                <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-green-50 animate-bounce-short">
                    <div className="text-center">
                        <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
                        <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">Dominant Personality</p>
                        <h2 className="text-4xl font-black text-slate-900 mt-2">{result.dominant_type}</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

const CareerRecommend = () => {
    const [tab, setTab] = useState("course");

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
            <div className="max-w-3xl mx-auto py-12 px-6">
                
                {/* Simplified Professional Header */}
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl mb-4 shadow-lg shadow-indigo-200">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Career<span className="text-indigo-600">AI</span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Discover your ideal path through machine learning.
                    </p>
                </header>

                {/* Modern Tab Switcher */}
                <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1 mb-10">
                    <button
                        onClick={() => setTab("course")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                            tab === "course" 
                            ? "bg-white text-indigo-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <Search size={18} />
                        Course Predictor
                    </button>

                    <button
                        onClick={() => setTab("personality")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                            tab === "personality" 
                            ? "bg-white text-indigo-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <Brain size={18} />
                        Personality Test
                    </button>
                </div>

                <main>
                    {tab === "course" ? <CoursePredictor /> : <PersonalityTest />}
                </main>
                
                <footer className="mt-20 pb-10 text-center text-slate-400 text-sm font-medium">
                    Powered by Gemini AI • 2026
                </footer>
            </div>
        </div>
    );
};

export default CareerRecommend;