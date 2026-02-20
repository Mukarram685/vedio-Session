"use client";

import { create } from "zustand";

export type SessionPhase = "join" | "waiting" | "active" | "summary";

interface SessionState {
    sessionId: string | null;
    phase: SessionPhase;
    userRole: "mentor" | "mentee";
    participantsReady: number;
    maxParticipants: number;
    devices: {
        video: boolean;
        audio: boolean;
    };
    consentGiven: boolean;

    // Actions
    setSessionId: (id: string) => void;
    setPhase: (phase: SessionPhase) => void;
    setRole: (role: "mentor" | "mentee") => void;
    toggleDevice: (type: "video" | "audio") => void;
    setConsent: (consented: boolean) => void;
    setParticipants: (count: number) => void;
    reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionId: null,
    phase: "join",
    userRole: "mentee", // Default
    participantsReady: 1,
    maxParticipants: 2,
    devices: {
        video: true,
        audio: true,
    },
    consentGiven: false,

    setSessionId: (id) => set({ sessionId: id }),
    setPhase: (phase) => set({ phase }),
    setRole: (role) => set({ userRole: role }),
    toggleDevice: (type) =>
        set((state) => ({
            devices: { ...state.devices, [type]: !state.devices[type] },
        })),
    setConsent: (consented) => set({ consentGiven: consented }),
    setParticipants: (count) => set({ participantsReady: count }),
    reset: () =>
        set({
            sessionId: null,
            phase: "join",
            consentGiven: false,
            participantsReady: 1,
        }),
}));
