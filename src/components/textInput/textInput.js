import React from "react";
import styles from './textInput.module.css';

const TextInput = ({
    maxWidth = '600px', 
    type = 'text',
    required, 
    id, 
    value, 
    onChange, 
    placeholder, 
    disabled,
    maxLength,
    flex
}) => {
    return (
        <input
            className={styles.textInput}
            style={{ maxWidth: maxWidth, flex: flex }}
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
        />
    )
}

export default TextInput;