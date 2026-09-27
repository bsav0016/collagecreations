import React from "react";
import { Input } from "../ui/input";

interface TextInputProps {
    maxWidth?: string;
    type?: string;
    required?: boolean;
    id?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    flex?: number;
}

const TextInput: React.FC<TextInputProps> = ({
    maxWidth = "600px",
    type = "text",
    required,
    id,
    value,
    onChange,
    placeholder,
    disabled,
    maxLength,
    flex,
}) => {
    return (
        <Input
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
    );
};

export default TextInput;
