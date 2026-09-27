import React from "react";
import TextInput from "../textInput/textInput";
import Checkbox from "../checkbox/checkbox";
import MultilineTextInput from "../multilineTextInput/multilineTextInput";
import StateDropDown from "../stateDropDown";
import { Label } from "../ui/input";

interface FormFieldProps {
    required?: boolean;
    id: string;
    text: string;
    type: string;
    checked?: boolean;
    checkboxSize?: number;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    disabled?: boolean;
    maxWidth?: number;
    placeholder?: string;
    maxLength?: number;
}

const FormField: React.FC<FormFieldProps> = ({
    required,
    id,
    text,
    type,
    checked,
    checkboxSize,
    value,
    onChange,
    disabled,
    maxWidth,
    placeholder,
    maxLength,
}) => {
    // Call sites pass labels like "First Name: "; the stacked layout doesn't need the colon.
    const labelText = text.replace(/:\s*$/, "");

    if (type === "checkbox") {
        return (
            <div className="flex items-center gap-3">
                <Checkbox
                    id={id}
                    checked={checked ?? false}
                    onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    disabled={disabled}
                    checkboxSize={checkboxSize}
                />
                <Label htmlFor={id}>{labelText}</Label>
            </div>
        );
    }

    if (type === "label") {
        return (
            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{labelText}</span>
                <span className="whitespace-pre-wrap break-words">{value}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>
                {labelText}
                {!required && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
            </Label>
            {type === "multilineTextInput" ? (
                <MultilineTextInput
                    maxWidth={maxWidth ? maxWidth.toString() : "none"}
                    id={id}
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    required={required}
                    width="100%"
                />
            ) : type === "state" ? (
                <StateDropDown
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                    disabled={disabled}
                    required={required}
                    maxWidth="none"
                />
            ) : (
                <TextInput
                    maxWidth={maxWidth ? maxWidth.toString() : "none"}
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    required={required}
                />
            )}
        </div>
    );
};

export default FormField;
