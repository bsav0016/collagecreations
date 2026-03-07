import React, { useEffect, useRef, useState } from "react";

interface BillingRowProps {
    text1: string;
    text2: string;
    lastCharge?: boolean;
}

const BillingRow: React.FC<BillingRowProps> = ({ text1, text2, lastCharge = false }) => {
    const text2Ref = useRef<HTMLElement>(null);
    const [underlineWidth, setUnderlineWidth] = useState(0);

    useEffect(() => {
        if (text2Ref.current) {
            setUnderlineWidth(text2Ref.current.offsetWidth + 8);
        }
    }, []);

    return (
        <div className="flex flex-row m-0">
            <div className="flex-[11] text-right mr-[5px]">
                {text1}: 
            </div>
            <div className="flex-[10] text-left">
                <strong ref={text2Ref}>{text2}</strong>
                {lastCharge && (
                    <div
                        className="mt-1 border-b-[3px] border-black"
                        style={{ width: `${underlineWidth}px` }}
                    />
                )}
            </div>
        </div>
    );
};

export default BillingRow;
