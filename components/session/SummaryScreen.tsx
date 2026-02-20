"use client";

import React from "react";
import { CheckCircle2, Calendar, FileText, ArrowRight, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSessionStore } from "@/hooks/useSessionStore";

export function SummaryScreen() {
    const { reset } = useSessionStore();

    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-20 w-20 bg-success/10 rounded-full mb-6">
                    <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h1 className="text-4xl font-bold text-text-grey mb-3">Session Successfully Completed</h1>
                <p className="text-slate-500">A summary of your healthcare session has been generated.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary-purple" />
                        Session Overview
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-slate-50">
                            <span className="text-slate-500">Duration</span>
                            <span className="font-semibold">45 Minutes</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-50">
                            <span className="text-slate-500">Session ID</span>
                            <span className="font-mono text-sm">#SESS-8B92-X</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-slate-50">
                            <span className="text-slate-500">Participants</span>
                            <span className="font-semibold">2 (Mentor & Mentee)</span>
                        </div>
                        <div className="flex justify-between py-3">
                            <span className="text-slate-500">Status</span>
                            <span className="text-success font-bold uppercase text-xs tracking-widest">Finalized</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary-purple" />
                        Next Steps
                    </h2>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-4">Based on your session, we recommend the following actions:</p>
                        <div className="p-4 bg-primary-purple/5 rounded-2xl border border-primary-purple/10 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-primary-purple text-sm">Follow-up Session</p>
                                <p className="text-xs text-slate-500">Schedule for next week</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">Schedule</Button>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-text-grey text-sm">Review Transcript</p>
                                <p className="text-xs text-slate-500">Available in your dashboard</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">View</Button>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Button variant="primary" size="lg" className="px-10" onClick={() => window.location.reload()}>
                    Return to Dashboard
                </Button>
                <Button variant="ghost" size="lg" className="px-10 flex gap-2" onClick={reset}>
                    <RefreshCw size={18} />
                    Start New Session
                </Button>
            </div>
        </div>
    );
}
