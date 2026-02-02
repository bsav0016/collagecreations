import React from "react";
import TextInput from "../textInput/textInput";
import Checkbox from "../checkbox/checkbox";
import MultilineTextInput from "../multilineTextInput/multilineTextInput";
import StateDropDown from "../stateDropDown";

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
    const fieldFlex = 1.75;
    
    return (
        <div className="flex">
            <div className="flex-1 flex mr-[10px] mt-2 justify-end">
                {required && <span className="text-red-500">*</span>}
                <label>{text}</label>
            </div>
            {type === "checkbox" ? (
                <div className="flex-[1.75] flex items-end">
                    <Checkbox
                        id={id}
                        checked={checked ?? false}
                        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        disabled={disabled}
                        checkboxSize={checkboxSize}
                    />
                </div>
            ) : type === "multilineTextInput" ? (
                <MultilineTextInput
                    maxWidth={maxWidth ? maxWidth.toString() : undefined}
                    id={id}
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    required={required}
                    flex={fieldFlex}
                />
            ) : type === "label" ? (
                <div className="flex-1 flex items-end">
                    <label>{value}</label>
                </div>
            ) : type === "state" ? (
                <StateDropDown
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                    disabled={disabled}
                    required={required}
                    flex={fieldFlex}
                />
            ) : (
                <TextInput
                    maxWidth={maxWidth ? maxWidth.toString() : undefined}
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    required={required}
                    flex={fieldFlex}
                />
            )}
        </div>
    );
};

export default FormField;
