"use client";

import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface StartModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

export function StartModal({ isOpen, onComplete }: StartModalProps) {
    const [steps, setSteps] = useState([
        { id: 1, text: "Validating participants", status: "loading" },
        { id: 2, text: "Initializing secure recording...", status: "pending" },
        { id: 3, text: "Activating AI insights...", status: "pending" },
    ]);

    useEffect(() => {
        if (!isOpen) return;

        const runSteps = async () => {
            // Step 1
            await new Promise((r) => setTimeout(r, 1200));
            setSteps((s) => s.map((t) => (t.id === 1 ? { ...t, status: "complete" } : t)));
            setSteps((s) => s.map((t) => (t.id === 2 ? { ...t, status: "loading" } : t)));

            // Step 2
            await new Promise((r) => setTimeout(r, 1500));
            setSteps((s) => s.map((t) => (t.id === 2 ? { ...t, status: "complete" } : t)));
            setSteps((s) => s.map((t) => (t.id === 3 ? { ...t, status: "loading" } : t)));

            // Step 3
            await new Promise((r) => setTimeout(r, 1000));
            setSteps((s) => s.map((t) => (t.id === 3 ? { ...t, status: "complete" } : t)));

            // Final delay before completion
            await new Promise((r) => setTimeout(r, 800));
            onComplete();
        };

        runSteps();
    }, [isOpen, onComplete]);

    return (
        <Modal isOpen={isOpen} onClose={() => { }} title="Starting Session" showCloseButton={false}>
            <div className="space-y-6">
                <p className="text-text-grey">Please wait while we set up your secure workspace.</p>

                <div className="space-y-4">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                {step.status === "complete" ? (
                                    <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                ) : step.status === "loading" ? (
                                    <Loader2 className="h-6 w-6 text-primary-purple animate-spin" />
                                ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-slate-200" />
                                )}
                            </div>
                            <span className={cn(
                                "text-base font-medium transition-colors",
                                step.status === "complete" ? "text-success" :
                                    step.status === "loading" ? "text-primary-purple font-semibold" : "text-slate-400"
                            )}>
                                {step.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}

import { cn } from "@/lib/utils";
