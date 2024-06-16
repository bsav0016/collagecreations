import React, { useState, useEffect } from 'react';
import '../../App.css';
import '../CSS/collageCreation.css'
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { backendURL, amount24x24, amount24x36 } from '../../Constants';
import { useNavigate } from 'react-router-dom';
import mediumLogo from '../Assets/medium-logo.png';
import NavBar from './navBar';


function CollageTextCreation() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState('');
  const [croppedImages, setCroppedImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropperVisible, setCropperVisible] = useState(false);
  const [size, setSize] = useState('');
  const [isCreatingImage, setIsCreatingImage] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');
  const [largerImages, setLargerImages] = useState(false);
  const [color, setColor] = useState(false);
  const [cost, setCost] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    const loadDataFromSession = async () => {
      const sessionData = sessionStorage.getItem('textCollageSessionData');
      if (sessionData) {
        const { text: storedText, croppedImages: storedCroppedImages, size: storedSize, color: storedColor, largerImages: storedLargerImages } = JSON.parse(sessionData);
        if (storedText) {
          setText(storedText);
        }
        if (storedCroppedImages.length > 0) {
          const file = await createFileFromBlobUrl(storedCroppedImages[0], 'test1');
          if (file) {
            setCroppedImages(storedCroppedImages);
          }
          else {
            setCroppedImages([])
          }
        }
        if (storedSize) {
          setSize(storedSize)
        }
        if (storedColor) {
          setColor(storedColor)
        }
        if (storedLargerImages) {
          setLargerImages(storedLargerImages)
        }
      }
    };
  
    loadDataFromSession();
  }, [sessionStorage]);

  useEffect(() => {
    const sessionData = JSON.stringify({ text, croppedImages, size, color, largerImages });
    sessionStorage.setItem('textCollageSessionData', sessionData);
  }, [text, croppedImages, size, color, largerImages]);

  useEffect(() => {
    if (cropperVisible) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = ''; // Re-enable scrolling
    }
  
    return () => {
      document.body.style.overflow = ''; // Re-enable scrolling when component unmounts
    };
  }, [cropperVisible]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingDots((prevDots) => {
        if (prevDots === '...') {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (size ==='24x24') {
      setCost(amount24x24)
    }
    else if (size === '24x36' || size === '36x24') {
      setCost(amount24x36)
    }
  }, [size]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setCropperVisible(true);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels);
        var resizedImg = null;
        if (largerImages) {
          resizedImg = await resizeImage(croppedImg, 120, 120);
        }
        else{
          resizedImg = await resizeImage(croppedImg, 90, 90);
        }
        const resizedImgUrl = URL.createObjectURL(resizedImg);
        setCroppedImages([resizedImgUrl, ...croppedImages]);
        setCropperVisible(false);
      } catch (error) {
        console.error('Error cropping image:', error);
        alert("Error using image. Please ensure your browser has permissions for this file. You can also try to zoom in the smallest available increment.")
      }
    }
  };
  
  const resizeImage = (blob, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (resizedBlob) => {
            if (!resizedBlob) {
              reject(new Error('Failed to resize image.'));
              return;
            }
            resolve(resizedBlob);
          },
          'image/jpeg'
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  };

  const handleDelete = (index) => {
    const updatedImages = [...croppedImages];
    updatedImages.splice(index, 1);
    setCroppedImages(updatedImages);
  };

  const confirmClearImages = () => {
    const isConfirmed = window.confirm("Are you sure you want to clear all images?");
    if (isConfirmed) {
      clearImages();
    }
  }

  const clearImages = () => {
    setCroppedImages([]);
  };

  const createImage = async () => {
    if (!size) {
      alert('Please choose a size before creating the collage.');
      return;
    }
    else if (size.length < 1) {
      alert('Please choose a size before creating the collage.');
      return;
    }
    if (text.length === 0 || text.length > 20) {
      alert('Text must be between 1-20 characters');
      return;
    }
    if (croppedImages.length < 5) {
      alert('Please add at 5 small images.');
      return;
    }
    setIsCreatingImage(true);
    try {
      const croppedImageFiles = await Promise.all(
        croppedImages.map(async (croppedImageUrl, index) => {
          const fileName = `cropped_image_${index}.jpg`;
          return await createFileFromBlobUrl(croppedImageUrl, fileName);
        })
      );

      const formData = new FormData()
      formData.append('word', text)
      croppedImageFiles.forEach((file, index) => {
        formData.append('small_images_${index}', file)
      })
      formData.append('output_width', size.split("x")[0])
      formData.append('output_height', size.split("x")[1])
      formData.append('type', 'text')
      formData.append('large_images', largerImages)
      formData.append('color', color)
  
      const response = await fetch(`${backendURL}api/collage-image/`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        setIsCreatingImage(false);
        throw new Error('Failed to upload collage');
      }
  
      const responseData = await response.json();
      setIsCreatingImage(false);
      navigateToPreview(responseData.collage, responseData.watermark_collage)
    } catch (error) {
      console.error('Error creating collage:', error);
      setIsCreatingImage(false);
    }
  };

  function navigateToPreview(output, watermark_output) {
    navigate('/preview/', {
      state: { output: output, watermark_output: watermark_output, cost: cost }
    });
  }

  const createFileFromBlobUrl = async (blobUrl, fileName) => {
    try {
      const blob = await fetch(blobUrl).then(response => response.blob());
      return new File([blob], fileName, { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error creating file from blob URL:', error);
      return null
    }
  };

  const handleCancelCrop = () => {
    setCropperVisible(false);
    setSelectedImage(null);
    setCroppedAreaPixels(null);
  };

  const handleChangeLargerImages = (e) => {
    const confirmChange = window.confirm(
      'Warning: You will have to re-upload all of your images if you choose to change this.'
    );

    if (confirmChange) {
      setLargerImages((prevValue) => !prevValue);
      setCroppedImages([])
    }
  }

  return (
    <div>
      <NavBar/>
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            <img src={mediumLogo} alt="Medium Logo" className="medium-logo" style={{ width: '80%' }} onClick={() => navigate('/')} />
          </div>
          <div className="header-center">
            <h1>Text Collage</h1>
          </div>
        </header>

        <div>
          <header style={{ fontSize: 18, ...(isDesktop && { marginTop: -20 }) }}>
            Step 1. Choose an output size in inches - width x height.
          </header>
        </div>

        <div>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="drop-down" style={{ display: 'inline-block', width: 'auto' }}>
            <option value="">Size</option>
            <option value="24x24">24x24</option>
            <option value="24x36">24x36</option>
            <option value="36x24">36x24</option>
          </select>
        </div>

        <div>
          <header style={{ fontSize: 14}}>
            Cost: ${cost/100} (not including shipping and tax)
          </header>
        </div>

        <div>
          <header style={{ fontSize: 18, marginTop: 20 }}>
            Step 2. Choose your text to display.
          </header>
        </div>

        <div className="add-image-container">
          <input style={{fontSize: 20, width: '25%', minWidth: 200 }} value={text} type="text" placeholder="Enter Text" onChange={(e) => setText(e.target.value)} disabled={isCreatingImage} maxLength={20} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <header style={{ fontSize: 18, paddingRight: 10 }}>
              Step 3. Click the box below if you'd like your small images to be scaled slightly larger.
            </header>
            <button style={{ borderRadius: 20, marginTop: 2, marginBottom: 2 }} onClick={() => alert('Selecting this will make the small images 120x120 pixels instead of 90x90 pixels.')}>ℹ️</button>
          </div>
          <header style={{ fontSize: 14, color: 'red' }}>
            **Warning!!! You will have to re-upload all of your images if you choose to change this, so make your decision on this first. This is due to the way the images are stored on the server once you upload them.**
          </header>
        </div>

        <div>
          <input style={{ width: 20, height: 20, marginRight: 10 }} checked={largerImages} type="checkbox" id="largerImages" onChange={(e) => handleChangeLargerImages(e.target.checked)} disabled={isCreatingImage} />
          <label style={{ fontSize: 22 }} htmlFor="largerImages">Larger Images</label>
        </div>

        <div>
          <header style={{ fontSize: 18 }}>
            Step 4. Click here if you'd like your images to be in color instead of grayscale.
          </header>
        </div>

        <div>
          <input style={{ width: 20, height: 20, marginRight: 10 }} checked={color} type="checkbox" id="color" onChange={(e) => setColor(e.target.checked)} disabled={isCreatingImage} />
          <label style={{ fontSize: 22 }} htmlFor="color">Color Images</label>
        </div>

        <div>
          <header style={{ fontSize: 18 }}>
            Step 5. You must choose at least 5 images that will make up the collage. They will be cropped to squares to be uploaded to the server. Please read the warning in Step 3 first.
          </header>
        </div>

        {croppedImages.length > 0 && (
          <div className="clear-button">
            <button onClick={confirmClearImages}>Clear All Images</button>
          </div>
        )}

        <div className="add-image-container">
          <label htmlFor="image-upload" className="general-button">
            Add Image
          </label>
          <input type="file" id="image-upload" onChange={handleImageChange} accept="image/*" disabled={isCreatingImage} />
        </div>

        {selectedImage && cropperVisible && (
          <div className="cropper-container">
            <Cropper
              style={{ containerStyle: {backgroundColor: '#282c34'} }}
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoomWithScroll={false}
            />
            <div className="controls">
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <button style={{ marginRight: 10 }} onClick={handleCrop}>Crop Image</button>
              <button onClick={handleCancelCrop}>Cancel</button>
            </div>
          </div>
        )}

        <div className="image-container">
          {croppedImages.map((croppedImage, index) => (
            <div className="image-item" key={index}>
              <div className="image-wrapper">
                <img src={croppedImage} alt="Cropped" />
                <button style={{ marginTop: 5}} onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <header style={{ fontSize: 18 }}>
            Step 6. Let the server run for 10-30 seconds and see the results!
          </header>
          <header style={{ fontSize: 14 }}>
            **Time will vary depending on internet connection and number of images uploaded**
          </header>
        </div>

        <div>
          <button onClick={createImage} className='general-button' disabled={isCreatingImage}>
            {isCreatingImage ? `Processing${loadingDots}` : 'Create Output Image!'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollageTextCreation;
