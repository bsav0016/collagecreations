import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mediumLogo from "../../assets/MosaicMakerNoText.png";

interface MediumLogoHeaderProps {
    title: string;
}

function MediumLogoHeader({ title }: MediumLogoHeaderProps) {
    const navigate = useNavigate();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 728);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 728);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div>
            <header className="text-[calc(10px+2vmin)] flex items-center justify-center">
                <div className="flex relative left-0 w-[16%]">
                    {isDesktop && (
                        <img
                            src={mediumLogo}
                            alt="Medium Logo"
                            className="w-[90%] flex cursor-pointer"
                            onClick={() => navigate("/")}
                        />
                    )}
                </div>
                <div className="relative flex justify-center w-[84%] -translate-x-[10%]">
                    <h1>{title}</h1>
                </div>
            </header>
        </div>
    );
}

export default MediumLogoHeader;
