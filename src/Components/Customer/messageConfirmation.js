import React, {useState, useEffect} from 'react';
import '../../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import mediumLogo from '../Assets/medium-logo.png'
import NavBar from './navBar';


function MessageConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    try{
      setEmail(location.state.email);
    }
    catch{
      navigateHome();
    }
  }, []);

  function navigateHome() {
    navigate('/');
  }

  return (
    <div>
      <NavBar/>
      <div className='App'>
        <header className="App-header">
          <div className="header-left">
            <img src={mediumLogo} alt="Medium Logo" className="medium-logo" style={{ width: '80%' }} onClick={navigateHome} />
          </div>
          <div className="header-center">
            <h1>Message Confirmation</h1>
          </div>
        </header>

        <div style={{ justifyContent: 'center' }}>
          <label>Thank you for reaching out!</label> <br />
          <label>Your message has been received and we will get back to you as soon as possible.</label> <br />
          <label>A confirmation email has been sent to {email}.</label>
        </div>

        <div className="clear-button">
          <button className='general-button' onClick={navigateHome}>Homepage</button>
        </div>

      </div>
    </div>
  );
}

export default MessageConfirmation;
