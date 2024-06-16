import '../../App.css';
import bigLogo from '../Assets/big-logo.png';
import bothCollages from '../Assets/bothCollages.png'
import collage1 from '../Assets/collage1.png'
import collage2 from '../Assets/collage2.png'
import NavBar from './navBar';
import { useState, useEffect } from 'react';

function Home() {
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
        <header>
          <img src={bigLogo} alt="Big Logo" className="big-logo" style={{ ...(isDesktop ? {width: '20%'} : {width: '50%'}), ...(!isDesktop && {width: '80%'}) }}/>
          <h1 style={{ marginTop: -10 }}>Welcome!</h1>
          <p>Collage Creations is a small business that provides unique image collages. You can build a collage of images that can look like a larger image or word! Please stop by the "Helpful Tips" page before you begin creating your collage.</p>
        </header>

        {isDesktop ?
        <div style={{ justifyContent: 'center' }}>
          <img src={bothCollages} alt="Collages" className="big-logo" style={{ width: '60%'}}/>
        </div> :
        <div>
          <img src={collage1} alt="Collages" className="big-logo" style={{ width: '80%', marginBottom: 20 }}/>
          <img src={collage2} alt="Collages" className="big-logo" style={{ width: '80%'}}/>
        </div>
        }
      </div>
    </div>
  );
}

export default Home;
