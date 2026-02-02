import React, { useState } from "react";
import BasicButton from "./basicButton/basicButton";

interface QuantitySelectionProps {
    quantity: number;
    handleQuantityChange: (quantity: number) => void;
}

const QuantitySelection: React.FC<QuantitySelectionProps> = ({
    quantity,
    handleQuantityChange,
}) => {
    const [tempQuantity, setTempQuantity] = useState<number | string>(quantity);

    const handleBlur = () => {
        if (tempQuantity === "" || isNaN(Number(tempQuantity))) {
            setTempQuantity(quantity);
        } else {
            handleQuantityChange(Number(tempQuantity));
        }
    };

    const changeQuantity = (newQuantity: number) => {
        setTempQuantity(newQuantity);
        handleQuantityChange(newQuantity);
    };

    return (
        <div className="flex flex-row w-fit justify-self-center items-center">
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
                onBlur={handleBlur}
                className="w-10 text-center"
            />
            <BasicButton
                onClick={() => changeQuantity(quantity + 1)}
                disabled={quantity >= 30}
                text="+"
            />
        </div>
    );
};

export default QuantitySelection;
