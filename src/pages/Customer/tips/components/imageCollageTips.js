import React from "react"
import styles from '../tips.module.css';

const ImageCollageTips = () => {
    const string1 = "1. Ensure you can see good detail in the subjects of your main/large image."
    const string2 = "2. Choose 35-100 small images. Too few and you won't see enough detail and too many will take the server a long time to create the output image."
    const string3 = "3. Ensure there is some darkness variation in your small images. If the images are all light or all dark, you won't see good detail in the main image."
    const string4 = "4. Choose your size before you choose the main image, otherwise you'll have to upload the main image again."

    return (
        <div>
            <p className={styles.tipText}>{string1}</p>
            <p className={styles.tipText}>{string2}</p>
            <p className={styles.tipText}>{string3}</p>
            <p className={styles.tipText}>{string4}</p>
        </div>
    )
}

export default ImageCollageTips;