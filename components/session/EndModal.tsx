"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface EndModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const REASONS = [
    "Session completed naturally",
    "Technical difficulties",
    "Patient request",
    "Medical emergency",
    "Clinical decision",
    "Scheduling conflict",
];

export function EndModal({ isOpen, onClose, onConfirm }: EndModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState(false);

    const handleConfirm = () => {
        if (!reason) {
            setError(true);
            return;
        }
        onConfirm(reason);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="End Healthcare Session">
            <div className="space-y-6">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm">
                        Ending this session will disconnect all participants and generate the final report.
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-text-grey uppercase tracking-wider">
                        Reason for ending
                    </label>
                    <select
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError(false);
                        }}
                        className={`w-full h-14 px-6 rounded-3xl bg-slate-50 border-2 transition-all outline-none appearance-none ${error ? "border-error bg-error/5" : "border-slate-100 focus:border-primary-purple"
                            }`}
                    >
                        <option value="" disabled>Select a reason...</option>
                        {REASONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                    {error && <p className="text-sm text-error font-medium">Please select a reason to terminate the session.</p>}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button variant="danger" size="lg" onClick={handleConfirm}>
                        Yes, End Session
                    </Button>
                    <Button variant="ghost" size="lg" onClick={onClose}>
                        No, Continue Session
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
