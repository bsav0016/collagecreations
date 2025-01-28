import React from "react";
import styles from '../tips.module.css';

const TextCollageTips = () => {
    const textString1 = "1. Choosing a word with less characters generally will provide a better overall image."
    const textString2 = "2. Understand that the more small images you load, the longer it will take to create the output image, but the better variation you'll get."
    const textString3 = "3. Choose whether you want the small images to be scaled slightly larger (Step 3) BEFORE uploading any of your small images. Changing that selection will delete all of your small images due to the way they must be stored on the server."
    
    return (
        <div>
            <p className={styles.tipText}>{textString1}</p>
            <p className={styles.tipText}>{textString2}</p>
            <p className={styles.tipText}>{textString3}</p>
        </div>
    )
}

export default TextCollageTips;