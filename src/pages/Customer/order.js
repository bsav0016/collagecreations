import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../layout/navBars/navBar';
import MediumLogoHeader from '../../layout/mediumLogoHeader/mediumLogoHeader';
import FormField from '../../components/form/formField';
import LoadingDots from '../../components/loadingDots';
import GeneralButton from '../../components/generalButton/generalButton';
import RequiredFieldDesignator from '../../components/requiredFieldDesignator/requiredFieldDesignator';
import Form from '../../components/form/form';
import PaymentService from '../../services/PaymentService';
import { toastRef } from '../../context/toastContext/toastContext';
import { useOrderContext } from '../../context/orderContext';
import appStyles from '../../App.module.css';

function Order() {
  const navigate = useNavigate();
  const { temporaryImageId, quantity, setBaseCost, setShippingCost, setTax } = useOrderContext();

  const [gettingShippingCost, setGettingShippingCost] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [formValid, setFormValid] = useState(false);
  const [errorText, setErrorText] = useState('Input first name');

  useEffect(() => {
    const sessionData = sessionStorage.getItem('orderSessionData');
    if (sessionData) {
      setFormData(JSON.parse(sessionData));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('orderSessionData', JSON.stringify(formData));
  }, [formData]);

  const navigateBillingPage = async () => {
    setGettingShippingCost(true);
    try {
      const response = await PaymentService.calculateShipping(
        formData,
        temporaryImageId,
        quantity
      );

      setBaseCost(response.baseCost);
      setShippingCost(response.shippingCost);
      setTax(response.tax);

      navigate('/billing-page/', {
        state: {
          formData: formData
        }
      });
    } catch (error) {
      toastRef.current(`${error.message}`);
    } finally {
      setGettingShippingCost(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevFormData => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value
      };

      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedFormData.email);
      const isZipCodeValid = /^\d{5}$/.test(updatedFormData.zipCode);
      const isfirstnameValid = updatedFormData.firstname.trim() !== '';
      const islastnameValid = updatedFormData.lastname.trim() !== '';
      const isAddress1Valid = updatedFormData.address1.trim() !== '';
      const isCityValid = updatedFormData.city.trim() !== '';
      const isStateValid = updatedFormData.state.trim() !== '';

      if (!isfirstnameValid) { setErrorText('Input first name'); }
      else if (!islastnameValid) { setErrorText('Input last name'); }
      else if (!isEmailValid) { setErrorText('Invalid email address'); }
      else if (!isAddress1Valid) { setErrorText('Input address line 1'); }
      else if (!isCityValid) { setErrorText('Input city'); }
      else if (!isStateValid) { setErrorText('Select state'); }
      else if (!isZipCodeValid) { setErrorText('Zip code must be 5 digits'); }
      else { 
        setFormValid(true); 
        return updatedFormData;
      }

      setFormValid(false);
      return updatedFormData;
    });
  };

  const fields = [
    { type: "text", text: "First Name: ", id: "firstname", value: formData.firstname, required: true },
    { type: "text", text: "Last Name: ", id: "lastname", value: formData.lastname, required: true },
    { type: "email", text: "Email: ", id: "email", value: formData.email, required: true },
    { type: "text", text: "Address Line 1: ", id: "address1", value: formData.address1, required: true },
    { type: "text", text: "Address Line 2: ", id: "address2", value: formData.address2, required: false },
    { type: "text", text: "City: ", id: "city", value: formData.city, required: true },
    { type: "state", text: "State: ", id: "state", value: formData.state, required: true },
    { type: "text", text: "ZIP Code: ", id: "zipCode", value: formData.zipCode, required: true },
  ]

  return (
    <div>
      <NavBar/>
      <div className={appStyles.App}>
        <MediumLogoHeader title={"Shipping Info"}/>
        <RequiredFieldDesignator />

        <Form onSubmit={navigateBillingPage}>
          {fields.map(field => (
            <FormField
              key={field.id}
              type={field.type}
              text={field.text}
              id={field.id}
              value={field.value}
              onChange={handleChange}
              required={field.required}
              maxLength={100}
              disabled={gettingShippingCost}
            />
          ))}

          <GeneralButton
            type="submit"
            disabled={!formValid || gettingShippingCost}
            text={gettingShippingCost ? 
              <>Processing<LoadingDots/></> : 
              formValid ?
              "Go To Billing" : 
              errorText
            }
          />
        </Form>
      </div>
    </div>
  );
}

export default Order;