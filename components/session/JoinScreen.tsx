"use client";

import React from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DevicePreview } from "./DevicePreview";
import { useSessionStore } from "@/hooks/useSessionStore";
import { api } from "@/services/api";

export function JoinScreen() {
    const { consentGiven, setConsent, setPhase, sessionId, setSessionId, userRole, setRole } = useSessionStore();
    const [isJoining, setIsJoining] = React.useState(false);

    const handleJoin = async () => {
        if (!consentGiven) return;

        setIsJoining(true);
        try {
            const { id } = await api.createSession(sessionId || undefined);
            setSessionId(id);
            setPhase("waiting");
        } catch (err) {
            console.error("Failed to join session:", err);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-primary-purple mb-4">Join Your Video Session</h1>
                <p className="text-lg text-text-grey max-w-xl mx-auto">
                    Please check your camera and microphone, and confirm your consent to start the healthcare consultation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left: Preview */}
                <div className="space-y-6">
                    <DevicePreview />

                    <div className="flex gap-4">
                        <Button
                            variant={userRole === "mentee" ? "primary" : "outline"}
                            onClick={() => setRole("mentee")}
                            className="flex-1"
                        >
                            I&apos;m a Patient
                        </Button>
                        <Button
                            variant={userRole === "mentor" ? "primary" : "outline"}
                            onClick={() => setRole("mentor")}
                            className="flex-1"
                        >
                            I&apos;m a Mentor
                        </Button>
                    </div>
                </div>

                {/* Right: Consent & Join */}
                <Card className="flex flex-col h-full">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-6">Terms of Service & Consent</h2>

                        <ul className="space-y-4 mb-8 text-sm text-text-grey">
                            <li className="flex gap-3">
                                <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                    <Check className="h-3 w-3 text-success" />
                                </div>
                                <span>I understand this session may be private and encrypted.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                    <Check className="h-3 w-3 text-success" />
                                </div>
                                <span>I agree to the processing of my health data for this session.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                    <Check className="h-3 w-3 text-success" />
                                </div>
                                <span>I confirm that I am in a private environment for this call.</span>
                            </li>
                        </ul>

                        <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors border-2 border-transparent has-[:checked]:border-primary-purple">
                            <input
                                type="checkbox"
                                checked={consentGiven}
                                onChange={(e) => setConsent(e.target.checked)}
                                className="h-5 w-5 rounded border-slate-300 text-primary-purple focus:ring-primary-purple"
                            />
                            <span className="text-sm font-medium">I give my consent to join the session</span>
                        </label>
                    </div>

                    <div className="mt-8">
                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            disabled={!consentGiven || isJoining}
                            onClick={handleJoin}
                        >
                            {isJoining ? "Joining Session..." : "Join Session Now"}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
