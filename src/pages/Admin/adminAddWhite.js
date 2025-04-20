import React, { useState } from 'react';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import { useNavigate } from 'react-router-dom';
import GeneralButton from '../../components/generalButton/generalButton';
import HeaderSection from '../../components/headerSection';
import ImageUpload from '../../components/imageUpload/imageUpload';
import addWhiteService from '../../services/AddWhiteService';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';
import appStyles from '../../App.module.css';


function AdminAddWhite() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { userToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      let url = URL.createObjectURL(file);
      setSelectedImageUrl(url);
      setSelectedFile(file);
      setImageUrl(null);
    }
  };

  const handleAddWhiteSpace = async () => {
    if (!selectedFile) {
      toastRef.current('Please select a file first.');
      return;
    }

    if (!userToken) {
      navigate('/admin/login');
    }

    setUpdating(true);
  
    try {
      const img = await addWhiteService(selectedFile, userToken);
      setImageUrl(img);
      setSelectedImageUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error adding white space: ', error);
      toastRef.current("Error occurred")
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <AdminNavBar />
      { updating ?
      <LoadingScreen/>
      :
      <div className={appStyles.App}>
        <HeaderSection
          title='Add White'
          fontWeight='bold'
          fontSize={32}
          marginBottom={20}
        />

        <ImageUpload
          id="image-upload"
          title="Choose Image"
          onChange={handleFileChange}
          disabled={updating}
        />

        {selectedImageUrl ?
        <div style={{ justifyContent: 'center' }}>
          <img src={selectedImageUrl} alt="Collage" style={{ width: '25%', height: 'auto' }} />
        </div>
        :
        <div/>
        }

        {selectedFile &&
        <div>
          <GeneralButton
            onClick={handleAddWhiteSpace}
            text={"Add White Space"}
            disabled={updating}
          />
        </div>
        }

        {imageUrl ?
        <div style={{ justifyContent: 'center' }}>
          <img src={imageUrl} alt="Collage" style={{ width: '70%', height: 'auto' }} />
        </div>
        :
        <div/>
        }
      </div>
      }
    </div>
  );
}

export default AdminAddWhite;
