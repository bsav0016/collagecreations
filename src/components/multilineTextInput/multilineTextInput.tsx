import React from "react";

interface MultilineTextInputProps {
    maxWidth?: string;
    required?: boolean;
    id?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    rows?: number;
    width?: string;
    flex?: number;
}

const MultilineTextInput: React.FC<MultilineTextInputProps> = ({
    maxWidth = "600px",
    required,
    id,
    value,
    onChange,
    placeholder,
    disabled,
    maxLength,
    rows = 6,
    width = "70%",
    flex,
}) => {
    return (
        <textarea
            className="my-[5px] mx-0 border-2 border-gray-300 rounded"
            style={{ width: width, maxWidth: maxWidth, flex: flex }}
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
    );
};

export default MultilineTextInput;
