import React from 'react';
import styles from './notFound.module.css';
import bigLogo from '../../assets/big-logo.png';
import GeneralButton from '../../components/generalButton/generalButton';
import { useNavigate } from 'react-router-dom';
import appStyles from '../../App.module.css';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className={appStyles.App}>
            <div className={styles.notFoundPage}>
                <img src={bigLogo} alt="Big Logo" />
                <label className={styles.boldLabel}>Error 404: Page Not Found</label>
                <label className={styles.description}>If you're looking for Collage Creations, please click the below button to be routed to the homepage.</label>
                <GeneralButton
                    onClick={() => {navigate('/')}}
                    text={'Homepage'}
                />
            </div>
        </div>
    );
}

export default NotFound;
