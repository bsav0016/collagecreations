import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import '../CSS/form.css'
import { backendURL } from '../../Constants';
import mediumLogo from '../Assets/medium-logo.png';
import NavBar from './navBar';


function CustomOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => {
    const savedFormData = sessionStorage.getItem('customFormData');
    return savedFormData ? JSON.parse(savedFormData) : {
      firstName: '',
      lastName: '',
      email: '',
      orderNumber: '',
      message: ''
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = window.navigator.userAgent;
      const isDesktopDevice = userAgent.match(
        /Windows NT|Macintosh|Linux x86_64|Linux i686/
      );
      setIsDesktop(!!isDesktopDevice);
    };

    checkDeviceType();
  })

  useEffect(() => {
    sessionStorage.setItem('customFormData', JSON.stringify(formData));
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
    const subject = `Collage Creations Custom Order`;
    const message = `Thank you for reaching out to Collage Creations regarding a custom order! We will do our best to reply within 48 hours.\n\n\n--Original Message--\n\nFirst Name: ${formData.firstName}\nLast Name: ${formData.lastName}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
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
            <h1>Custom Order</h1>
          </div>
        </header>

        <p style={{ fontSize: 18, marginBottom: -20, ...(isDesktop && { marginTop: -20 }) }}>Please understand that custom orders take longer to process and we will reach out to you directly. If it is something simple, like a different size than what's offered, we will charge extra only if it costs us more to print. If it is something more complicated, we may add a $5-20 charge depending on the complexity of your order.</p>
          
        <p className="required-note" style={{ fontSize: 18, marginBottom: -20, color: 'red' }}>*Required field</p>


        <form onSubmit={handleSubmit} className="aligned-form">
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
              <label htmlFor="message">Order Request: </label>
            </div>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} required style={{ width: '30%' }} />
          </div>

          <button className='general-button' style={{ alignSelf: 'center' }} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit"}
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default CustomOrder;
