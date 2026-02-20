"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, ShieldAlert, MonitorCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSessionStore } from "@/hooks/useSessionStore";
import { Modal } from "@/components/ui/Modal";

export function DevicePreview() {
    const { devices, toggleDevice } = useSessionStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        async function setupPreview() {
            if (devices.video) {
                try {
                    // Check for secure context or localhost
                    if (typeof window !== 'undefined' && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
                        setError("Secure Context Required");
                        return;
                    }

                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: devices.audio,
                    });
                    setStream(mediaStream);
                    setError(null);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                } catch (err: any) {
                    console.error("Error accessing devices:", err);
                    setError(err.message || "Failed to access camera");
                }
            } else {
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                    setStream(null);
                }
            }
        }

        setupPreview();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [devices.video, devices.audio]);

    return (
        <div className="relative w-full aspect-video bg-slate-900 rounded-[20px] overflow-hidden group border border-white/5 shadow-2xl">
            {devices.video && !error ? (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-800">
                    {error ? (
                        <>
                            <div className="p-4 bg-error/10 rounded-full mb-4">
                                <ShieldAlert size={48} className="text-error" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Browser Security Block</h3>
                            <p className="text-sm text-slate-400 max-w-xs mb-6">
                                Your browser blocks the camera on insecure local IPs (like 192.168.x.x).
                            </p>
                            <Button variant="outline" size="sm" onClick={() => setShowHelp(true)} className="gap-2 border-white/20 text-white">
                                <HelpCircle size={16} />
                                How to fix this?
                            </Button>
                        </>
                    ) : (
                        <>
                            <CameraOff size={48} className="text-slate-500 mb-4" />
                            <p className="text-slate-400 font-medium">Camera is turned off</p>
                        </>
                    )}
                </div>
            )}

            {/* Controls Overlay */}
            {!error && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant={devices.audio ? "ghost" : "danger"}
                        size="icon"
                        onClick={() => toggleDevice("audio")}
                        className="rounded-full h-10 w-10 text-white"
                        aria-label={devices.audio ? "Mute Microphone" : "Unmute Microphone"}
                    >
                        {devices.audio ? <Mic size={20} /> : <MicOff size={20} />}
                    </Button>
                    <Button
                        variant={devices.video ? "ghost" : "danger"}
                        size="icon"
                        onClick={() => toggleDevice("video")}
                        className="rounded-full h-10 w-10 text-white"
                        aria-label={devices.video ? "Turn Camera Off" : "Turn Camera On"}
                    >
                        {devices.video ? <Camera size={20} /> : <CameraOff size={20} />}
                    </Button>
                </div>
            )}

            <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Testing on Multiple Devices">
                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MonitorCheck className="text-primary-purple" size={18} />
                            Option 1: Chrome Override (Easiest)
                        </h4>
                        <ol className="list-decimal list-inside text-sm text-slate-600 space-y-3">
                            <li className="pl-2">Open Chrome and go to: <code className="bg-slate-200 px-1 rounded text-primary-purple">chrome://flags/#unsafely-treat-insecure-origin-as-secure</code></li>
                            <li className="pl-2">Set it to <b>Enabled</b>.</li>
                            <li className="pl-2">Add your IP: <code className="bg-slate-200 px-1 rounded text-primary-purple">{typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : "your-ip-here"}</code></li>
                            <li className="pl-2">Restart Chrome. The camera will now work!</li>
                        </ol>
                    </div>

                    <div className="p-6 bg-primary-purple/5 rounded-2xl border border-primary-purple/10">
                        <h4 className="font-bold text-primary-purple mb-4 flex items-center gap-2">
                            <ShieldAlert size={18} />
                            Option 2: Use a Tunnel (Recommended)
                        </h4>
                        <p className="text-sm text-slate-600 mb-4">
                            Tunnels give you a real HTTPS URL that works on <b>all devices</b> (Phones, Laptops) without any settings.
                        </p>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-500">
                            npx localtunnel --port 3000
                        </div>
                    </div>

                    <Button variant="primary" className="w-full h-12" onClick={() => setShowHelp(false)}>
                        Got it, thanks!
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
