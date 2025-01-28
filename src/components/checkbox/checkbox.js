import React from "react";

const Checkbox = ({ id, checked, onChange, disabled, checkboxSize = 16, marginLeft = 0 }) => {
    return (
        <div>
            <input
                style={{ width: checkboxSize, height: checkboxSize, float: 'left', marginLeft: marginLeft }} 
                checked={checked}
                type="checkbox" 
                id={id}
                onChange={onChange} 
                disabled={disabled}
            />
        </div>
    )
}

export default Checkbox;