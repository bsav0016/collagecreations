import React from "react";

interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    checkboxSize?: number;
    marginLeft?: number;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
    id, 
    checked, 
    onChange, 
    disabled, 
    checkboxSize = 16, 
    marginLeft = 0 
}) => {
    return (
        <div>
            <input
                style={{ 
                    width: checkboxSize, 
                    height: checkboxSize, 
                    marginLeft: marginLeft 
                }}
                className="float-left"
                checked={checked}
                type="checkbox"
                id={id}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
};

export default Checkbox;
