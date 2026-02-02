import React, { useState, useEffect } from "react";

interface LoadingDotsProps {
    interval?: number;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ interval = 500 }) => {
    const [loadingDots, setLoadingDots] = useState("");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoadingDots((prevDots) => {
                if (prevDots === "...") {
                    return "";
                } else {
                    return prevDots + ".";
                }
            });
        }, interval);

        return () => clearInterval(intervalId);
    }, [interval]);

    return <span>{loadingDots}</span>;
};

export default LoadingDots;
