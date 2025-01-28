import React from 'react';
import styles from './loadingScreen.module.css';

interface LoadingScreenProps {
  message?: string | null;
}

function LoadingScreen({ message=null }: LoadingScreenProps) {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.spinner}></div>
      {message && <p className={styles.loadingMessage}>{message}</p>}
    </div>
  );
};

export default LoadingScreen;
