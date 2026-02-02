import React from "react";
import { MARGINS } from "../../utils/constants/constants";

interface GeneralButtonProps {
    onClick?: () => void;
    text: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    fullWidth?: boolean;
}

function GeneralButton({
    onClick,
    text,
    disabled = false,
    type = "button",
    fullWidth = false,
}: GeneralButtonProps) {
    const buttonElement = (
        <button
            className="inline-block py-[10px] px-5 cursor-pointer bg-blue-600 text-white border-none rounded-[5px] text-base hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
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
