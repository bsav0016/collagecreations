import React, { useState, useEffect, ChangeEvent } from 'react';
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
import AdminNavBar from '../../../layout/navBars/adminNavBar';

interface PreviewProps {
  isAdmin?: boolean;
}

function Preview({ isAdmin = false }: PreviewProps): React.ReactElement {
  const [collageImage, setCollageImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<string>('1');
  const [chosenZoom, setChosenZoom] = useState<string>('1');

  const navigate = useNavigate();
  const { constants } = useConstants();
  const { watermarkCollage, baseCost, quantity, setQuantity } = useOrderContext();

  useEffect(() => {
    let imageURL: string | null;
    const fetchData = async (): Promise<void> => {
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
  
  function navigateToOrder(): void {
    navigate('/order/');
  }

  function navigateToDownload(): void {
    navigate('/download/');
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>): void => {
    setZoomScale(chosenZoom);
    const image = e.currentTarget;
    const offsetX = e.nativeEvent.offsetX / image.offsetWidth;
    const offsetY = e.nativeEvent.offsetY / image.offsetHeight;
    image.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>): void => {
    const image = e.currentTarget;
    image.style.transformOrigin = '50% 50%';
    setZoomScale('1');
  };

  const handleZoomScaleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setChosenZoom(e.target.value);
  };

  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity >= 1 && newQuantity <= 30) {
      setQuantity(newQuantity);
    } else {
      toastRef.current?.("Quantity must be between 1 and 30");
    }
  };

  return (
    <div>
      {constants?.AMOUNT_DOWNLOAD === null ? (
        <LoadingScreen />
      ) : (
        <div>
          {isAdmin ? <AdminNavBar /> : <NavBar />}
          <div className="text-center py-5">
            <MediumLogoHeader title={"Collage Preview"} />

            {!isAdmin && (
              <>
                <div>
                  <p style={{ marginTop: MARGINS.LARGE, marginBottom: MARGINS.VERY_SMALL }}>Quantity: </p>
                  <QuantitySelection quantity={quantity} handleQuantityChange={handleQuantityChange} />
                </div>

                <GeneralButton
                  onClick={navigateToDownload}
                  text={<>Download ${parseFloat(String(constants?.AMOUNT_DOWNLOAD ?? 0)) / 100}</>} 
                />

                {constants?.PRINT_AVAILABLE_MESSAGE === 'AVAILABLE' ? (
                  <GeneralButton
                    onClick={navigateToOrder}
                    text={<>Place Order ${(parseFloat(String(baseCost / 100)) * quantity).toFixed(2)}</>} 
                  />
                ) : (
                  <p>{constants?.PRINT_AVAILABLE_MESSAGE}</p>
                )}
              </>
            )}

            <div>
              {IS_DESKTOP && (
                <div className="justify-center">
                  <p className="mt-2.5 mb-[3px]">Move your cursor over the image to zoom in. Zoom scale: </p>
                  <select
                    value={chosenZoom}
                    onChange={handleZoomScaleChange}
                    className="inline-block w-auto mb-2.5"
                  >
                    <option value="1">1x</option>
                    <option value="2">2x</option>
                    <option value="4">4x</option>
                    <option value="6">6x</option>
                  </select>
                </div>
              )}

              <div className="w-[40%] justify-self-center">
                <img 
                  src={collageImage || ''} 
                  alt="Collage" 
                  className="large-image" 
                  style={{ transform: `scale(${zoomScale})`, width: '100%' }} 
                  onMouseMove={handleMouseMove} 
                  onMouseLeave={handleMouseLeave} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;
