import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../layout/navBars/navBar';
import MediumLogoHeader from '../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../components/generalButton/generalButton';

function MessageConfirmation(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    try {
      setEmail(location.state?.email);
    }
    catch {
      navigate('/');
    }
  }, [location.state, navigate]);

  return (
    <div>
      <NavBar />
      <div className="text-center py-5">
        <MediumLogoHeader title={"Message Confirmation"} />

        <div className="flex flex-col justify-center">
          <label>Thank you for reaching out!</label> <br />
          <label>Your message has been received and we will get back to you as soon as possible.</label> <br />
          <label>A confirmation email has been sent to {email}.</label>
        </div>

        <GeneralButton
          onClick={() => navigate('/')}
          text={'Homepage'}
        />
      </div>
    </div>
  );
}

export default MessageConfirmation;
