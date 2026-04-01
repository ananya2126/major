import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { 
  Upload, CheckCircle, Target, BookOpen, 
  Lightbulb, FileText, XCircle, Search, Layers, ChevronRight 
} from "lucide-react";
const xgApi = axios.create({
    baseURL: "http://localhost:8002"
});
const PredictScope = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobFile, setJobFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadFiles = async () => {
        if (!resumeFile || !jobFile) return;
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("job_description", jobFile);
        setLoading(true);

        try {
            const res = await xgApi.post("/full-analysis", formData);
            setResult(res.data);
        } catch (e) {
            console.error("Analysis Error:", e);
        }
        setLoading(false);
    };

    const SkillChip = ({ skill, type }) => {
        const styles = {
            matched: "bg-emerald-50 text-emerald-700 border-emerald-200",
            missing: "bg-rose-50 text-rose-700 border-rose-200",
            resume: "bg-slate-100 text-slate-700 border-slate-300",
            job: "bg-indigo-50 text-indigo-700 border-indigo-200"
        };
        return (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 ${styles[type]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                {skill}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10 font-sans text-slate-900">
            {/* --- HEADER --- */}
            <div className="max-w-6xl mx-auto mb-8">
                {/* <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <Layers className="text-indigo-600" /> Smart Career Advisor AI
                </h1> */}
                <h2 className="text-2xl font-black text-slate-750 flex items-center gap-3">Side-by-side Skill Matching & Gap Analysis</h2>
            </div>

            {/* --- UPLOAD SECTION --- */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">📄 Resume (PDF/DOCX)</label>
                    <input type="file" onChange={(e) => setResumeFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer" />
                    {resumeFile && <p className="text-emerald-600 mt-2 text-xs font-bold">✓ {resumeFile.name}</p>}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">💼 Job Description</label>
                    <input type="file" onChange={(e) => setJobFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer" />
                    {jobFile && <p className="text-emerald-600 mt-2 text-xs font-bold">✓ {jobFile.name}</p>}
                </div>
                <button 
                    onClick={uploadFiles}
                    disabled={loading || !resumeFile || !jobFile}
                    className={`md:col-span-2 py-4 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'}`}
                >
                    {loading ? "AI is processing..." : "Start Deep Analysis"}
                </button>
            </div>

            {result && (
                <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
                    
                    {/* --- SCORE & PREDICTION BANNER --- */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                        <div className="p-8 bg-indigo-50 border-r border-slate-200 flex flex-col items-center justify-center min-w-[240px]">
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Match Score</span>
                            <span className="text-6xl font-black text-indigo-600">{result.match_score.toFixed(0)}%</span>
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-center">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">AI Recommendation</h3>
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-bold text-slate-800">{result.prediction.prediction}</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                    Confidence: {(result.prediction.confidence * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* --- SIDE-BY-SIDE 1: EXTRACTION --- */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText size={16} /> Skills found in Resume
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.resume_skills.map(s => <SkillChip key={s} skill={s} type="resume" />)}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Search size={16} /> Required Keywords (JD)
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.job_skills.map(s => <SkillChip key={s} skill={s} type="job" />)}
                            </div>
                        </div>
                    </div>

                    {/* --- SIDE-BY-SIDE 2: MATCH VS GAP --- */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6 shadow-sm">
                            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle size={16} /> Matched Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.matched_skills.map(s => <SkillChip key={s} skill={s} type="matched" />)}
                            </div>
                        </div>
                        <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 shadow-sm">
                            <h3 className="text-sm font-black text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <XCircle size={16} /> Missing (Focus Area)
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_skills.map(s => <SkillChip key={s} skill={s} type="missing" />)}
                            </div>
                        </div>
                    </div>

                    {/* --- ACTIONABLE STEPS --- */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <BookOpen className="text-indigo-600" /> Learning Roadmap
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(result.learning_resources).map(([skill, link]) => (
                                    <a key={skill} href={link} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                                        <span className="font-bold text-slate-700">{skill}</span>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Lightbulb className="text-amber-500" /> Portfolio Project Ideas
                            </h3>
                            <div className="p-5 rounded-xl bg-slate-50 text-slate-700 text-sm leading-relaxed border-l-4 border-amber-400 prose prose-sm max-w-none">
                                <ReactMarkdown>
                                    {result.project_ideas}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictScope;