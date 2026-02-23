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
            }}
            htmlFor={id}
            className={`inline-block py-[10px] px-5 border-none rounded-md text-base ${
                disabled 
                    ? "bg-muted text-muted-foreground cursor-not-allowed" 
                    : "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
            }`}
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
