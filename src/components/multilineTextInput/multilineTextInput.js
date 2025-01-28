import React from "react";
import styles from './multilineTextInput.module.css';

const MultilineTextInput = ({ 
    maxWidth = '600px', 
    required, 
    id, 
    value, 
    onChange, 
    placeholder, 
    disabled, 
    maxLength, 
    rows = 6, 
    width='70%',
    flex
}) => {
    return (
        <textarea
            className={styles.multilineTextInput}
            style={{ width: width, maxWidth: maxWidth, flex: flex }}
            type='text'
            id={id}
            name={id} 
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={rows}
        />
    )
}

export default MultilineTextInput;