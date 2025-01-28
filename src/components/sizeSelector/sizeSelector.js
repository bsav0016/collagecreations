import React from 'react';
import styles from './sizeSelector.module.css';

const SizeSelector = ({ size, setSize, disabled }) => (
    <select value={size} onChange={(e) => setSize(e.target.value)} className={styles.dropDown} disabled={disabled}>
        <option value="">Size</option>
        <option value="24x24">24x24</option>
        <option value="24x36">24x36</option>
        <option value="36x24">36x24</option>
    </select>
);

export default SizeSelector;