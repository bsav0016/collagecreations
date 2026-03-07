import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../layout/navBars/navBar';
import MediumLogoHeader from '../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../components/generalButton/generalButton';

function Confirmation(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!location.state?.id) {
      navigate('/');
      return;
    }
    setId(location.state.id);
    setEmail(location.state.email);
    setToken(location.state.token ?? null);
  }, [location.state, navigate]);

  return (
    <div>
      <NavBar />
      {id && (
        <div className="text-center py-5">
          <MediumLogoHeader title="Order Confirmation" />

          <div>
            <label>Your order has been placed!</label> <br />
            <label>Your order number is: {id}.</label> <br />
            <label>A confirmation email has been sent to {email}.</label>
          </div>

          <GeneralButton
            onClick={() => { navigate('/'); }}
            text={'Homepage'}
          />

          {token && (
            <GeneralButton
              onClick={() => navigate(`/download-access/${token}`)}
              text={'Download Your Image'}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Confirmation;
