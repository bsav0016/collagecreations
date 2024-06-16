import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import '../CSS/tips.css'
import mediumLogo from '../Assets/medium-logo.png';
import NavBar from './navBar';


function Tips() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(-1);

  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = window.navigator.userAgent;
      const isDesktopDevice = userAgent.match(
        /Windows NT|Macintosh|Linux x86_64|Linux i686/
      );
      setIsDesktop(!!isDesktopDevice);
    };

    checkDeviceType();
  }, []);

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(-1);
    }
    else {
      setOpenDropdown(index);
    }
  };

  const string1 = "1. Ensure you can see good detail in the subjects of your main/large image."
  const string2 = "2. Choose 35-100 small images. Too few and you won't see enough detail and too many will take the server a long time to create the output image."
  const string3 = "3. Ensure there is some darkness variation in your small images. If the images are all light or all dark, you won't see good detail in the main image."
  const string4 = "4. Choose your size before you choose the main image, otherwise you'll have to upload the main image again."

  const textString1 = "1. Choose whether you want the small images to be scaled slightly larger (Step 3) BEFORE uploading any of your small images. Changing that selection will delete all of your small images due to the way they must be stored on the server."
  const textString2 = "2. Understand that the more small images you load, the longer it will take to create the output image, but the better variation you'll get."
  const textString3 = "3. Choosing a word with less characters generally will provide a better overall image."

  return (
    <div>
      <NavBar/>
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            <img src={mediumLogo} alt="Medium Logo" className="medium-logo" style={{ width: '80%' }} onClick={() => navigate('/')} />
          </div>
          <div className="header-center">
            <h1>Helpful Tips</h1>
          </div>
        </header>
        
        {isDesktop ?

        <div style={{ display: 'flex', flexDirection: 'row', padding: 20 }}>
          <div style={{ flex: 1, paddingRight: 10 }}>
            <p style={{ fontSize: 24, ...(isDesktop && { marginTop: -30 }) }}>Image Collage</p>
            <div>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string1}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string2}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string3}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string4}</p>
            </div>
          </div>

          <div style={{ flex: 1, paddingLeft: 10 }}>
            <p style={{ fontSize: 24, ...(isDesktop && { marginTop: -30 }) }}>Text Collage</p>
            <div>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{textString1}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{textString2}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{textString3}</p>
            </div>
          </div>
        </div>

        :
        
        <div className="tips-container">
          <div className="tips-dropdown">
            <span onClick={() => toggleDropdown(0)} style={{ fontSize: 22 }}>
              Image Collage Tips 
              <span className="caret">{openDropdown === 0 ? '▲' : '▼'}</span>
            </span>
            { openDropdown === 0 && 
            <div className="tips-dropdown-content">
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string1}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string2}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string3}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{string4}</p>
            </div>
            }
          </div>

          <div className="tips-dropdown">
            <span onClick={() => toggleDropdown(1)} style={{ fontSize: 22 }}>
              Text Collage Tips 
              <span className="caret">{openDropdown === 1 ? '▲' : '▼'}</span>
            </span>
            { openDropdown === 1 && 
            <div className="tips-dropdown-content">
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{textString1}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{textString2}</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>{textString3}</p>
            </div>
            }
          </div>
        </div>
        }

      </div>
    </div>
  );
}

export default Tips;
