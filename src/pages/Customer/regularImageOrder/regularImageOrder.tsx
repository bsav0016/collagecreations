import React, { useState, useEffect } from 'react';
import { useConstants } from '../../../context/constantsContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../layout/navBars/navBar';
import { rotateImage } from '../../../utils/modifyImage';
import MediumLogoHeader from '../../../layout/mediumLogoHeader/mediumLogoHeader';
import usePreventScroll from '../../../hooks/preventScroll';
import LoadingDots from '../../../components/loadingDots';
import GeneralButton from '../../../components/generalButton/generalButton';
import HeaderSection from '../../../components/headerSection';
import Checkbox from '../../../components/checkbox/checkbox';
import ImageUpload from '../../../components/imageUpload/imageUpload';
import CustomCropper from '../../../components/customCropper/customCropper';
import { MARGINS } from '../../../utils/constants/constants';
import { createTempImage, processImageString, cropAndResizeLarge } from "../../../utils/modifyImage";
import CropperButton from '../../../components/cropperButton/cropperButton';
import QuantitySelection from '../../../components/quantitySelection';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { toastRef } from '../../../context/toastContext/toastContext';
import { CropCoordinate } from '../collageCreationPage/interfaces/CropCoordinate';
import { CropArea } from '../collageCreationPage/interfaces/CropArea';
import { OutputSize } from '../collageCreationPage/enums/OutputSize';
import { useOrderContext } from '../../../context/orderContext';


const RegularImageOrder: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [chooseCrop, setChooseCrop] = useState<boolean>(false);
  const [crop, setCrop] = useState<CropCoordinate>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [cropperVisible, setCropperVisible] = useState<boolean>(false);
  const [size, setSize] = useState<OutputSize>(OutputSize.x12x12);
  const [aspect, setAspect] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [cost, setCost] = useState<number>(0);
  const [tempImageId, setTempImageId] = useState<number>(-1);
  const [tempQuantity, setTempQuantity] = useState<number>(1);

  const { constants } = useConstants();
  const { setTemporaryImageId, setQuantity } = useOrderContext();
  const navigate = useNavigate();
  usePreventScroll(cropperVisible);

  useEffect(() => {
    const [width, height] = size.split('x').map(Number);
    setAspect(width / height);
    const newCost = size === OutputSize.x12x12 ? (constants?.AMOUNT_12_12_REGULAR || 9999)
      : (size === OutputSize.x12x18 || size === OutputSize.x18x12) ? (constants?.AMOUNT_12_18_REGULAR || 9999)
      : size === OutputSize.x24x24 ? (constants?.AMOUNT_24_24_REGULAR || 9999)
      : (constants?.AMOUNT_24_36_REGULAR || 9999)
    setCost(newCost);
  }, [size, constants]);

  const changeChooseCrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChooseCrop(e.target.checked)
  }

  const doHandleMainImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {      
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    if (chooseCrop) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCropperVisible(true);
    } else {
      setLoading(true);
      const [widthInches, heightInches] = size.split('x').map(Number);
      
      try {
        const response = await createTempImage(file, widthInches, heightInches);
        setTempImageId(response.temporary_image_id);
        let smallerImage = await processImageString(response.smaller_image);
        setMainImage(URL.createObjectURL(smallerImage));
      } catch {
        toastRef.current?.("Could not resize your image");
      } finally {
        setLoading(false);
      }
    }
  };

  const doHandleCrop = async () => {
    setLoading(true);
    try {
      if (!selectedImage || !croppedAreaPixels || !size) return;

      const [widthInches, heightInches] = size.split('x').map(Number);
      const response = await cropAndResizeLarge(selectedImage, croppedAreaPixels, widthInches, heightInches);

      setTempImageId(response.temporary_image_id);
      const smallerImage = await processImageString(response.smaller_image);
      setMainImage(URL.createObjectURL(smallerImage));
    } catch (error) {
      console.error('Error cropping image:', error);
      toastRef.current?.("Error resizing.");
    } finally {
      setCropperVisible(false);
      setLoading(false);
    }
  };

  const navigateToOrder = () => {
    if (!mainImage) {
      toastRef.current?.('You must select an image');
      return;
    }
    setTemporaryImageId(tempImageId);
    setQuantity(tempQuantity);
    navigate('/order/');
  };

  const handleCancelCrop = () => {
    setCropperVisible(false);
    setSelectedImage(null);
    setCroppedAreaPixels(null);
  };

  const doRotateImage = async () => {
    setLoading(true);
    if (!selectedImage) return;
    
    const newURL = await rotateImage(selectedImage);
    setSelectedImage(newURL);
    setLoading(false);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 30) {
      setTempQuantity(newQuantity);
    } else {
      toastRef.current?.("Quantity must be between 1 and 30");
    }
  };

  const updateSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(event.target.value as OutputSize);
    setMainImage(null);
  }

  return (
    <div>
      <NavBar />
      {loading ? (
        <LoadingScreen message="Processing image..." />
      ) : constants?.PRINT_AVAILABLE_MESSAGE === 'AVAILABLE' ? (
        <div className="text-center py-5 gap-10 flex flex-col items-center">
          <MediumLogoHeader title="Large Format" />

          <HeaderSection title="Step 1. Choose an output size in inches - width x height.">
            <div className="flex flex-col items-center gap-2">
              {/* Make the parent relative for the arrow */}
              <div className="relative inline-block min-w-[50px] w-auto">
                <select
                  value={size}
                  onChange={updateSize}
                  disabled={loading}
                  className={`
                    appearance-none
                    bg-transparent
                    text-primary
                    border
                    border-current
                    rounded-md
                    py-2.5
                    pl-3
                    pr-8
                    text-base
                    cursor-pointer
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/40
                    transition-colors
                    duration-200
                    w-full
                  `}
                >
                  {Object.values(OutputSize).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Arrow */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                  ▼
                </span>
              </div>

              <span className="text-base">{`Cost: ${cost / 100} (not including shipping and tax)`}</span>
            </div>
          </HeaderSection>



          <HeaderSection title="Step 2. Select if you'd like to crop the image, otherwise it will be automatically adjusted to fit the aspect ratio" marginTop={MARGINS.LARGE}>
            <div className="flex justify-center items-center gap-2">
              <Checkbox id="chooseCrop" checked={chooseCrop} onChange={changeChooseCrop} disabled={loading} />
              <p className="text-foreground">Crop Image</p>
            </div>
          </HeaderSection>

          <HeaderSection title="Step 3. Select which image you'd like to print." marginTop={MARGINS.LARGE}>
            <ImageUpload id="main-image-upload" title={loading ? 'Loading...' : 'Choose Image'} onChange={doHandleMainImageChange} disabled={loading} />
          </HeaderSection>

          {mainImage &&
            <div className="flex justify-center w-full">
              <img src={mainImage} alt="Image" className={aspect > 1 ? 'w-1/2' : 'w-1/4'} style={{ aspectRatio: aspect }} />
            </div>
          }

          {selectedImage && cropperVisible && (
            <CustomCropper selectedImage={selectedImage} crop={crop} setCrop={setCrop} zoom={zoom} setZoom={setZoom} setCropArea={setCroppedAreaPixels} aspect={aspect}>
              <div className="flex flex-wrap justify-between w-full">
                <CropperButton onClick={handleCancelCrop} disabled={loading} text="Cancel" />
                <div className="flex flex-wrap">
                  <CropperButton onClick={doRotateImage} disabled={loading} text="Rotate Image" />
                  <CropperButton onClick={doHandleCrop} disabled={loading} text="Finish" variant="primary" />
                </div>
              </div>
            </CustomCropper>
          )}

          <HeaderSection title="Step 4. Select the quantity." marginTop={MARGINS.LARGE}>
            <QuantitySelection quantity={tempQuantity} handleQuantityChange={handleQuantityChange} />
          </HeaderSection>

          <GeneralButton onClick={navigateToOrder} disabled={loading} text={loading ? <>Loading<LoadingDots /></> : 'Order'} />
        </div>
      ) : (
        <HeaderSection title={constants?.PRINT_AVAILABLE_MESSAGE} marginTop={MARGINS.LARGE} />
      )}
    </div>
  );
};

export default RegularImageOrder;
