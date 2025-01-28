import React from "react";
import styles from './billingSection.module.css';

const BillingSection = ({ children }) => {
    return (
        <div className={styles.billingSection}>
            {children}
        </div>
    )
}

export default BillingSection;