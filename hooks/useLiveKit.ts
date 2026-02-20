"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Room,
    RoomEvent,
    RemoteParticipant,
    TrackPublication,
    DataPacket_Kind,
} from "livekit-client";
import { useSessionStore } from "@/hooks/useSessionStore";

export function useLiveKit(sessionId: string | null, identity?: string) {
    const [room, setRoom] = useState<Room | null>(null);
    const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { devices, setPhase, setParticipants } = useSessionStore();

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

            // Auto-publish tracks with safety checks for secure context
            const canPublish = typeof navigator !== 'undefined' &&
                navigator.mediaDevices &&
                typeof navigator.mediaDevices.getUserMedia === 'function';

            if (canPublish) {
                if (devices.video) await newRoom.localParticipant.setCameraEnabled(true).catch(console.warn);
                if (devices.audio) await newRoom.localParticipant.setMicrophoneEnabled(true).catch(console.warn);
            }

            setRoom(newRoom);
            setRemoteParticipants(Array.from(newRoom.remoteParticipants.values()));
        } catch (err) {
            console.error("LiveKit connection error:", err);
            setError("Failed to connect to video server.");
        }
    }, [sessionId, identity, devices.video, devices.audio, setPhase, setParticipants]);

    useEffect(() => {
        if (sessionId) {
            connect();
        }
        return () => {
            room?.disconnect();
        };
    }, [sessionId, connect]); // We want to reconnect if identity changes (login flow)

    // Handle toggles from store
    useEffect(() => {
        if (room && room.state === 'connected') {
            room.localParticipant.setCameraEnabled(devices.video).catch(console.warn);
        }
    }, [room, devices.video]);

    useEffect(() => {
        if (room && room.state === 'connected') {
            room.localParticipant.setMicrophoneEnabled(devices.audio).catch(console.warn);
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
