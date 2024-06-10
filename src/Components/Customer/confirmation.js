import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../App.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';
import mediumLogo from '../Assets/medium-logo.png';
import NavBar from './navBar';


function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState(null);
  const [email, setEmail] = useState(null);
  const [type, setType] = useState(null);
  const [collageImage, setCollageImage] = useState(null);

  useEffect(() => {
    if (!location.state || !location.state.id || !location.state.email || !location.state.type) {
      navigate('/');
    }
    try{
      setId(location.state.id);
      setEmail(location.state.email);
      setType(location.state.type)
      if (location.state.type === 'download') {
        const imageData = atob(location.state.collage);
        const bytes = new Uint8Array(imageData.length);
        for (let i = 0; i < imageData.length; i++) {
          bytes[i] = imageData.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setCollageImage(imageUrl);
        return () => URL.revokeObjectURL(imageUrl);
      }
    }
    catch{
      console.log('Error')
    }
  }, []);

  useEffect(() => {
    if (!location.state || !location.state.id || !location.state.email) {
      navigate('/');
    }
  }, [navigate, location.state]);

  function navigateHome() {
    navigate('/', {
    });
  }

  const downloadImage = () => {
    if (collageImage) {
      const a = document.createElement('a');
      a.href = collageImage;
      a.download = 'collage.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
            <h1>Order Confirmation</h1>
          </div>
        </header>

        <div style={{ justifyContent: 'center' }}>
          <label>Your order has been placed!</label> <br />
          <label>Your order number is: {id}.</label> <br />
          <label>A confirmation email has been sent to {email}.</label>
        </div>

        <div className="clear-button">
          <button className='general-button' onClick={navigateHome}>Homepage</button>
        </div>

        {(collageImage && type === 'download') && 
        <div style={{ justifyContent: 'center' }}>
          <div>
            <img src={collageImage} alt="Collage" style={{ width: '70%', height: 'auto' }} />
          </div>
          <div>
            <button className='general-button' onClick={downloadImage}>Download</button>
          </div>
        </div>
        }

      </div>
    </div>
  );
}

export default Confirmation;
