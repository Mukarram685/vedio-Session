"use client";

import React, { useEffect, useRef } from "react";
import { Participant, TrackPublication } from "livekit-client";

interface ParticipantViewProps {
    participant: Participant;
    isLocal?: boolean;
}

export function ParticipantView({ participant, isLocal }: ParticipantViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const attachTrack = (track: any) => {
            if (track.kind === "video") {
                track.attach(videoRef.current);
            } else if (track.kind === "audio") {
                track.attach(audioRef.current);
            }
        };

        const handleTrackSubscribed = (track: any) => {
            attachTrack(track);
        };

        const handleTrackUnsubscribed = (track: any) => {
            track.detach();
        };

        participant.on("trackSubscribed", handleTrackSubscribed);
        participant.on("trackUnsubscribed", handleTrackUnsubscribed);

        // Check for existing tracks and attach them immediately
        participant.trackPublications.forEach((publication: TrackPublication) => {
            if (publication.track) {
                attachTrack(publication.track);
            }
        });

        return () => {
            participant.off("trackSubscribed", handleTrackSubscribed);
            participant.off("trackUnsubscribed", handleTrackUnsubscribed);
            participant.trackPublications.forEach((publication: TrackPublication) => {
                if (publication.track) {
                    publication.track.detach();
                }
            });
        };
    }, [participant]);

    return (
        <div className="relative w-full h-full bg-slate-800 rounded-3xl overflow-hidden group">
            <video
                ref={videoRef}
                autoPlay
                muted={isLocal}
                playsInline
                className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
            />
            <audio ref={audioRef} autoPlay muted={isLocal} />

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                <span className="bg-black/40 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full border border-white/10 font-medium">
                    {participant.identity} {isLocal ? "(You)" : ""}
                </span>
            </div>
        </div>
    );
}
