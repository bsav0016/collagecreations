import React from "react";

interface CropperButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
}

function CropperButton({ 
    onClick, 
    text, 
    disabled = false, 
    type = "button", 
    fullWidth = false 
}: CropperButtonProps) {
    const buttonElement = (
        <button
            className="inline-block py-2 px-4 cursor-pointer bg-blue-600 text-white border-none rounded-[5px] text-sm mx-[3px] hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
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
