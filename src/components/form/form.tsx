import React from "react";

interface FormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
    return (
        <form onSubmit={onSubmit} className="flex-col mx-auto w-[90%] max-w-[600px]">
            {children}
        </form>
    );
};

export default Form;
