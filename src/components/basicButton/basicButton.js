import React from "react";

function BasicButton({ onClick, text, disabled = false, type = 'button', fullWidth = false }) {
    const buttonElement = (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {text}
        </button>
    );

    return fullWidth ? buttonElement : <div>{buttonElement}</div>;
}

export default BasicButton;
