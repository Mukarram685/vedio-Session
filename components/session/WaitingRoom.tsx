"use client";

import React, { useState, useEffect } from "react";
import { Users, Loader2, ArrowRight, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSessionStore } from "@/hooks/useSessionStore";
import { Room } from "livekit-client";
import { StartModal } from "./StartModal";

interface WaitingRoomProps {
    room: Room | null;
    sendSignal: (msg: string) => void;
}

export function WaitingRoom({ room, sendSignal }: WaitingRoomProps) {
    const { userRole, participantsReady, setPhase, sessionId } = useSessionStore();
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [dots, setDots] = useState("");
    const [copied, setCopied] = useState(false);
    const [invitationUrl, setInvitationUrl] = useState("");
    const [displayHost, setDisplayHost] = useState("");

    // Set URL after mount to avoid hydration mismatch
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setInvitationUrl(`${window.location.origin}/?session=${sessionId}`);
            setDisplayHost(`${window.location.host}/?session=${sessionId}`);
        }
    }, [sessionId]);

    const copyInviteLink = () => {
        if (invitationUrl) {
            navigator.clipboard.writeText(invitationUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Loading animation for text
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleStart = () => {
        if (!sessionId) return;
        setIsStartModalOpen(true);
        // Signal all participants to join the session
        sendSignal("START_SESSION");
    };

    const handleComplete = () => {
        setIsStartModalOpen(false);
        setPhase("active");
    };

    const isReady = participantsReady >= 2;

    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <Card className="text-center p-12 space-y-8 relative overflow-hidden">
                {/* Background Wave Decoration */}
                <div className="absolute top-0 left-0 w-full opacity-5 pointer-events-none">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#A11692" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
                    </svg>
                </div>

                <div className="inline-flex items-center justify-center p-4 bg-primary-purple/10 rounded-full mb-4">
                    <Users className="h-10 w-10 text-primary-purple" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-text-grey">Waiting Room</h1>
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant={isReady ? "success" : "info"} className="px-4 py-1.5 text-sm uppercase tracking-wider">
                            {participantsReady}/{room?.state === 'connected' ? Math.max(2, participantsReady) : 2} Participants Ready
                        </Badge>
                    </div>
                </div>

                <div className="py-10 bg-slate-50 rounded-3xl border border-slate-100">
                    {!isReady ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 text-primary-purple animate-spin" />
                            <p className="text-lg font-medium text-text-grey">Waiting for other participant{dots}</p>
                            <p className="text-sm text-slate-400">Please stay on this page. Your session will begin shortly.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-success">
                                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                <p className="text-lg font-bold">Both participants are ready!</p>
                            </div>
                            {userRole === "mentor" ? (
                                <p className="text-text-grey">You can now start the healthcare session.</p>
                            ) : (
                                <p className="text-text-grey">Waiting for the mentor to start the session.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest px-2">Invite Participant</p>
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
                        <div className="flex-1 px-4 overflow-hidden text-ellipsis whitespace-nowrap text-slate-500 text-sm font-mono leading-none py-2">
                            {displayHost || "Loading..."}
                        </div>
                        <Button
                            variant={copied ? "primary" : "outline"}
                            size="sm"
                            className="rounded-full px-6 h-9 gap-2 transition-all"
                            onClick={copyInviteLink}
                            disabled={!displayHost}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? "Copied!" : "Copy Link"}
                        </Button>
                    </div>
                </div>

                {userRole === "mentor" && (
                    <Button
                        size="lg"
                        className="w-full h-16 text-lg group shadow-lg shadow-primary-purple/20"
                        disabled={!isReady}
                        onClick={handleStart}
                    >
                        Start Session
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                )}
            </Card>

            <StartModal isOpen={isStartModalOpen} onComplete={handleComplete} />
        </div>
    );
}
