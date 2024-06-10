import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';
import mediumLogo from '../Assets/medium-logo.png'
import NavBar from './navBar';
import { backendURL, taxRate } from '../../Constants';


function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [gettingShippingCost, setGettingShippingCost] = useState(false);
  var collage = null;
  var cost = null;
  var quantity = null;
  const numPerShip = 3;
  try{
    collage = location.state.collage;
    cost = location.state.cost;
    quantity = location.state.quantity;
  }
  catch{
    navigate('/')
  }
  
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

  const calculateShippingCost = async () => {
    setGettingShippingCost(true)
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const mailingDate = today.toISOString().split('T')[0];
    const numShipments = Math.floor((quantity + numPerShip - 1) / numPerShip)
    try {
      const response = await fetch(`${backendURL}api/get-shipping-cost/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originZIPCode: 96818,
          destinationZIPCode: formData.zipCode,
          weight: 1,
          length: 26,
          width: 6,
          height: 6,
          mailClass: "USPS_GROUND_ADVANTAGE",
          processingCategory: "NON_MACHINABLE",
          rateIndicator: "DN",
          destinationEntryFacilityType: "NONE",
          priceType: "COMMERCIAL",
          mailingDate: mailingDate,
          accountType: "EPS"
        }),
      });
      if (response.ok) {
        let json = await response.json()
        setGettingShippingCost(false)
        let total = json.totalBasePrice * numShipments
        return total;
      }
      else{
        setGettingShippingCost(false)
        return 12.91 * numShipments;
      }
    } catch {
      setGettingShippingCost(false)
      return 12.91 * numShipments;
    }
  };

  const calculateTax = async (shippingCost) => {
    setGettingShippingCost(true)
    let totalTax = Math.ceil((shippingCost + cost * quantity) * taxRate) / 100
    setGettingShippingCost(false)
    return totalTax
  }

  const navigateBillingPage = async () => {
    const shippingCost = await calculateShippingCost()
    const tax = await calculateTax(shippingCost)
    navigate('/billing-page/', {
      state: { formData: formData, cost: cost * quantity, shippingCost: shippingCost, tax: tax, collage: collage, quantity: quantity }
    });
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
            <h1>Shipping Info</h1>
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
              <label htmlFor="addressLine1">Address Line 1: </label>
            </div>
            <input type="text" id="addressLine1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <div className="label-div">
              <label htmlFor="addressLine2">Address Line 2: </label>
            </div>
            <input type="text" id="addressLine2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
          </div>

          <div className="form-group">
            <div className="label-div">
              <span className="required-asterisk">*</span>
              <label htmlFor="city">City: </label>
            </div>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <div className="label-div">
              <span className="required-asterisk">*</span>
              <label htmlFor="state">State: </label>
            </div>
            <select style={{ flex: 2 }} id="state" name="state" value={formData.state} onChange={handleChange} required>
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
            <div className="label-div">
              <span className="required-asterisk">*</span>
              <label htmlFor="zipCode">ZIP Code: </label>
            </div>
            <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>

          <div>
            <button onClick={navigateBillingPage} className='general-button' disabled={!formValid || gettingShippingCost}>
              {gettingShippingCost ? "Processing" : "Go To Checkout"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Order;