import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import mediumLogo from '../../assets/medium-logo.png';
import styles from './mediumLogoHeader.module.css';

function MediumLogoHeader({ title }) {
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
            <header className={styles.mediumLogoHeader}>
                <div className={styles.headerLeft}>
                    {isDesktop && (
                        <img
                            src={mediumLogo}
                            alt="Medium Logo"
                            className={styles.mediumLogo}
                            onClick={() => navigate("/")}
                        />
                    )}
                </div>
                <div className={styles.headerCenter}>
                    <h1>{title}</h1>
                </div>
            </header>
        </div>
    )
}

export default MediumLogoHeader;