import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, deleteUser } from "../store/authSlice";
import CardForm from "../Components/cardForm";
import "../styles/style.css";
import PhotoInput from "../Components/PhotoInput";

// Main Page that shows user value
const MainPage = () => {
  const [userDetails, setUserDetails] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [edit, setEdit] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/register");
    }
    if (user?.data) {
      setUserDetails(user.data);
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);
  // Edit details of user
  const editDetails = () => {
    setEdit(true);
  };
  // Called on saving the details
  const saveDetails = (event) => {
    event.preventDefault();
    setEdit(false);
    const formData = new FormData();
    formData.append("photo", newPhoto);
    formData.append("id", userDetails.id);
    formData.append("firstName", userDetails.firstName);
    formData.append("lastName", userDetails.lastName);

    dispatch(
      updateUser({
        id: userDetails.id,
        photo: userDetails.photo,
        formData: formData,
      })
    );
    setNewPhoto(null);
  };
  // Removing a user
  const removeUser = () => {
    dispatch(deleteUser(userDetails));
  };
  // Handle any details change
  const handleDetailsChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((userDetails) => {
      return { ...userDetails, [name]: value };
    });
  };
  // Handle if photo changes
  const handlePhotoChange = (event) => {
    setNewPhoto(event.target.files[0]);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  return (
    <>
      <div className="card m-auto mt-4" style={{ width: "500px" }}>
        <PhotoInput
          handlePhotoChange={handlePhotoChange}
          photoUrl={previewUrl}
          photoName="photo"
          additionalDetails={{
            edit: edit,
            userPhoto: userDetails.photo,
            from: "mainPage",
          }}
        />
        <div className="card-body">
          {edit ? (
            <CardForm
              userDetails={userDetails}
              handleDetailsChange={handleDetailsChange}
              saveDetails={saveDetails}
            />
          ) : (
            <h4 className="card-text">
              {greeting} {userDetails.firstName} {userDetails.lastName}
            </h4>
          )}
          <div className="buttonGroup">
            <button
              onClick={edit ? saveDetails : editDetails}
              className="btn btn-primary"
            >
              {edit ? "Save" : "Edit"}
            </button>
            <button className="btn btn-primary" onClick={removeUser}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
