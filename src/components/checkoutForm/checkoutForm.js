import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import GeneralButton from '../generalButton/generalButton';
import styles from './checkoutForm.module.css';
import PaymentService from '../../services/PaymentService';
import { toastRef } from '../../context/toastContext/toastContext';
import LoadingDots from '../loadingDots';


function CheckoutForm({ formValid, formData, type, tempImageId, setLoading }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);


  const handleSubmit = async (event) => {
    setProcessing(true);
    setLoading(true);
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
        setProcessing(false);
        setLoading(false);
        toastRef.current('Error processing payment: ' + error.message);
        return;
    }

    try {
      const response = await PaymentService.createPayment(
        paymentMethod,
        tempImageId,
        type,
        formData
      );

      setLoading(false);
      navigate('/confirmation/', {
          state: { id: response.id, email: formData.email, collage: response.collage }
      });
    } catch (error) {
      toastRef.current(`${error.message}`);
      setLoading(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.cardInputContainer}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000',
                '::placeholder': {
                  color: '#999',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      <GeneralButton
        type="submit" 
        disabled={!stripe || !elements || !formValid || processing}
        text={processing ? <>Processing<LoadingDots /></> : 
          formValid ? "Complete Order" : 
          "Fill all required fields"}
      />
    </form>
  );
}

export default CheckoutForm;
