import React from "react";
import "../styles/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

// PhotoInput that inputs photo from user and set its preview
const PhotoInput = ({
  photoUrl,
  photoName,
  handlePhotoChange,
  additionalDetails,
}) => {
  return (
    <>
      <div
        style={{
          width: "400px",
          height: "200px",
          background: "#ffffff",
          margin: "auto",
          position: "relative",
        }}
      >
        <img
          src={
            photoUrl
              ? photoUrl
              : additionalDetails.userPhoto
              ? additionalDetails.userPhoto
              : `https://via.placeholder.com/400x200?text=`
          }
          alt={photoName}
          style={{ width: "100%", height: "100%", position: "absolute" }}
        />
        <input
          id="inputFile"
          type="file"
          name={photoName}
          onChange={handlePhotoChange}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
        {((additionalDetails.from === "mainPage" && additionalDetails.edit) ||
          (additionalDetails.from === "regPage" && !photoUrl)) && (
          <label
            htmlFor="inputFile"
            style={{ width: "100%", height: "100%", position: "absolute" }}
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} /> Upload Image
          </label>
        )}
      </div>
    </>
  );
};

export default PhotoInput;
