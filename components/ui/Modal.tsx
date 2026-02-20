"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    showCloseButton = true,
}: ModalProps) {
    const [mounted, setMounted] = React.useState(false);
    const modalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Focus trapping
    React.useEffect(() => {
        if (!isOpen) return;

        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener("keydown", handleTab);
        firstElement?.focus();

        return () => window.removeEventListener("keydown", handleTab);
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={cn(
                    "relative w-full max-w-lg animate-in fade-in zoom-in duration-300",
                    "bg-white rounded-[24px] shadow-2xl p-6 md:p-8",
                    className
                )}
            >
                <div className="flex items-center justify-between mb-6">
                    {title && (
                        <h2 id="modal-title" className="text-2xl font-bold text-text-grey">
                            {title}
                        </h2>
                    )}
                    {showCloseButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="absolute right-4 top-4 hover:bg-slate-100"
                            aria-label="Close modal"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    )}
                </div>
                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
}
