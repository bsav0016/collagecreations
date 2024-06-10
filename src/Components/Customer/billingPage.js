import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../App.css';
import '../CSS/billingPage.css'
import CheckoutForm from './checkoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import mediumLogo from '../Assets/medium-logo.png'
import NavBar from './navBar';
import { stripeKey } from '../../Constants';


function BillingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  var collage = null;
  var cost = null;
  var shippingCost = null;
  var tax = null;
  var formData = null;
  var quantity = null;
  try{
    formData = location.state.formData;
    collage = location.state.collage;
    cost = location.state.cost;
    shippingCost = location.state.shippingCost;
    tax = location.state.tax;
    quantity = location.state.quantity;
  }
  catch{
    navigate('/')
  }
  
  const stripePromise = loadStripe(stripeKey);

  return (
    <div>
      <NavBar />
      <div className="App">
        <header className="App-header">
          <div className="header-left">
            <img src={mediumLogo} alt="Medium Logo" className="medium-logo" style={{ width: '80%' }} onClick={() => navigate('/')} />
          </div>
          <div className="header-center">
            <h1>Checkout Page</h1>
          </div>
        </header>

        <div className="order-info">
          <h2 style={{ marginBottom: 5 }}>Shipping Info</h2>
          <p className="compact-paragraph">{formData.firstName} {formData.lastName}</p>
          <p className="compact-paragraph">{formData.addressLine1}</p>
          {formData.addressLine2 !== '' && <p className="compact-paragraph">{formData.addressLine2}</p>}
          <p className="compact-paragraph">{formData.city}, {formData.state} {formData.zipCode}</p>
        </div>

        <div>
        <h2 style={{ marginBottom: 5 }}>Pricing Info</h2>
          <div className="flex-container">
            <span className="label">Order Quantity:</span>
            <span className="value">{quantity}</span>
          </div>
          <div className="flex-container">
            <span className="label">Order Cost:</span>
            <span className="value">${cost.toFixed(2)}</span>
          </div>
          <div className="flex-container">
            <span className="label">Shipping Cost:</span>
            <span className="value">${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex-container">
            <span className="label">General Excise Tax:</span>
            <span className="value">${tax.toFixed(2)}</span>
          </div>
          <div className="flex-container">
            <span className="label"><strong>Total Cost:</strong></span>
            <span className="value"><strong>${(cost + shippingCost + tax).toFixed(2)}</strong></span>
          </div>
        </div>

        <div className="billing-info">
          <h2 style={{ marginBottom: -10 }}>Billing Info</h2>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm cost={(cost * 100)} shippingCost={(shippingCost * 100)} tax={(tax * 100)} quantity={quantity} formValid={true} formData={formData} collage={collage} type={'order'} />
        </Elements>
      </div>
    </div>
  );
}

export default BillingPage;