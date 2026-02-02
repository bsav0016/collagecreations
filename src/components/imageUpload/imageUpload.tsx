import React from "react";
import { MARGINS } from "../../utils/constants/constants";

interface ImageUploadProps {
    id: string;
    title: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    id,
    title,
    onChange,
    disabled = false,
    multiple = false,
}) => (
    <div>
        <label
            style={{
                margin: MARGINS.SMALL,
                backgroundColor: disabled ? "#cccccc" : "",
                color: disabled ? "#666666" : "",
                cursor: disabled ? "not-allowed" : "pointer",
            }}
            htmlFor={id}
            className="inline-block py-[10px] px-5 bg-blue-600 text-white border-none rounded-[5px] text-base hover:bg-blue-700"
        >
            {title}
        </label>
        <input
            className="hidden"
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
