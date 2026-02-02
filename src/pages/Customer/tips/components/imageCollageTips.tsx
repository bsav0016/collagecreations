import React from "react";

const ImageCollageTips: React.FC = () => {
    const tips = [
        "Ensure you can see good detail in the subjects of your main/large image.",
        "Choose 35-100 small images. Too few and you won't see enough detail and too many will take the server a long time to create the output image.",
        "Ensure there is some darkness variation in your small images. If the images are all light or all dark, you won't see good detail in the main image.",
        "Choose your size before you choose the main image, otherwise you'll have to upload the main image again."
    ];

    return (
        <ul className="text-left space-y-2">
            {tips.map((tip, index) => (
                <li key={index} className="text-base">{tip}</li>
            ))}
        </ul>
    );
};

export default ImageCollageTips;
