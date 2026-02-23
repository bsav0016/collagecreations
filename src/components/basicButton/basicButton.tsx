import React from "react";

interface BasicButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
}

function BasicButton({ 
    onClick, 
    text, 
    disabled = false, 
    type = "button", 
    fullWidth = false 
}: BasicButtonProps) {
    const buttonElement = (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
            className="px-4 py-2 cursor-pointer bg-primary text-primary-foreground border-none rounded-md text-base hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
            {text}
        </button>
    );

    return fullWidth ? buttonElement : <div>{buttonElement}</div>;
}

export default BasicButton;
