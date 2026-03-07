import React from "react";

interface FormProps {
    onSubmit: () => void;
    children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="flex-col mx-auto w-[90%] max-w-[600px]">
            {children}
        </form>
    );
};

export default Form;
