import React from "react";

const SymbolCollageTips: React.FC = () => {
    const tips = [
        "Choosing a word with less characters generally will provide a better overall image.",
        "Understand that the more small images you load, the longer it will take to create the output image, but the better variation you'll get.",
        "Choose whether you want the small images to be scaled slightly larger (Step 3) BEFORE uploading any of your small images. Changing that selection will delete all of your small images due to the way they must be stored on the server."
    ];
    
    return (
        <ol className="text-left space-y-2 list-decimal list-inside">
            {tips.map((tip, index) => (
                <li key={index} className="text-lg">{tip}</li>
            ))}
        </ol>
    );
};

export default SymbolCollageTips;
