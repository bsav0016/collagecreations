import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../App.css';
import '../CSS/preview.css'
import { useNavigate } from 'react-router-dom';
import { downloadAmount } from '../../Constants';
import mediumLogo from '../Assets/medium-logo.png'
import NavBar from './navBar';


function Preview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1)
  var collage = null;
  var watermark_collage = null;
  var cost = null;
  try{
    collage = location.state.output;
    watermark_collage = location.state.watermark_output;
    cost = location.state.cost;
  }
  catch{
    navigate('/')
  }
  
  const [collageImage, setCollageImage] = useState(null);
  const [zoomScale, setZoomScale] = useState('1');
  const [chosenZoom, setChosenZoom] = useState('1')

  useEffect(() => {
    const imageData = atob(watermark_collage);
    const bytes = new Uint8Array(imageData.length);
    for (let i = 0; i < imageData.length; i++) {
      bytes[i] = imageData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    setCollageImage(imageUrl);
    return () => URL.revokeObjectURL(imageUrl);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function navigateToOrder() {
    navigate('/order/', {
      state: { collage: collage, cost: cost/100, quantity: quantity }
    });
  }

  function navigateToDownload() {
    navigate('/download/', {
      state: { collage: collage }
    });
  }

  const handleMouseMove = (e) => {
    setZoomScale(chosenZoom)
    const image = e.currentTarget;
    const offsetX = e.nativeEvent.offsetX / image.offsetWidth;
    const offsetY = e.nativeEvent.offsetY / image.offsetHeight;
    image.style.transformOrigin = `${offsetX * 100}% ${offsetY * 100}%`;
  };

  const handleMouseLeave = (e) => {
    const image = e.currentTarget;
    image.style.transformOrigin = '50% 50%';
    setZoomScale('1')
  };

  const handleZoomScaleChange = (e) => {
    setChosenZoom(e.target.value);
  };

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
      <NavBar/>
      <div className='App'>
        <header className="App-header">
          <div className="header-left">
            <img src={mediumLogo} alt="Medium Logo" className="medium-logo" style={{ width: '80%' }} onClick={() => navigate('/')} />
          </div>
          <div className="header-center">
            <h1>Collage Preview</h1>
          </div>
        </header>

        <div className="clear-button">
          <button className='general-button' onClick={navigateToDownload}>Download ${parseFloat(downloadAmount/100)}</button>
        </div>

        <div className="clear-button">
          <button className='general-button' onClick={navigateToOrder}>Place Order ${ (parseFloat(cost / 100) * quantity).toFixed(2) }</button>
        </div>

        <div className="quantity-control">
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

        {collageImage && 
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Move your cursor over the image to zoom in. Zoom scale: </p>
              <select value={chosenZoom} onChange={handleZoomScaleChange} style={{ display: 'inline-block', width: 'auto', margin: 3 }}>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="4">4x</option>
                <option value="6">6x</option>
                <option value="8">8x</option>
                <option value="10">10x</option>
                <option value="12">12x</option>
              </select>
            </div>
            <div className="image-zoom-container">
              <img src={collageImage} alt="Collage" className="collage-image" style={{ transform: `scale(${zoomScale})`}} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
            </div>
          </div>
        }

      </div>
    </div>
  );
}

export default Preview;
