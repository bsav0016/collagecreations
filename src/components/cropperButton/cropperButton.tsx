import React from "react";

interface CropperButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
    variant?: "primary" | "secondary";
}

function CropperButton({ 
    onClick, 
    text, 
    disabled = false, 
    type = "button", 
    fullWidth = false,
    variant = "secondary"
}: CropperButtonProps) {
    const baseClasses = "inline-block py-2 px-4 cursor-pointer border-none rounded-md text-sm mx-[3px] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed";
    const variantClasses = variant === "primary"
        ? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        : "bg-muted text-muted-foreground hover:bg-muted/80";

    const buttonElement = (
        <button
            className={`${baseClasses} ${variantClasses}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {text}
        </button>
    );

    return fullWidth ? buttonElement : <div>{buttonElement}</div>;
}

export default CropperButton;
