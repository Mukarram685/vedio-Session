"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Room,
    RoomEvent,
    RemoteParticipant,
} from "livekit-client";
import { useSessionStore } from "@/hooks/useSessionStore";

export function useLiveKit(sessionId: string | null, identity?: string) {
    const [room, setRoom] = useState<Room | null>(null);
    const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { phase, devices, setPhase, setParticipants, toggleDevice } = useSessionStore();

    const connect = useCallback(async () => {
        if (!sessionId) return;
        try {
            const userId = identity || `user-${Math.random().toString(36).substring(7)}`;
            const res = await fetch(`/api/livekit/token?room=${sessionId}&identity=${userId}`);
            const { token } = await res.json();

            const newRoom = new Room({
                adaptiveStream: true,
                dynacast: true,
            });

            newRoom
                .on(RoomEvent.Connected, () => {
                    setIsConnected(true);
                    setParticipants(newRoom.remoteParticipants.size + 1);
                })
                .on(RoomEvent.Disconnected, () => {
                    setIsConnected(false);
                    setRoom(null);
                })
                .on(RoomEvent.ParticipantConnected, () => {
                    setRemoteParticipants(Array.from(newRoom.remoteParticipants.values()));
                    setParticipants(newRoom.remoteParticipants.size + 1);
                })
                .on(RoomEvent.ParticipantDisconnected, () => {
                    setRemoteParticipants(Array.from(newRoom.remoteParticipants.values()));
                    setParticipants(newRoom.remoteParticipants.size + 1);
                })
                .on(RoomEvent.TrackSubscribed, () => {
                    setRemoteParticipants(Array.from(newRoom.remoteParticipants.values()));
                })
                .on(RoomEvent.DataReceived, (payload) => {
                    const decoder = new TextDecoder();
                    const message = decoder.decode(payload);
                    if (message === "START_SESSION") {
                        setPhase("active");
                    }
                });

            await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || "", token);

            setRoom(newRoom);
            setRemoteParticipants(Array.from(newRoom.remoteParticipants.values()));
        } catch (err) {
            console.error("LiveKit connection error:", err);
            setError("Failed to connect to video server.");
        }
    }, [sessionId, identity, setPhase, setParticipants]);

    useEffect(() => {
        // Only trigger connect if we don't have a room yet or the sessionId changed
        if (sessionId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            connect();
        }

        return () => {
            // Cleanup: Disconnect when the sessionId changes or component unmounts
            // Note: room is captured in this closure
        };
    }, [sessionId, connect]);

    // Separate effect for disconnection to avoid re-triggering connection
    useEffect(() => {
        return () => {
            if (room) {
                console.log("Disconnecting from room...");
                room.disconnect();
            }
        };
    }, [room]);

    // Handle session start: Auto-enable camera if it's off
    useEffect(() => {
        if (phase === "active" && !devices.video) {
            // Check if we have permission/secure context before forcing
            const canPublish = typeof navigator !== 'undefined' &&
                navigator.mediaDevices &&
                typeof navigator.mediaDevices.getUserMedia === 'function';

            if (canPublish) {
                // If it's disabled in store, toggle it on
                toggleDevice("video");
            }
        }
    }, [phase, devices.video, toggleDevice]);

    // Handle toggles from store separately (no reconnection)
    useEffect(() => {
        if (room && room.state === 'connected') {
            const canPublish = typeof navigator !== 'undefined' &&
                navigator.mediaDevices &&
                typeof navigator.mediaDevices.getUserMedia === 'function';

            if (canPublish) {
                room.localParticipant.setCameraEnabled(devices.video).catch(console.warn);
            }
        }
    }, [room, devices.video]);

    useEffect(() => {
        if (room && room.state === 'connected') {
            const canPublish = typeof navigator !== 'undefined' &&
                navigator.mediaDevices &&
                typeof navigator.mediaDevices.getUserMedia === 'function';

            if (canPublish) {
                room.localParticipant.setMicrophoneEnabled(devices.audio).catch(console.warn);
            }
        }
    }, [room, devices.audio]);

    const sendSignal = useCallback((message: string) => {
        if (room && room.state === 'connected') {
            const encoder = new TextEncoder();
            const payload = encoder.encode(message);
            room.localParticipant.publishData(payload, { reliable: true });
        }
    }, [room]);

    return { room, remoteParticipants, isConnected, error, sendSignal };
}
