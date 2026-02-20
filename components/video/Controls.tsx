"use client";

import React from "react";
import { Mic, MicOff, Camera, CameraOff, Monitor, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSessionStore } from "@/hooks/useSessionStore";
import { cn } from "@/lib/utils";

interface ControlsProps {
    onEnd: () => void;
    onScreenShare: () => void;
    isScreenSharing: boolean;
}

export function Controls({ onEnd, onScreenShare, isScreenSharing }: ControlsProps) {
    const { devices, toggleDevice } = useSessionStore();

    return (
        <div className="flex items-center justify-between gap-4 w-full max-w-4xl mx-auto px-6 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3">
                {/* Core Controls */}
                <Button
                    variant={devices.audio ? "ghost" : "danger"}
                    size="icon"
                    onClick={() => toggleDevice("audio")}
                    className={cn("rounded-full h-12 w-12 text-white", devices.audio && "bg-white/10 hover:bg-white/20")}
                    aria-label={devices.audio ? "Mute Microphone" : "Unmute Microphone"}
                >
                    {devices.audio ? <Mic size={24} /> : <MicOff size={24} />}
                </Button>
                <Button
                    variant={devices.video ? "ghost" : "danger"}
                    size="icon"
                    onClick={() => toggleDevice("video")}
                    className={cn("rounded-full h-12 w-12 text-white", devices.video && "bg-white/10 hover:bg-white/20")}
                    aria-label={devices.video ? "Stop Video" : "Start Video"}
                >
                    {devices.video ? <Camera size={24} /> : <CameraOff size={24} />}
                </Button>
                <Button
                    variant={isScreenSharing ? "primary" : "ghost"}
                    size="icon"
                    onClick={onScreenShare}
                    className={cn("rounded-full h-12 w-12 text-white", !isScreenSharing && "bg-white/10 hover:bg-white/20")}
                    aria-label="Share Screen"
                >
                    <Monitor size={24} />
                </Button>
            </div>

            <div className="flex items-center gap-3">
                {/* Emergency Terminate (Optional but encouraged) */}
                <Button
                    variant="danger"
                    className="hidden md:flex px-6 rounded-full font-bold bg-red-600 hover:bg-red-700"
                    onClick={onEnd}
                >
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    EMERGENCY END
                </Button>

                <Button
                    variant="danger"
                    size="icon"
                    onClick={onEnd}
                    className="rounded-full h-12 w-12 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"
                    aria-label="End Session"
                >
                    <X size={28} />
                </Button>
            </div>
        </div>
    );
}
