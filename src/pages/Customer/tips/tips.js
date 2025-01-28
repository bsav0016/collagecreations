import React, { useState } from 'react';
import styles from './tips.module.css';
import { IS_DESKTOP } from '../../../utils/constants/constants';
import NavBar from '../../../layout/navBars/navBar';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import ImageCollageTips from './components/imageCollageTips';
import TextCollageTips from './components/textCollageTips';
import appStyles from '../../../App.module.css';

function Tips() {
  const [openDropdown, setOpenDropdown] = useState(-1);

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(-1);
    }
    else {
      setOpenDropdown(index);
    }
  };

  return (
    <div>
      <NavBar/>
      <div className={appStyles.App}>
        <MediumLogoHeader title={"Helpful Tips"}/>
        
        {IS_DESKTOP ?

        <div className={styles.tipsSetup}>
          <div className={styles.tipsContainer}>
            <p className={styles.tipsHeader}>Image Collage</p>
            <ImageCollageTips />
          </div>

          <div className={styles.tipsContainer}>
            <p className={styles.tipsHeader}>Text Collage</p>
            <TextCollageTips />
          </div>
        </div>

        :
        
        <div className={styles.tipsContainer}>
          <div className={styles.tipsDropdown}>
            <span onClick={() => toggleDropdown(0)} style={{ fontSize: 22 }}>
              Image Collage Tips 
              <span className="caret">{openDropdown === 0 ? '▲' : '▼'}</span>
            </span>
            { openDropdown === 0 && 
            <ImageCollageTips />
            }
          </div>

          <div className={styles.tipsDropdown}>
            <span onClick={() => toggleDropdown(1)} style={{ fontSize: 22 }}>
              Text Collage Tips 
              <span className="caret">{openDropdown === 1 ? '▲' : '▼'}</span>
            </span>
            { openDropdown === 1 && 
            <TextCollageTips />
            }
          </div>
        </div>
        }

      </div>
    </div>
  );
}

export default Tips;
