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
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white border-none rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
            {text}
        </button>
    );

    return fullWidth ? buttonElement : <div>{buttonElement}</div>;
}

export default BasicButton;
