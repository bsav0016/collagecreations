import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../../layout/navBars/navBar';
import MediumLogoHeader from '../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../components/generalButton/generalButton';
import appStyles from '../../App.module.css';


function MessageConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    try{
      setEmail(location.state.email);
    }
    catch{
      navigate('/');
    }
  }, []);

  return (
    <div>
      <NavBar/>
      <div className={appStyles.App}>
        <MediumLogoHeader title={"Message Confirmation"}/>

        <div style={{ justifyContent: 'center' }}>
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
