"use client";

import React, { useEffect, useRef } from "react";
import { Participant, TrackPublication, Track, RemoteTrack } from "livekit-client";

interface ParticipantViewProps {
    participant: Participant;
    isLocal?: boolean;
}

export function ParticipantView({ participant, isLocal }: ParticipantViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const attachTrack = (track: Track) => {
            if (track.kind === "video" && videoRef.current) {
                track.attach(videoRef.current);
                // Force play to ensure it's not stuck on a black frame
                videoRef.current.play().catch(err => console.warn("Failed to play video:", err));
            } else if (track.kind === "audio" && audioRef.current) {
                track.attach(audioRef.current);
                audioRef.current.play().catch(err => console.warn("Failed to play audio:", err));
            }
        };

        const handleTrackSubscribed = (track: RemoteTrack) => {
            console.log(`Track subscribed: ${track.kind} for ${participant.identity}`);
            attachTrack(track);
        };

        const handleTrackUnsubscribed = (track: RemoteTrack) => {
            track.detach();
        };

        // For local tracks, we might need to handle publication update
        const handleLocalTrackPublished = (publication: TrackPublication) => {
            if (publication.track) {
                attachTrack(publication.track);
            }
        };

        participant.on("trackSubscribed", handleTrackSubscribed);
        participant.on("trackUnsubscribed", handleTrackUnsubscribed);
        participant.on("localTrackPublished", handleLocalTrackPublished);

        // Check for existing tracks and attach them immediately
        participant.trackPublications.forEach((publication: TrackPublication) => {
            if (publication.track) {
                attachTrack(publication.track);
            }
        });

        return () => {
            participant.off("trackSubscribed", handleTrackSubscribed);
            participant.off("trackUnsubscribed", handleTrackUnsubscribed);
            participant.off("localTrackPublished", handleLocalTrackPublished);
            participant.trackPublications.forEach((publication: TrackPublication) => {
                if (publication.track) {
                    publication.track.detach();
                }
            });
        };
    }, [participant]);

    return (
        <div className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden group border border-white/5">
            <video
                ref={videoRef}
                autoPlay
                muted={isLocal}
                playsInline
                className={`w-full h-full object-cover bg-slate-900 ${isLocal ? "scale-x-[-1]" : ""}`}
            />
            <audio ref={audioRef} autoPlay muted={isLocal} />

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-10">
                <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10 font-medium">
                    {participant.identity.split('-')[0]} {isLocal ? "(You)" : ""}
                </span>
            </div>

            {/* Loading/Status Overlay if no video */}
            {!isLocal && !participant.isCameraEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-opacity">
                    <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Camera Off</p>
                </div>
            )}
        </div>
    );
}
