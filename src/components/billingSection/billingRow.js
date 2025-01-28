import React, { useEffect, useRef, useState } from "react";
import styles from './billingSection.module.css';

const BillingRow = ({ text1, text2, lastCharge = false }) => {
    const text2Ref = useRef(null);
    const [underlineWidth, setUnderlineWidth] = useState(0);

    useEffect(() => {
        if (text2Ref.current) {
            setUnderlineWidth(text2Ref.current.offsetWidth + 8);
        }
    }, []);

    return (
        <div className={styles.billingRow}>
            <div className={styles.leftBillingRow}>
                {text1}: 
            </div>
            <div className={styles.rightBillingRow}>
                <strong ref={text2Ref}>{text2}</strong>
                {lastCharge && (
                    <div
                        className={styles.underline}
                        style={{ width: `${underlineWidth}px` }}
                    ></div>
                )}
            </div>
        </div>
    )
}

export default BillingRow;
