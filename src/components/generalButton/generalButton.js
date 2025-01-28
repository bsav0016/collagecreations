import React from "react";
import styles from './generalButton.module.css';
import { MARGINS } from "../../utils/constants/constants";

function GeneralButton({ onClick, text, disabled = false, type = 'button', fullWidth = false }) {
    const buttonElement = (
        <button
            className={styles.generalButton}
            style={{ margin: MARGINS.SMALL}}
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
