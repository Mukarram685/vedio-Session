"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useLiveKit } from "@/hooks/useLiveKit";
import { JoinScreen } from "@/components/session/JoinScreen";
import { WaitingRoom } from "@/components/session/WaitingRoom";
import { SessionRoom } from "@/components/session/SessionRoom";
import { SummaryScreen } from "@/components/session/SummaryScreen";

function SessionContent() {
  const { phase, setSessionId, sessionId, userRole } = useSessionStore();
  const searchParams = useSearchParams();
  const { room, remoteParticipants, sendSignal } = useLiveKit(
    sessionId,
    userRole === "mentor" ? "Mentor" : "Patient"
  );

  useEffect(() => {
    const urlSession = searchParams.get("session");
    if (urlSession && !sessionId) {
      setSessionId(urlSession);
    }
  }, [searchParams, setSessionId, sessionId]);

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      {phase === "join" && <JoinScreen />}
      {phase === "waiting" && <WaitingRoom room={room} sendSignal={sendSignal} />}
      {phase === "active" && <SessionRoom room={room} remoteParticipants={remoteParticipants} />}
      {phase === "summary" && <SummaryScreen />}
    </main>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading session...</div>}>
      <SessionContent />
    </Suspense>
  );
}
