import React from "react";

interface BillingSectionProps {
    children: React.ReactNode;
}

const BillingSection: React.FC<BillingSectionProps> = ({ children }) => {
    return (
        <div className="flex flex-col m-0">
            {children}
        </div>
    );
};

export default BillingSection;
