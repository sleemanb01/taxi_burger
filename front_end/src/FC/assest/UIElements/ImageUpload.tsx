import Button from "@mui/material/Button";
import imageCompression from "browser-image-compression";
import React, { useEffect, useRef, useState } from "react";

import "../../../styles/css/ImageUpload.css";

export const ImageUpload = ({
  id,
  center = false,
  onInput,
  errorText,
  image,
}: {
  id: string;
  center?: boolean;
  onInput: Function;
  errorText: string;
  image?: string;
}) => {
  const ALLOWED_FILES = ".jpg,.png,.jpeg";

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(
    image || null
  );

  const [isValid, setIsValid] = useState(true);
  const filePickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let pickedFile: File | null = null;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];

      try {
        const compressedFile = await imageCompression(pickedFile, options);

        setFile(compressedFile);
      } catch (error) {
        console.log(error);
      }

      fileIsValid = true;
    } else if (!previewUrl) {
      setIsValid(false);
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current!.click();
  };

  const TXT_PICK_IMAGE = "בחר תמונה";
  const TXT_ASSEST = "נא לבחור תמונה";

  return (
    <div className="form-control">
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept={ALLOWED_FILES}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl as string} alt="Preview" />}
          {!previewUrl && <p>{TXT_ASSEST}</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          {TXT_PICK_IMAGE}
        </Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  );
};
