import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "success" | "error" | "warning" | "info" | "neutral";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "neutral", ...props }, ref) => {
        const variants = {
            success: "bg-success/10 text-success border-success/20",
            error: "bg-error/10 text-error border-error/20",
            warning: "bg-amber-100 text-amber-700 border-amber-200",
            info: "bg-primary-purple/10 text-primary-purple border-primary-purple/20",
            neutral: "bg-slate-100 text-slate-600 border-slate-200",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";

export { Badge };
