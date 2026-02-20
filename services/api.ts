export interface Session {
    id: string;
    status: 'waiting' | 'starting' | 'active' | 'ended';
    participants: number;
}

const MOCK_DELAY = 800;

// Use localStorage to simulate a database for the mock
const getSessionData = (id: string): Session | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(`session_${id}`);
    return data ? JSON.parse(data) : null;
};

const saveSessionData = (session: Session) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`session_${session.id}`, JSON.stringify(session));
};

export const api = {
    createSession: async (id?: string): Promise<{ id: string }> => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        const sessionId = id || Math.random().toString(36).substring(7);
        const existing = getSessionData(sessionId);
        if (!existing) {
            saveSessionData({ id: sessionId, status: 'waiting', participants: 1 });
        } else {
            saveSessionData({ ...existing, participants: existing.participants + 1 });
        }
        return { id: sessionId };
    },

    getJoinToken: async (sessionId: string, identity: string): Promise<{ token: string }> => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        const response = await fetch(`/api/livekit/token?room=${sessionId}&identity=${identity}`);
        return response.json();
    },

    startSession: async (sessionId: string): Promise<{ success: boolean }> => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        const session = getSessionData(sessionId);
        if (session) {
            saveSessionData({ ...session, status: 'active' });
        }
        return { success: true };
    },

    endSession: async (sessionId: string): Promise<{ success: boolean }> => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        const session = getSessionData(sessionId);
        if (session) {
            saveSessionData({ ...session, status: 'ended' });
        }
        return { success: true };
    },

    getSessionStatus: async (sessionId: string): Promise<Session> => {
        await new Promise((r) => setTimeout(r, MOCK_DELAY));
        const session = getSessionData(sessionId);
        return session || {
            id: sessionId,
            status: 'waiting',
            participants: 1,
        };
    },
};
