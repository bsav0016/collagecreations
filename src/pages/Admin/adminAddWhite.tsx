import React, { useState, ChangeEvent } from 'react';
import AdminNavBar from '../../layout/navBars/adminNavBar';
import { useNavigate } from 'react-router-dom';
import GeneralButton from '../../components/generalButton/generalButton';
import HeaderSection from '../../components/headerSection';
import ImageUpload from '../../components/imageUpload/imageUpload';
import addWhiteService from '../../services/AddWhiteService';
import LoadingScreen from '../../components/loadingScreen/loadingScreen';
import { toastRef } from '../../context/toastContext/toastContext';
import { useAuth } from '../../context/authContext';

function AdminAddWhite(): React.ReactElement {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userToken } = useAuth();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImageUrl(url);
      setSelectedFile(file);
      setImageUrl(null);
    }
  };

  const handleAddWhiteSpace = async (): Promise<void> => {
    if (!selectedFile) {
      toastRef.current?.('Please select a file first.');
      return;
    }

    if (!userToken) {
      navigate('/admin/login');
      return;
    }

    setUpdating(true);
  
    try {
      const img = await addWhiteService(selectedFile, userToken);
      setImageUrl(img);
      setSelectedImageUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error adding white space: ', error);
      toastRef.current?.("Error occurred");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <AdminNavBar />
      {updating ? (
        <LoadingScreen />
      ) : (
        <div className="text-center py-5">
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

          {selectedImageUrl && (
            <div className="flex justify-center">
              <img src={selectedImageUrl} alt="Collage" className="w-1/4 h-auto" />
            </div>
          )}

          {selectedFile && (
            <div>
              <GeneralButton
                onClick={handleAddWhiteSpace}
                text={"Add White Space"}
                disabled={updating}
              />
            </div>
          )}

          {imageUrl && (
            <div className="flex justify-center">
              <img src={imageUrl} alt="Collage" className="w-[70%] h-auto" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminAddWhite;
