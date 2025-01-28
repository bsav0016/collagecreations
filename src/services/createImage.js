import CollageDTO from '../dtos/collageDTO/collageDTO';
import NetworkRequest from '../lib/networkClient';
import { POST } from '../lib/networkRequestConstants';
import ReceivedCollageDTO from '../dtos/collageDTO/collageResponseDTO';
import validateRequest from '../pages/Customer/collageCreation/utils/validateRequest';
import { toastRef } from '../context/toastContext/toastContext';

const createImage = async (
  size, 
  type, 
  text, 
  mainImage, 
  croppedImages, 
  largerImages, 
  color, 
  navigate, 
  setIsCreatingImage
) => {
  const errorMessage = validateRequest(size, type, text, mainImage, croppedImages); //TODO: This needs to be moved back to the class createimage gets called from
  if (errorMessage !== '') {
    toastRef.current(errorMessage);
    return;
  }

  setIsCreatingImage(true);

  try {
    const collageDTO = new CollageDTO(size, type, text, mainImage, croppedImages, largerImages, color);
    const collageFormData = await collageDTO.toFormData();

    const data = await NetworkRequest({
      urlExtension: 'api/collage/',
      method: POST,
      body: collageFormData
    });

    const collageData = ReceivedCollageDTO.fromResponse(data);
    navigate('/preview/', {
      state: { tempImageId: collageData.temporaryImageId, watermark_output: collageData.watermarkCollage, baseCost: collageData.baseCost }
    });
  } catch (error) {
    console.error('Error creating collage:', error);
  } finally {
    setIsCreatingImage(false);
  }
};

export default createImage;