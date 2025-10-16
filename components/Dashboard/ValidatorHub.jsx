"use client";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";

export function ValidatorHub({ firstName, creditsLeft, onAnalysisStart, onAnalysisComplete, onAnalysisError, userId }) {
    const [idea, setIdea] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const maxLength = 1000;

    const handleAnalyze = async () => {
        if (!idea.trim() || !userId) {
            return;
        }

        setIsLoading(true);
        if (onAnalysisStart) onAnalysisStart();

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startupIdea: idea,
                    userId: userId,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong.');
            }
            
            if (onAnalysisComplete) onAnalysisComplete(result.data);

        } catch (error) {
            console.error("Analysis failed:", error);
            if (onAnalysisError) onAnalysisError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
                <h2 className="mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Welcome back, {firstName}.
                </h2>

                <div className="space-y-4">
                    <Textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value.slice(0, maxLength))}
                        placeholder="Describe your next world-changing idea..."
                        className="min-h-[160px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 resize-none"
                        disabled={isLoading}
                    />
                    
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500" style={{ fontSize: "12px" }}>
                            {idea.length}/{maxLength}
                        </span>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!idea.trim() || isLoading || creditsLeft <= 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:shadow-none relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 animate-pulse transition-opacity duration-300" />
                        
                        <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2} />
                        <span style={{ fontWeight: 600 }}>{isLoading ? 'Analyzing...' : 'Analyze Idea'}</span>
                    </button>

                    <div className="text-center">
                        <span className="text-gray-400" style={{ fontSize: "14px" }}>
                            You have{" "}
                            <span style={{ fontWeight: 700 }} className="text-white">
                                {creditsLeft}
                            </span>{" "}
                            Credits remaining.{" "}
                            <button className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">
                                Get More
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
