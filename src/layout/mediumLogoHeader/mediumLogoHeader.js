import { useNavigate } from 'react-router-dom';
import mediumLogo from '../../assets/medium-logo.png';
import styles from './mediumLogoHeader.module.css';

function MediumLogoHeader({ title }) {
    const navigate = useNavigate();
    return (
        <div>
            <header className={styles.mediumLogoHeader}>
                <div className={styles.headerLeft}>
                    <img
                        src={mediumLogo} 
                        alt="Medium Logo" 
                        className={styles.mediumLogo} 
                        onClick={() => navigate('/')} 
                    />
                </div>
                <div className={styles.headerCenter}>
                    <h1>{title}</h1>
                </div>
            </header>
        </div>
    )
}

export default MediumLogoHeader;