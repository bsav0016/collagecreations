import React, { useState, useEffect } from 'react';
import styles from './preview.module.css';
import appStyles from '../../../App.module.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../layout/navBars/navBar';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../../components/generalButton/generalButton';
import { IS_DESKTOP, MARGINS } from '../../../utils/constants/constants';
import { useConstants } from '../../../context/constantsContext';
import QuantitySelection from '../../../components/quantitySelection';
import { processImageString } from '../../../utils/modifyImage';
import { toastRef } from '../../../context/toastContext/toastContext'; 
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { useOrderContext } from '../../../context/orderContext';


function Preview() {
  const [collageImage, setCollageImage] = useState(null);
  const [zoomScale, setZoomScale] = useState('1');
  const [chosenZoom, setChosenZoom] = useState('1');

  const navigate = useNavigate();
  const { constants } = useConstants();
  const { watermarkCollage, baseCost, quantity, setQuantity } = useOrderContext();

  useEffect(() => {
    let imageURL;
    const fetchData = async () => {
      try {
        const blob = await processImageString(watermarkCollage);
        imageURL = URL.createObjectURL(blob);
        setCollageImage(imageURL);
        window.scrollTo(0, 0);
      } catch (error) {
        navigate('/');
        imageURL = null;
      }
    };
  
    fetchData();
  
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [navigate, watermarkCollage, baseCost]);
  
  function navigateToOrder() {
    navigate('/order/');
  }

  function navigateToDownload() {
    navigate('/download/');
  }

  const handleMouseMove = (e) => {
    setZoomScale(chosenZoom);
    const image = e.currentTarget;
    const offsetX = e.nativeEvent.offsetX / image.offsetWidth;
    const offsetY = e.nativeEvent.offsetY / image.offsetHeight;
    image.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
  };

  const handleMouseLeave = (e) => {
    const image = e.currentTarget;
    image.style.transformOrigin = '50% 50%';
    setZoomScale('1');
  };

  const handleZoomScaleChange = (e) => {
    setChosenZoom(e.target.value);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 30) {
      setQuantity(newQuantity);
    }
    else {
      toastRef.current("Quantity must be between 1 and 30");
    }
  }

  return (
    <div>
    { (constants.AMOUNT_DOWNLOAD === null) ?
    <LoadingScreen/>
    :
    <div>
      <NavBar/>
      <div className={appStyles.App}>
        <MediumLogoHeader title={"Collage Preview"} />

        <div>
          <p style={{ marginTop: MARGINS.LARGE, marginBottom: MARGINS.VERY_SMALL}}>Quantity: </p>
          <QuantitySelection quantity={quantity} handleQuantityChange={handleQuantityChange} />
        </div>

        <GeneralButton
          onClick={navigateToDownload}
          text={<>Download ${parseFloat(constants.AMOUNT_DOWNLOAD / 100)}</>} 
        />

        { constants.PRINT_AVAILABLE_MESSAGE === 'AVAILABLE' ?
        <GeneralButton
          onClick={navigateToOrder}
          text={<>Place Order ${(parseFloat(baseCost / 100) * quantity).toFixed(2)}</>} 
        />
        :
        <p>{constants.PRINT_AVAILABLE_MESSAGE}</p>
        }

        <div>
          { IS_DESKTOP && 
          <div className={styles.zoomSelectionContainer}>
            <p>Move your cursor over the image to zoom in. Zoom scale: </p>
            <select
              value={chosenZoom}
              onChange={handleZoomScaleChange} 
            >
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="4">4x</option>
              <option value="6">6x</option>
            </select>
          </div>
          }

          <div className={styles.imageZoomContainer}>
            <img src={collageImage} 
              alt="Collage" 
              className="large-image" 
              style={{ transform: `scale(${zoomScale})`, width: '100%' }} 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave} />
          </div>
        </div>
      </div>
    </div>
    }
    </div>
  );
}

export default Preview;
