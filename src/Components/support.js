import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { backendURL } from './Constants';
import mediumLogo from './medium-logo.png';
import NavBar from './navBar';

function Support() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const savedFormData = sessionStorage.getItem('supportFormData');
    return savedFormData ? JSON.parse(savedFormData) : {
      firstName: '',
      lastName: '',
      email: '',
      orderNumber: '',
      message: ''
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission

  useEffect(() => {
    sessionStorage.setItem('supportFormData', JSON.stringify(formData));
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
    setIsSubmitting(true); // Set isSubmitting to true when form is being submitted
    const subject = `Collage Creations Support`;
    const message = `Thank you for reaching out to Collage Creations. We will do our best to get back to you within the next 48 hours.\n\n\n--Original Message--\n\nFirst Name: ${formData.firstName}\nLast Name: ${formData.lastName}\nEmail: ${formData.email}\nOrder Number: ${formData.orderNumber}\nMessage: ${formData.message}`;
    const email = formData.email

    try {
      const response = await fetch(`${backendURL}api/send-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message, email }),
      });
  
      if (response.ok) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          orderNumber: '',
          message: ''
        });
        navigate('/message-confirmation/', {
          state: { email: email }
        })
      } else {
        const errorMessage = await response.text();
        alert(`Failed to send message: ${errorMessage}`);
      }
    } catch (error) {
      alert('An error occurred while sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false); // Set isSubmitting back to false after form submission is completed
    }
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
            <h1>Support Page</h1>
          </div>
        </header>
          
        <p className="required-note" style={{ fontSize: 18, marginTop: -30, color: 'red' }}>*Required field</p>

        <form onSubmit={handleSubmit} className="support-form" style={{ marginTop: -35 }}>
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
            <label htmlFor="orderNumber">Order Number: </label>
            <input type="text" id="orderNumber" name="orderNumber" value={formData.orderNumber} onChange={handleChange} />
          </div>

          <div className="form-group">
            <span className="required-asterisk">*</span> 
            <label htmlFor="message">Message: </label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} required style={{ width: '30%' }} />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit"}
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default Support;
