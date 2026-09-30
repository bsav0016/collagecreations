import React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface GeneralButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
    variant?: "default" | "primary" | "confirm" | "ghost";
    size?: "default" | "sm" | "lg";
}

// Every call site shares one primary style; "ghost" is the secondary (outline) style.
const variantMap = {
    default: "default",
    primary: "default",
    confirm: "default",
    ghost: "outline",
} as const;

function GeneralButton({
    onClick,
    text,
    disabled = false,
    type = "button",
    fullWidth = false,
    variant = "default",
    size = "default",
}: GeneralButtonProps) {
    const buttonElement = (
        <Button
            className={cn("m-1.5", fullWidth && "w-full mx-0")}
            variant={variantMap[variant]}
            size={size}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {text}
        </Button>
    );

    return fullWidth ? buttonElement : <div>{buttonElement}</div>;
}

export default GeneralButton;
