import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'; // Import your CSS file for styling
import { amount } from './Constants';
import CheckoutForm from './checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import mediumLogo from './medium-logo.png'
import NavBar from './navBar';


function Order() {
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
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: ''
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
        <header className="App-header">
          <div className="header-left">
            <img src={mediumLogo} alt="Medium Logo" className="medium-logo" style={{ width: '80%' }} onClick={() => navigate('/')} />
          </div>
          <div className="header-center">
            <h1>Order Page</h1>
          </div>
        </header>

        <p className="required-note" style={{ fontSize: 18, marginBottom: -20, color: 'red' }}>*Required field</p>

        <form className="order-form">
          <h2 style={{ marginBottom: 5 }}>Shipping Info</h2>

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

          <div className="form-group">
            <span className="required-asterisk">*</span>
            <label htmlFor="addressLine1">Address Line 1: </label>
            <input type="text" id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="addressLine2">Address Line 2: </label>
            <input type="text" id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
          </div>

          <div className="form-group">
            <span className="required-asterisk">*</span>
            <label htmlFor="city">City: </label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <span className="required-asterisk">*</span>
            <label htmlFor="state">State: </label>
            <select id="state" name="state" value={formData.state} onChange={handleChange} required>
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>

          <div className="form-group">
            <span className="required-asterisk">*</span>
            <label htmlFor="zipCode">ZIP Code: </label>
            <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>

          <h2 style={{ marginBottom: -10 }}>Billing Info</h2>
        </form>

        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} formValid={formValid} formData={formData} collage={collage} type={'order'} />
        </Elements>

      </div>
    </div>
  );
}

export default Order;