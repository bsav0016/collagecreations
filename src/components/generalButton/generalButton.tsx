import React from "react";
import { MARGINS } from "../../utils/constants/constants";

interface GeneralButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
    variant?: "default" | "primary" | "confirm";
}

function GeneralButton({
    onClick,
    text,
    disabled = false,
    type = "button",
    fullWidth = false,
    variant = "default",
}: GeneralButtonProps) {
    const baseClasses = "inline-block py-[10px] px-5 cursor-pointer border-none text-base disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed rounded-md";
    
    const variantClasses = {
        primary: "bg-gradient-to-r from-blue-700 via-purple-700 to-red-700 text-white font-semibold hover:opacity-90 rounded-full",
        confirm: "bg-blue-600 text-white font-medium hover:bg-blue-700",
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
    }[variant];

    const buttonElement = (
        <button
            className={`${baseClasses} ${variantClasses}`}
            style={{ margin: MARGINS.SMALL }}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {text}
        </button>
    );

    return fullWidth ? buttonElement : <div>{buttonElement}</div>;
}

export default GeneralButton;
