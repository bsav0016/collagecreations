import React, { useState } from "react";
import BasicButton from "./basicButton/basicButton";


const QuantitySelection = ({ quantity, handleQuantityChange }) => {
    const [tempQuantity, setTempQuantity] = useState(quantity);

    const handleBlur = () => {
        if (tempQuantity === "" || isNaN(tempQuantity)) {
            setTempQuantity(quantity);
        } else {
            handleQuantityChange(tempQuantity);
        }
    };

    const changeQuantity = (newQuantity) => {
        setTempQuantity(newQuantity);
        handleQuantityChange(newQuantity);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: 'fit-content', justifySelf: 'center', alignItems: 'center' }}>
            <BasicButton
                onClick={() => changeQuantity(quantity - 1)} 
                disabled={quantity <= 1}
                text="-"
            />
            <input 
                type="text" 
                value={tempQuantity} 
                onChange={(e) => {
                    const value = e.target.value;
                    setTempQuantity(value === "" ? "" : parseInt(value, 10) || "");
                }} 
                onBlur={ handleBlur }
                style={{ width: '40px', textAlign: 'center' }}
            />
            <BasicButton
                onClick={() => changeQuantity(quantity + 1)} 
                disabled={quantity >= 30}
                text="+"
            />
        </div>
    )
}

export default QuantitySelection;