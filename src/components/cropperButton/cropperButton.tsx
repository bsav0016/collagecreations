import React from "react";

interface CropperButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "ghost";
    icon?: React.ReactNode;
    className?: string;
}

// Buttons for the cropper's dark control bar. min-h-11 keeps them at a comfortable 44px tap target.
function CropperButton({
    onClick,
    text,
    disabled = false,
    type = "button",
    variant = "secondary",
    icon,
    className = "",
}: CropperButtonProps) {
    const baseClasses = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
    const variantClasses = {
        primary: "bg-primary text-primary-foreground font-semibold hover:bg-primary/90",
        secondary: "bg-white/10 text-white hover:bg-white/20",
        ghost: "text-white/70 hover:bg-white/10 hover:text-white",
    }[variant];

    return (
        <button
            className={`${baseClasses} ${variantClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {icon}
            {text}
        </button>
    );
}

export default CropperButton;
