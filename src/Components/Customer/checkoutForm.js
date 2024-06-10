import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { backendURL } from '../../Constants';
import { useNavigate } from 'react-router-dom';


function CheckoutForm({ cost, shippingCost, tax, formValid, formData, collage, type, quantity }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    setProcessing(true);
    event.preventDefault();

    if (!stripe || !elements) {
      setProcessing(false)
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setProcessing(false);
      console.error(error);
      window.alert('Error processing payment: ' + error.message);
    } else {
      try {
        let totalCost = cost + shippingCost + tax
        const response = await fetch(`${backendURL}api/payment/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod: paymentMethod.id,
            amount: totalCost
          }),
        });
        if (response.status === 200) {
            addOrder()
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        window.alert('Error processing payment: ' + error);
      } finally {
        setProcessing(false);
      }
    }
    setProcessing(false);
  };

  const addOrder = async () => {
    try {
      const response = await fetch(`${backendURL}api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: collage,
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          address1: formData.addressLine1,
          address2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
          order_type: type,
          quantity: quantity,
          base_cost: cost,
          tax: tax,
          shipping_cost: shippingCost
        }),
      });
      if (response.ok) {
        console.log('Order created successfully');
        const data = await response.json()
        const orderID = data.id
        sendNotificationEmail(orderID)
        navigateToConfirmation(orderID)        
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  function navigateToConfirmation(id) {
    navigate('/confirmation/', {
      state: { id: id, email: formData.email, collage: collage, type: type }
    });
  }

  const sendNotificationEmail = async (id) => {
    const subject = "Collage Creations Order Confirmation"
    const message = `Thanks for your order, ${formData.firstName}!\nYour order number is: #${id}`
    const email = formData.email
    var attachment = null;
    if (type === 'download') {
      attachment = collage;
    }
    try {
        const response = await fetch(`${backendURL}api/send-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subject, message, email, attachment }),
        });
    
        if (response.ok) {
          console.log('Company notified')
        } else {
          const errorMessage = await response.text();
          alert(`Failed to send message: ${errorMessage}`);
        }
      } catch (error) {
        alert('An error occurred while sending your message. Please try again later.');
      }
  }

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
      <div style={{ margin: '0 auto 25px', maxWidth: '400px', backgroundColor: '#fff', padding: 5, borderRadius: 5 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000', // black text
                '::placeholder': {
                  color: '#999', // light gray placeholder text
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <button className='general-button' type="submit" disabled={!stripe || !formValid || processing}>
        {formValid ? "Complete Order" : "Fill all required fields"}
      </button>
    </form>
  );
}

export default CheckoutForm;
