import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-primary-purple text-white hover:bg-accent-purple shadow-soft",
            secondary: "bg-white text-primary-purple border-2 border-primary-purple hover:bg-primary-purple/5",
            outline: "border-2 border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white",
            ghost: "hover:bg-primary-purple/10 text-primary-purple",
            danger: "bg-error text-white hover:bg-error/90",
        };

        const sizes = {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-8 text-base",
            lg: "h-14 px-10 text-lg",
            icon: "h-11 w-11 flex items-center justify-center",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "min-h-[44px] min-w-[44px]", // Target accessibility
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
