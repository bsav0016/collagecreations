import React from "react";
import { Button } from "../ui/button";

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
        <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {text}
        </Button>
    );

    return fullWidth ? buttonElement : <div>{buttonElement}</div>;
}

export default BasicButton;
