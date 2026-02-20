"use client";

import React, { useState } from "react";
import { Sidebar, LayoutPanelLeft, Activity } from "lucide-react";
import { useSessionStore } from "@/hooks/useSessionStore";
import { ParticipantView } from "@/components/video/ParticipantView";
import { Controls } from "@/components/video/Controls";
import { Timer } from "@/components/video/Timer";
import { AIPanel } from "./AIPanel";
import { EndModal } from "./EndModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Room, RemoteParticipant } from "livekit-client";

interface SessionRoomProps {
    room: Room | null;
    remoteParticipants: RemoteParticipant[];
}

export function SessionRoom({ room, remoteParticipants }: SessionRoomProps) {
    const { sessionId, userRole, setPhase } = useSessionStore();
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(userRole === "mentor");
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const handleEnd = (reason: string) => {
        console.log("Session ended with reason:", reason);
        setPhase("summary");
    };

    const toggleScreenShare = () => {
        if (room && room.state === 'connected') {
            if (isScreenSharing) {
                room.localParticipant.setScreenShareEnabled(false);
            } else {
                room.localParticipant.setScreenShareEnabled(true);
            }
            setIsScreenSharing(!isScreenSharing);
        }
    };

    return (
        <div className="flex h-screen bg-[#121212] overflow-hidden text-white">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Indicators */}
                <header className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <Timer />
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/20 rounded-full border border-success/30">
                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                            <span className="text-xs font-bold text-success uppercase tracking-wider">Secure Recording Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pointer-events-auto">
                        <Badge variant="info" className="bg-white/5 border-white/10 text-white flex gap-2 py-1.5">
                            <Activity size={14} className="text-primary-purple" />
                            98ms latency
                        </Badge>
                        {userRole === "mentor" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="rounded-full bg-white/5 border border-white/10 text-white"
                            >
                                <LayoutPanelLeft size={20} />
                            </Button>
                        )}
                    </div>
                </header>

                {/* Video Grid */}
                <div className={cn(
                    "flex-1 p-6 md:p-8 pt-24 pb-32 transition-all duration-500",
                    "grid gap-6",
                    remoteParticipants.length === 0 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                )}>
                    {/* Local Participant */}
                    {room && room.state === 'connected' && (
                        <ParticipantView participant={room.localParticipant} isLocal />
                    )}

                    {/* Remote Participants */}
                    {remoteParticipants.map((p) => (
                        <ParticipantView key={p.sid} participant={p} />
                    ))}

                    {/* Fallback if alone */}
                    {remoteParticipants.length === 0 && (
                        <div className="flex items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10 italic text-slate-500">
                            Waiting for other participant to join video stream...
                        </div>
                    )}
                </div>

                {/* Floating Controls */}
                <footer className="absolute bottom-6 left-0 right-0 flex justify-center px-6 z-20 pointer-events-none">
                    <div className="pointer-events-auto w-full max-w-lg">
                        <Controls
                            onEnd={() => setIsEndModalOpen(true)}
                            onScreenShare={toggleScreenShare}
                            isScreenSharing={isScreenSharing}
                        />
                    </div>
                </footer>
            </div>

            {/* Sidebar (Mentor Only) */}
            <aside className={cn(
                "bg-transparent transition-all duration-500 ease-in-out h-full overflow-hidden shrink-0",
                showSidebar ? "w-full md:w-[380px] opacity-100" : "w-0 opacity-0"
            )}>
                <AIPanel />
            </aside>

            <EndModal
                isOpen={isEndModalOpen}
                onClose={() => setIsEndModalOpen(false)}
                onConfirm={handleEnd}
            />
        </div>
    );
}
