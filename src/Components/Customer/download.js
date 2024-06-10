import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';
import '../CSS/form.css'
import { downloadAmount, taxRate, stripeKey } from '../../Constants';
import CheckoutForm from './checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import mediumLogo from '../Assets/medium-logo.png'
import NavBar from './navBar';


function Download() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tax, setTax] = useState(-1)
  const [processing, setProcessing] = useState(false)
  var collage = null;
  try{
    collage = location.state.collage;
  }
  catch{
    navigate('/')
  }
  
  const stripePromise = loadStripe(stripeKey)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: ''
  });

  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem('orderSessionData');
    if (sessionData) {
      setFormData(JSON.parse(sessionData));
    }
    setTax(-1)
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

      const isZipCodeValid = /^\d{5}$/.test(updatedFormData.zipCode);

      if (isZipCodeValid) {
        const isValid = Object.entries(updatedFormData).every(([key, val]) => {
          return key === 'addressLine2' || (typeof val === 'string' && val.trim() !== '');
        });
        setFormValid(isValid);
      }
      return updatedFormData;
    });
  };

  const calculateTax = () => {
    setProcessing(true)
    setTax(Math.ceil(downloadAmount / 100 * taxRate) / 100)
    setProcessing(false)
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
            <h1>Download Order</h1>
          </div>
        </header>

        <p className="required-note" style={{ fontSize: 18, marginBottom: -20, color: 'red' }}>*Required field</p>

        <form className="aligned-form">
          <div className="form-group">
            <div className="label-div">
              <span className="required-asterisk">*</span>
              <label htmlFor="firstName">First Name: </label>
            </div>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <div className="label-div">
              <span className="required-asterisk">*</span>
              <label htmlFor="lastName">Last Name: </label>
            </div>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <div className="label-div">
              <span className="required-asterisk">*</span>
              <label htmlFor="email">Email: </label>
            </div>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <div className="label-div">
              <span className="required-asterisk">*</span>
              <label htmlFor="zipCode">Zip Code: </label>
            </div>
            <input type="email" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>
        </form>

        <button style={{ justifySelf: 'center' }} onClick={calculateTax} className='general-button' type="submit" disabled={!stripePromise || !formValid || processing}>
          {formValid ? "Go To Billing" : "Fill all required fields"}
        </button>

        {tax !== -1 &&
        <div>
          <h2>Pricing Info</h2>
          <div className="flex-container">
            <span className="label">Download Cost:</span>
            <span className="value">${(downloadAmount/100).toFixed(2)}</span>
          </div>
          <div className="flex-container">
            <span className="label">General Excise Tax:</span>
            <span className="value">${tax.toFixed(2)}</span>
          </div>
          <div className="flex-container">
            <span className="label"><strong>Total Cost:</strong></span>
            <span className="value"><strong>${(downloadAmount/100 + tax).toFixed(2)}</strong></span>
          </div>
          <h2>Billing Info</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm cost={downloadAmount} shippingCost={0} tax={(tax*100).toFixed(2)} quantity={1} formValid={formValid} formData={formData} collage={collage} type={'download'} />
          </Elements>
        </div>
        }

      </div>
    </div>
  );
}

export default Download;