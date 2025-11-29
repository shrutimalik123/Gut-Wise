import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export const ResearchHub: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const topics = [
        "Gut-Brain Axis",
        "Fiber Diversity",
        "Prebiotics vs Probiotics",
        "Fermented Foods",
        "Polyphenols"
    ];

    const handleResearch = async (selectedTopic: string) => {
        setTopic(selectedTopic);
        setLoading(true);
        setResult(null);

        try {
            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: `Provide a concise, scientifically grounded summary (approx 150 words) about "${selectedTopic}" and its impact on gut health. Include one actionable takeaway. Format cleanly.`,
            });
            setResult(response.text || "Could not retrieve information.");
        } catch (error) {
            setResult("Sorry, we couldn't fetch the research at this moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="font-serif text-3xl font-bold text-sage-900">Gut Health Knowledge Hub</h2>
                <p className="text-sage-600 max-w-2xl mx-auto">
                    Understand the science behind what you eat. Explore key topics powered by the latest gut health research.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {topics.map(t => (
                    <button
                        key={t}
                        onClick={() => handleResearch(t)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                            topic === t
                            ? 'bg-sage-700 text-white shadow-lg'
                            : 'bg-white text-sage-700 border border-sage-200 hover:border-sage-400 hover:bg-sage-50'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="min-h-[300px] relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mb-4"></div>
                        <p className="text-sage-600 font-medium animate-pulse">Consulting the AI...</p>
                    </div>
                )}
                
                {result ? (
                    <div className="bg-white rounded-2xl p-8 border border-sage-100 shadow-sm">
                        <h3 className="font-serif text-2xl font-bold text-sage-800 mb-6 border-b border-sage-100 pb-4">{topic}</h3>
                        <div className="prose prose-sage max-w-none text-sage-700 leading-relaxed whitespace-pre-line">
                            {result}
                        </div>
                    </div>
                ) : (
                    <div className="bg-oat-100 rounded-2xl p-12 border border-dashed border-sage-300 flex flex-col items-center justify-center text-center">
                        <svg className="w-16 h-16 text-sage-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        <p className="text-sage-500 font-medium">Select a topic above to learn more.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
