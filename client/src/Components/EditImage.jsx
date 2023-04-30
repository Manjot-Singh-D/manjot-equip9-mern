import React, { useState } from "react";
import PhotoInput from "./PhotoInput";

const EditImage = ({ imageUrl, edit, setNewPhoto }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  const handlePhotoUpload = (event) => {
    setNewPhoto(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const handleUploadButtonClick = () => {};
  
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative" }}
    >
      {/* <img
        src={previewUrl || imageUrl}
        
        alt="userPhoto"
        height={300}
      /> */}
      <PhotoInput
        className={"card-img-top"}
        handlePhotoChange={handlePhotoChange}
        photoUrl={previewUrl || imageUrl}
        photoName="photo"
      />

      {edit && isHovering && (
        <input
          onClick={handleUploadButtonClick}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          type="file"
          onChange={handlePhotoUpload}
        />
      )}
    </div>
  );
};

export default EditImage;
