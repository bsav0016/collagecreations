import React, { useState, useEffect } from 'react';
import { useConstants } from '../../context/constantsContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../layout/navBars/navBar';
import { rotateImage } from '../../utils/modifyImage';
import MediumLogoHeader from '../../layout/mediumLogoHeader/mediumLogoHeader';
import usePreventScroll from '../../hooks/preventScroll';
import LoadingDots from '../../components/loadingDots';
import GeneralButton from '../../components/generalButton/generalButton';
import HeaderSection from '../../components/headerSection';
import SizeSelector from '../../components/sizeSelector/sizeSelector';
import Checkbox from '../../components/checkbox/checkbox';
import ImageUpload from '../../components/imageUpload/imageUpload';
import CustomCropper from '../../components/customCropper/customCropper';
import { MARGINS } from '../../utils/constants/constants';
import { createTempImage, processImageString, cropAndResizeLarge } from "../../utils/modifyImage";
import CropperButton from '../../components/cropperButton/cropperButton';
import QuantitySelection from '../../components/quantitySelection';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import { toastRef } from '../../context/toastContext/toastContext';
import appStyles from '../../App.module.css';


function RegularImageOrder() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [chooseCrop, setChooseCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [size, setSize] = useState('');
  const [aspect, setAspect] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(0);
  const [tempImageId, setTempImageId] = useState(-1)
  const [quantity, setQuantity] = useState(1);

  const { constants } = useConstants();
  const navigate = useNavigate();
  usePreventScroll(cropperVisible);

  useEffect(() => {
    if (size) {
      const [width, height] = size.split('x').map(Number);
      setAspect(width / height);
      if (size ==='24x24') {
        setCost(constants.AMOUNT_24_24_REGULAR)
      }
      else if (size === '24x36' || size === '36x24') {
        setCost(constants.AMOUNT_24_36_REGULAR)
      }
    }
  }, [size, constants]);

  const doHandleMainImageChange = async (event) => {
    if (size === '') {
      toastRef.current('You must choose a size before selecting the main image.');
      return;
    }
      
    const file = event.target.files[0];
    event.target.value = null;
    if (chooseCrop) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCropperVisible(true);
    } 
    else {
      setLoading(true);
      const [widthInches, heightInches] = size.split('x').map(Number);      
      try {
        const response = await createTempImage(file, widthInches, heightInches);
        setTempImageId(response.temporary_image_id);
        let smallerImage = await processImageString(response.smaller_image);
        setMainImage(URL.createObjectURL(smallerImage));
      } catch {
        toastRef.current("Could not resize your image");
      } finally {
        setLoading(false);
      }
    }
  };

  const doHandleCrop = async () => {
    setLoading(true);

    try {
      const [widthInches, heightInches] = size.split('x').map(Number);
      //TODO: Need to use DTO here
      const response = await cropAndResizeLarge(selectedImage, croppedAreaPixels, widthInches, heightInches);

      setTempImageId(response.temporary_image_id);
      const smallerImage = await processImageString(response.smaller_image);
      const imageUrl = URL.createObjectURL(smallerImage);
      setMainImage(imageUrl);
    } catch (error) {
      console.error('Error cropping image:', error);
      toastRef.current("Error resizing.");
    } finally {
      setCropperVisible(false);
      setLoading(false);
    }
  }

  function navigateToOrder() {
    if (mainImage === null) {
      toastRef.current('You must select an image');
      return;
    }
    navigate('/order/', {
      state: { quantity: quantity, tempImageId: tempImageId }
    });
  }

  const handleCancelCrop = () => {
    setCropperVisible(false);
    setSelectedImage(null);
    setCroppedAreaPixels(null);
  };

  const doRotateImage = async () => {
    setLoading(true);
    const newURL = await rotateImage(selectedImage);
    setSelectedImage(newURL);
    setLoading(false);
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 30) {
      setQuantity(newQuantity);
    }
    else {
      toastRef.current("Quantity must be between 1 and 30");
    }
  };

  //TODO: See how we can clean this up
  return (
    <div>
      <NavBar />
      {loading ?
      <LoadingScreen />
      :
      constants.PRINT_AVAILABLE_MESSAGE === 'AVAILABLE'
      ?
      <div className={appStyles.App}>
        <MediumLogoHeader title={"Large Format"}/>

        <HeaderSection title="Step 1. Choose an output size in inches - width x height.">
          <SizeSelector size={size} setSize={setSize}/>
        </HeaderSection>

        <HeaderSection 
          title={`Cost: ${cost/100} (not including shipping and tax)`} 
          fontSize={14}
        />

        <HeaderSection
          title="Step 2. By default your image will be scaled to fit the dimensions. Select this box if you'd like to crop it instead."
          marginTop={MARGINS.LARGE}
        >
          <HeaderSection
            title="**If you believe your image is already properly sized, leave this box unchecked**"
            fontSize={14}
          />
          <div className='row-display'>
            <p>Crop Image</p>
            <Checkbox
              id="chooseCrop"
              checked={chooseCrop}
              onChange={(e) => setChooseCrop(e.target.checked)}
              disabled={loading}
              marginLeft={5}
            />
          </div>
        </HeaderSection>

        <HeaderSection
          title="Step 3. Select which image you'd like to print."
          marginTop={MARGINS.LARGE}
        >
          <HeaderSection
            title={`**It may take 5-10 seconds for the server to resize your image to be ${constants.PPI} pixels per inch.**`}
            fontSize={14}
          />
          <ImageUpload
            id="main-image-upload"
            title={loading ? <>Loading<LoadingDots/></> : 'Choose Image'}
            onChange={doHandleMainImageChange}
            disabled={loading}
          />
        </HeaderSection>

        {mainImage && (
          <div style={{ marginBottom: 10}}>
            <img src={mainImage} alt="Image" className="main-image" />
          </div>
        )}

        {selectedImage && cropperVisible && (
          <CustomCropper
            selectedImage={selectedImage}
            crop={crop}
            setCrop={setCrop}
            zoom={zoom}
            setZoom={setZoom}
            setCropArea={setCroppedAreaPixels}
            aspect={aspect}
          >
            <CropperButton
              onClick={doHandleCrop}
              disabled={loading}
              text={'Crop Image'}
            />
            <CropperButton
              onClick={doRotateImage}
              disabled={loading}
              text={'Rotate Image'}
            />
            <CropperButton
              onClick={handleCancelCrop}
              disabled={loading}
              text={'Cancel'}
            />
          </CustomCropper>
        )}

        <HeaderSection
          title="Step 4. Select the quantity you want printed."
          marginTop={MARGINS.LARGE}
        >
          <QuantitySelection quantity={quantity} handleQuantityChange={handleQuantityChange} />
        </HeaderSection>

        <GeneralButton
          onClick={navigateToOrder}
          disabled={loading}
          text={loading ? <>Loading<LoadingDots/></> : 'Order'}
        />
      </div>
      :
      <div className={appStyles.App}>
        <MediumLogoHeader title={"Large Format"}/>
        <HeaderSection
          title={constants.PRINT_AVAILABLE_MESSAGE}
          marginTop={MARGINS.LARGE}
        ></HeaderSection>
      </div>
      }
    </div>
  );
}

export default RegularImageOrder;
