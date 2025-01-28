import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../layout/navBars/navBar';
import MediumLogoHeader from '../../layout/mediumLogoHeader/mediumLogoHeader';
import FormField from '../../components/form/formField';
import Form from '../../components/form/form';
import LoadingDots from '../../components/loadingDots';
import GeneralButton from '../../components/generalButton/generalButton';
import TicketService from '../../services/TicketService';
import RequiredFieldDesignator from '../../components/requiredFieldDesignator/requiredFieldDesignator';
import { toastRef } from '../../context/toastContext/toastContext';
import appStyles from '../../App.module.css';


//TODO: This didn't take me to a confirmation page
function Support({ isCustomOrder }) {
  const navigate = useNavigate();
  const item = isCustomOrder ? 'customFormData' : 'supportFormData'
  const [formData, setFormData] = useState(() => {
    const savedFormData = sessionStorage.getItem(item);
    return savedFormData ? JSON.parse(savedFormData) : {
      firstname: '',
      lastname: '',
      email: '',
      orderNumber: '',
      message: ''
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    sessionStorage.setItem(item, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await TicketService.submitTicket(formData, isCustomOrder);
      const prevEmail = formData.email

      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        orderNumber: '',
        message: ''
      });

      navigate('/message-confirmation/', {
        state: { email: prevEmail }
      });

      sessionStorage.removeItem(item);
    } catch (error) {
      toastRef.current(`${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className={appStyles.App}>
        <MediumLogoHeader title={isCustomOrder ? "Custom Order" : "Support Page"}/>
        <RequiredFieldDesignator />

        <Form onSubmit={handleSubmit}>
          <FormField
            type="text"
            text={"First Name: "}
            id={"firstname"}
            value={formData.firstname}
            onChange={handleChange} 
            required={true}
            disabled={isSubmitting}
            maxLength={100}
          />

          <FormField
            type="text"
            text={"Last Name: "}
            id={"lastname"}
            value={formData.lastname}
            onChange={handleChange} 
            required={true}
            disabled={isSubmitting}
            maxLength={100}
          />

          <FormField
            type="email"
            text={"Email: "}
            id={"email"}
            value={formData.email}
            onChange={handleChange} 
            required={true}
            disabled={isSubmitting}
            maxLength={100}
          />

          {!isCustomOrder &&
          <FormField
            type="text"
            text={"Order Number: "}
            id={"orderNumber"}
            value={formData.orderNumber}
            onChange={handleChange} 
            required={false}
            disabled={isSubmitting}
            maxLength={100}
          />
          }

          <FormField
            type="multilineTextInput"
            text={isCustomOrder ? "Custom Order:" : "Message:"}
            id={"message"}
            value={formData.message}
            onChange={handleChange} 
            required={true}
            disabled={isSubmitting}
            maxLength={5000}
          />

          <GeneralButton
            type={'submit'}
            disabled={isSubmitting}
            text={isSubmitting ? <>Processing<LoadingDots/></> : "Submit"}
          />
        </Form>
      </div>
    </div>
  );
}

export default Support;
