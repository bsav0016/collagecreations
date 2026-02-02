import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../layout/navBars/navBar';
import MediumLogoHeader from '../../layout/mediumLogoHeader/mediumLogoHeader';
import GeneralButton from '../../components/generalButton/generalButton';
import { processImageString } from '../../utils/modifyImage';

function Confirmation(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [collageImage, setCollageImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    let imageUrl: string | null = null;

    const fetchState = async (): Promise<void> => {
      try {
        setId(location.state?.id);
        setEmail(location.state?.email);
        if (location.state?.collage !== null) {
          const blob = await processImageString(location.state.collage);
          imageUrl = URL.createObjectURL(blob);
          setCollageImage(imageUrl);
        }
      }
      catch (error) {
        imageUrl = null;
        console.log(error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchState();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [location.state, navigate]);

  const downloadImage = (): void => {
    if (collageImage) {
      const a = document.createElement('a');
      a.href = collageImage;
      a.download = 'collage.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div>
      <NavBar />
      {!loading &&
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

          {collageImage && 
            <div>
              <GeneralButton
                onClick={downloadImage}
                text={'Download'}
              />
              <div className="w-4/5 justify-self-center">
                <img src={collageImage} alt="Collage" className="w-full justify-self-center" />
              </div>
            </div>
          }
        </div>
      }
    </div>
  );
}

export default Confirmation;
