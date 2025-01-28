import React from "react";
import styles from './cropperButton.module.css';

function CropperButton({ onClick, text, disabled = false, type = 'button', fullWidth = false }) {
    const buttonElement = (
        <button
            className={styles.cropperButton}
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
