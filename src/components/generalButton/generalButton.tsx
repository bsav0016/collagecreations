import React from "react";
import { MARGINS } from "../../utils/constants/constants";

interface GeneralButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
    variant?: "default" | "primary" | "confirm" | "ghost";
}

function GeneralButton({
    onClick,
    text,
    disabled = false,
    type = "button",
    fullWidth = false,
    variant = "default",
}: GeneralButtonProps) {
    const baseClasses = "inline-block py-[10px] px-5 cursor-pointer text-base disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed rounded-md transition-colors duration-200";

    const variantClasses = {
        primary: "bg-gradient-to-r from-indigo-600 via-blue-700 to-blue-900 text-white font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed rounded-full border border-transparent",
        confirm: "bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 border border-transparent",
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent",
        ghost:
            "bg-transparent text-primary border border-current hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md",
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
