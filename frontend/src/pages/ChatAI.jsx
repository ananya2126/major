import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ReactMarkdown from "react-markdown";

const ChatAI = () => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const chatEndRef = useRef(null);

    // Check auth
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    // Auto scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMessage = message;

        setChatHistory(prev => [
            ...prev,
            { type: "user", text: userMessage }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const res = await api.post("/ai/chat", { message: userMessage });

            setChatHistory(prev => [
                ...prev,
                { type: "ai", text: res.data }
            ]);

            setError(null);

        } catch (err) {

            setChatHistory(prev => [
                ...prev,
                {
                    type: "ai",
                    text: "⚠️ Something went wrong. Please try again."
                }
            ]);

            setError("Failed to get AI response.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">

            <div className="max-w-4xl mx-auto flex flex-col h-[85vh]">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        AI Assistant
                    </h1>
                    <p className="text-slate-600">
                        Ask anything about your studies
                    </p>
                </div>

                {/* Chat Window */}
                <div className="flex-1 overflow-y-auto space-y-4 bg-white/80 p-6 rounded-2xl shadow-lg border">

                    {chatHistory.length === 0 && (
                        <div className="text-center text-slate-500 py-10">
                            🤖 Ask your first question
                        </div>
                    )}

                    {chatHistory.map((chat, index) => (

                        <div
                            key={index}
                            className={`flex ${
                                chat.type === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >

                            <div
                                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow ${
                                    chat.type === "user"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white border"
                                }`}
                            >

                                {chat.type === "ai" ? (
                                    <ReactMarkdown>
                                        {chat.text}
                                    </ReactMarkdown>
                                ) : (
                                    <p>{chat.text}</p>
                                )}

                            </div>

                        </div>

                    ))}

                    {loading && (
                        <div className="text-sm text-gray-500">
                            AI is thinking...
                        </div>
                    )}

                    <div ref={chatEndRef}></div>

                </div>

                {/* Input */}
                <div className="mt-4 flex gap-2">

                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="flex-1 border rounded-xl p-3"
                        placeholder="Type message..."
                        rows="2"
                        disabled={loading}
                    />

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-indigo-600 text-white px-6 rounded-xl"
                    >
                        Send
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ChatAI;
