import React, { useState, useEffect } from 'react';
import '../../App.css';
import '../CSS/collageCreation.css';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { backendURL, amount24x24regular, amount24x36regular } from '../../Constants';
import { useNavigate } from 'react-router-dom';
import mediumLogo from '../Assets/medium-logo.png';
import NavBar from './navBar';

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
  const [isDesktop, setIsDesktop] = useState(false);
  const [imgBase64, setImgBase64] = useState('');
  const [cost, setCost] = useState(0);
  const [quantity, setQuantity] = useState(1);
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
    setQuantity(1);
  }, []);

  useEffect(() => {
    if (cropperVisible) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = '';
    };
  }, [cropperVisible]);

  useEffect(() => {
    if (size) {
      const [width, height] = size.split('x').map(Number);
      setAspect(width / height);
      if (size ==='24x24') {
        setCost(amount24x24regular)
      }
      else if (size === '24x36' || size === '36x24') {
        setCost(amount24x36regular)
      }
    }
  }, [size]);

  const handleMainImageChange = async (event) => {
    if (size === '') {
      alert('You must choose a size before selecting the main image.');
    } else {
      const file = event.target.files[0];
      event.target.value = null;
      if (chooseCrop) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setCropperVisible(true);
      } else {
        setLoading(true)
        const [widthInches, heightInches] = size.split('x').map(Number);
        const targetWidth = widthInches * 300;
        const targetHeight = heightInches * 300;
        
        try {
          const resizedImg = await resizeImage(file, targetWidth, targetHeight);
          const resizedImgUrl = URL.createObjectURL(resizedImg);
          setMainImage(resizedImgUrl);
          createImgString(resizedImg);
        } catch (error) {
          console.error('Error resizing image:', error);
          try {
            const resizedImg = resizeFromBackend(file, targetWidth, targetHeight)
            const resizedImgUrl = URL.createObjectURL(resizedImg);
            setMainImage(resizedImgUrl);
            createImgString(resizedImg);
          } catch {
            console.error("Could not resize the image")
          }
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const resizeFromBackend = async (file, targetWidth, targetHeight) => {
    const formData = new FormData();
    formData.append('input_image', file);
    formData.append('width', targetWidth);
    formData.append('height', targetHeight);
  
    try {
      const response = await fetch(`${backendURL}api/resize-image/`, {
        method: 'POST',
        body: formData
      });
      console.log(response)
  
      if (!response.ok) {
        throw new Error('Failed to resize image');
      }
  
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      setLoading(true);
      try {
        const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels);

        const [widthInches, heightInches] = size.split('x').map(Number);
        const targetWidth = widthInches * 300;
        const targetHeight = heightInches * 300;

        const resizedImg = await resizeImage(croppedImg, targetWidth, targetHeight);

        const resizedImgUrl = URL.createObjectURL(resizedImg);
        setMainImage(resizedImgUrl);
        createImgString(croppedImg);
        setCropperVisible(false);
      } catch (error) {
        console.error('Error cropping image:', error);
        if (error === "Error: Failed to create blob"){
          alert("Error using image. Please ensure your browser has permissions for this file. You can also try to zoom in the smallest available increment.")
        }
        else{
          alert("Error resizing.")
          // Add in a call to the backend to try to resize the image instead
        }
      } finally {
        setLoading(false);
      }
    }
  };

  function navigateToOrder() {
    if (mainImage === null) {
      alert('You must select an image')
      return
    }
    navigate('/order/', {
      state: { collage: imgBase64, cost: cost/100, quantity: quantity }
    });
  }

  const handleCancelCrop = () => {
    setCropperVisible(false);
    setSelectedImage(null);
    setCroppedAreaPixels(null);
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

  const createImgString = (blob) => {
      const reader = new FileReader();
      reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          setImgBase64(base64String);
      };
      reader.readAsDataURL(blob);
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
    else {
      alert("Quantity must be between 1 and 10")
    }
  }

  return (
    <div>
      <NavBar />
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            <img src={mediumLogo} alt="Medium Logo" className="medium-logo" onClick={() => navigate('/')} />
          </div>
          <div className="header-center">
            <h1>Large Format</h1>
          </div>
        </header>

        <div>
          <header style={{ fontSize: 18, paddingTop: 20, ...(isDesktop && {marginTop: -20}) }}>
            Step 1. Choose an output size in inches - width x height.
          </header>
        </div>

        <div>
        <select onChange={(e) => {
            setSize(e.target.value);
            if (mainImage !== null) {
              alert('Changing the size means you have to upload your image again')
              setMainImage(null);
            }
          }} className="drop-down" style={{ display: 'inline-block', width: 'auto' }}>
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
            Step 2. By default your image will be scaled to fit the dimensions. Select this box if you'd like to crop it instead.
          </header>
          <header style={{ fontSize: 14 }}>
            **If you believe your image is already properly sized, leave this box unchecked**
          </header>
        </div>

        <div>
          <input style={{ width: 20, height: 20, marginRight: 10 }} checked={chooseCrop} type="checkbox" id="chooseCrop" onChange={(e) => setChooseCrop(e.target.checked)} />
          <label style={{ fontSize: 22 }} htmlFor="chooseCrop">Crop Image</label>
        </div>

        <div>
          <header style={{ fontSize: 18, marginTop: 20 }}>
            Step 3. Select which image you'd like to print.
          </header>
          <header style={{ fontSize: 14 }}>
            **It may take 5-10 seconds for the server to resize your image to be 300 pixels per inch.**
          </header>
        </div>

        <div className="add-image-container">
          <label htmlFor="main-image-upload" className="general-button" disabled={loading}>
            {loading ? 'Loading...' : 'Choose Image'}
          </label>
          <input type="file" id="main-image-upload" onChange={handleMainImageChange} accept="image/*" />
        </div>

        {mainImage && (
          <div style={{ marginBottom: 10}}>
            <img src={mainImage} alt="Error. Please return to homepage" className="main-image" />
          </div>
        )}

        {selectedImage && cropperVisible && (
          <div className="cropper-container">
            <Cropper
              style={{ containerStyle: { backgroundColor: '#282c34' } }}
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoomWithScroll={false}
            />
            { loading? 
            <div className="controls">
              <button>
                {'Cropping and resizing. Please wait...'}
              </button>
            </div>
            :
            <div className="controls">
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <button
                style={{ marginRight: 10 }}
                onClick={handleCrop}
                disabled={loading}
              >
                Crop Image
              </button>
              <button
                onClick={handleCancelCrop}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            }
          </div>
        )}

        <div>
          <header style={{ fontSize: 18, ...(isDesktop && { marginTop: -20 }) }}>
            Step 4. Select the quantity you want printed.
          </header>
        </div>

        <div className="quantity-control" style={{ marginTop: -20 }}>
          <p>Quantity: </p>
          <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>-</button>
          <input 
            type="text" 
            value={quantity} 
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value, 1);
              handleQuantityChange(newQuantity);
            }} 
            style={{ width: '40px', textAlign: 'center' }}
          />
          <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= 10}>+</button>
        </div>

        <div>
          <button onClick={navigateToOrder} className='general-button' disabled={loading} >
            {loading ? 'Loading...' : 'Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegularImageOrder;
