import React from 'react';
import styles1 from './imageUpload.module.css';
import styles2 from '../generalButton/generalButton.module.css';
import { MARGINS } from '../../utils/constants/constants';

const ImageUpload = ({ id, title, onChange, disabled = false, multiple = false }) => (
  <div>
    <label 
        style={{ 
          margin: MARGINS.SMALL, 
          backgroundColor: disabled ? '#cccccc' : '',
          color: disabled ? '#666666' : '',
          cursor: disabled ? 'not-allowed' : 'pointer' 
        }}
        htmlFor={id} 
        className={styles2.generalButton}
        disabled={disabled}
    >
      {title}
    </label>
    <input
        className={styles1.imageUploadInput}
        type="file"
        id={id}
        onChange={onChange}
        accept="image/*" 
        disabled={disabled} 
        multiple={multiple}
    />
  </div>
);

export default ImageUpload;