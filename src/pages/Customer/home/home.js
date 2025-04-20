import bigLogo from '../../../assets/big-logo.png';
import imageCollage from '../../../assets/exampleImageCollage.png';
import textCollage from '../../../assets/exampleTextCollage.png';
import symbolCollage from '../../../assets/exampleSymbolCollage.png';
import NavBar from '../../../layout/navBars/navBar';
import styles from './home.module.css';
import appStyles from '../../../App.module.css';
import { IS_DESKTOP } from '../../../utils/constants/constants';
import HeaderSection from '../../../components/headerSection';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const [logoClicked, setLogoClicked] = useState(0);
  const navigate = useNavigate();

  const updateClicked = () => {
    if (logoClicked >= 4) {
      navigate('/admin/login');
    }
    setLogoClicked(prev => prev + 1);
  }

  const imagesToDisplay = [
    symbolCollage,
    textCollage,
    imageCollage
  ]

  return (
    <div>
      <NavBar/>
      <div className={appStyles.App}>
        <button onClick={updateClicked} className={styles.bigLogo}>
          <img src={bigLogo} alt="Big Logo" />
        </button>
          
        <HeaderSection
          title="Welcome!"
          fontSize={26}
          fontWeight='bold'
        >
          <p style={{ margin: 0 }}>Build a collage of images to resemble a larger image, word, or symbol!</p>
          <p style={{ margin: 0 }}>Please stop by the "Helpful Tips" page before building your collage.</p>
        </HeaderSection>

        <div 
          className={styles.collageImages}>
          {imagesToDisplay.map((image, index) => (
            <div style={{ flex: 1, margin: 30 }} key={index}>
              <img
                src={image}
                style={{ width: '100%' }}
              />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Home;
