"use client";

import React, { useState, useEffect } from "react";
import { Brain, LineChart, MessageSquare, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function AIPanel() {
    const [sentiment, setSentiment] = useState("Positive");
    const [insights, setInsights] = useState([
        "Patient is showing signs of improvement.",
        "Engagement levels are high.",
    ]);

    // Mock real-time updates
    useEffect(() => {
        const sentiments = ["Positive", "Neutral", "Optimistic"];
        const mockInsights = [
            "Speech patterns indicate calm state.",
            "Visual engagement confirmed.",
            "Respiration rate appears stable.",
        ];

        const interval = setInterval(() => {
            setSentiment(sentiments[Math.floor(Math.random() * sentiments.length)]);
            if (Math.random() > 0.7) {
                setInsights((prev) => [
                    mockInsights[Math.floor(Math.random() * mockInsights.length)],
                    ...prev.slice(0, 3),
                ]);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="h-full flex flex-col border-l border-white/10 bg-white/5 backdrop-blur-md text-white overflow-hidden rounded-none md:rounded-[32px] md:m-4">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-6 w-6 text-accent-purple" />
                    <h2 className="text-xl font-bold">AI Companion</h2>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-accent-purple" />
                        <span className="text-sm font-medium">Sentiment</span>
                    </div>
                    <Badge variant="success" className="bg-success/20 text-success border-success/30 px-3">
                        {sentiment}
                    </Badge>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <section>
                    <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <LineChart size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Real-time Insights</h3>
                    </div>
                    <div className="space-y-4">
                        {insights.map((insight, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 animate-in slide-in-from-right duration-500">
                                <p className="text-sm leading-relaxed text-slate-200">{insight}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <MessageSquare size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Risk Indicators</h3>
                    </div>
                    <div className="p-4 bg-success/5 rounded-2xl border border-success/20">
                        <p className="text-xs text-success">Low Risk Detected. All systems stable.</p>
                    </div>
                </section>
            </div>
        </Card>
    );
}
