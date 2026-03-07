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
        <div className="flex flex-col sm:flex-row mt-2">
            <div className="flex sm:flex-1 sm:mr-[10px] sm:justify-end sm:mt-0">
                {required && <span className="text-red-500">*</span>}
                <label>{text}</label>
            </div>
            {type === "checkbox" ? (
                <div className="sm:flex-[1.75] flex items-center mt-1 sm:mt-0">
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
                    width="100%"
                />
            ) : type === "label" ? (
                <div className="sm:flex-1 flex items-end">
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
