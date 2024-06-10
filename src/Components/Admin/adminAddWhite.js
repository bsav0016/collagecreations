import React, { useState } from 'react';
import { backendURL } from '../../Constants';
import '../../App.css';

function AdminAddWhite() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddWhiteSpace = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('input_image', selectedFile);

    try {
      const response = await fetch(`${backendURL}api/add-white/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        try {
          processImage(data.image);
        } catch {
            alert('Failed processing image');
        }
      } else {
        console.error('Error adding white space:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding white space:', error);
    }
  };

  const processImage = (imageData) => {
    try {
        const decodedData = atob(imageData);
        const bytes = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
            bytes[i] = decodedData.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setImageUrl(imageUrl);
    } catch (error) {
        console.error("Error processing image:", error);
        alert('Could not process image');
    }
  }

  return (
    <div className="App">
      <header className="App-header" style={{ flexDirection: 'column'}}>
        <h1>Add White Space</h1>
        
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div>
          <button className='general-button' style={{ marginTop: 20, marginLeft: '10px' }} onClick={handleAddWhiteSpace}>Add White Space</button>
        </div>
      </header>

      {imageUrl ?
      <div style={{ justifyContent: 'center' }}>
        <img src={imageUrl} alt="Collage" style={{ width: '70%', height: 'auto' }} />
      </div>
      :
      <div/>
      }
    </div>
  );
}

export default AdminAddWhite;
