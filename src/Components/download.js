import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { downloadAmount } from './Constants';
import CheckoutForm from './checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import NavBar from './navBar';


function Download() {
  const location = useLocation();
  const navigate = useNavigate();
  var collage = null;
  try{
    collage = location.state.collage;
  }
  catch{
    navigate('/')
  }
  
  const stripePromise = loadStripe('pk_test_51K3Z43KQPt6SvxbCq2DWQAxjj2fSskBhazWMiBI4WM6XRgOoDUSckkHxZzWaSXgIO55qf3EAi0lo2X4iab44nHIl00amJ9PVxZ')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem('orderSessionData');
    if (sessionData) {
      setFormData(JSON.parse(sessionData));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('orderSessionData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevFormData => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value
      };

      const isValid = Object.entries(updatedFormData).every(([key, val]) => {
        return key === 'addressLine2' || (typeof val === 'string' && val.trim() !== '');
      });

      setFormValid(isValid);
      return updatedFormData;
    });
  };

  return (
    <div>
      <NavBar/>
      <div className="App">
        <header className="App-header" style={{ flexDirection: 'column'}}>
          <h1>Download Order Page</h1>
          <p className="required-note" style={{ fontSize: 18, marginBottom: -20, color: 'red' }}>*Required field</p> {/* Note indicating required fields */}
        </header>

        <form className="order-form">
          <h2 style={{ marginBottom: 5 }}>Order Info</h2>

          <div className="form-group">
            <span className="required-asterisk">*</span>
            <label htmlFor="firstName">First Name: </label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <span className="required-asterisk">*</span>
            <label htmlFor="lastName">Last Name: </label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <span className="required-asterisk">*</span>
            <label htmlFor="email">Email: </label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <h2 style={{ marginBottom: -10 }}>Billing Info</h2>
        </form>

        <Elements stripe={stripePromise}>
          <CheckoutForm amount={downloadAmount} formValid={formValid} formData={formData} collage={collage} type={'download'} />
        </Elements>

      </div>
    </div>
  );
}

export default Download;