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
      style={{ margin: MARGINS.SMALL }}
      htmlFor={id}
      className={`inline-block py-[10px] px-5 text-base rounded-md transition-colors duration-200
        ${
          disabled
            ? "bg-muted text-muted-foreground cursor-not-allowed border border-transparent"
            : "bg-transparent text-primary border border-current hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        }
      `}
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
