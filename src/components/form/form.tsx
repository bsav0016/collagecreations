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
        <form
            onSubmit={handleSubmit}
            className="mx-4 sm:mx-auto sm:w-full max-w-lg flex flex-col gap-5 text-left rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm"
        >
            {children}
        </form>
    );
};

export default Form;
