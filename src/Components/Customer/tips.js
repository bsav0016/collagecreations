import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; // Import your CSS file for styling
import mediumLogo from '../Assets/medium-logo.png';
import NavBar from './navBar';


function Tips() {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

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

        <div style={{ display: 'flex', flexDirection: 'row', padding: 20 }}>
          <div style={{ flex: 1, paddingRight: 10 }}>
            <p style={{ fontSize: 24, ...(isDesktop && { marginTop: -30 }) }}>Image Collage</p>
            <div>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>1. Ensure you can see good detail in the subjects of your main/large image.</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>2. Choose 35-100 small images. Too few and you won't see enough detail and too many will take the server a long time to create the output image.</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>3. Ensure there is some darkness variation in your small images. If the images are all light or all dark, you won't see good detail in the main image.</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>4. Choose your size before you choose the main image, otherwise you'll have to upload the main image again.</p>
            </div>
          </div>

          <div style={{ flex: 1, paddingLeft: 10 }}>
            <p style={{ fontSize: 24, ...(isDesktop && { marginTop: -30 }) }}>Text Collage</p>
            <div>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>1. Choose whether you want the small images to be scaled slightly larger (Step 3) BEFORE uploading any of your small images. Changing that selection will delete all of your small images due to the way they must be stored on the server.</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>2. Understand that the more small images you load, the longer it will take to create the output image, but the better variation you'll get.</p>
              <p style={{ fontSize: 18, marginTop: -10, textAlign: 'left' }}>3. Choosing a word with less characters generally will provide a better overall image.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Tips;
