import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  reset,
  updateUser,
  deleteUser,
  logout,
} from "../store/authSlice";
import EditImage from "../Components/EditImage";
import CardForm from "../Components/cardForm";
import "../styles/style.css";
import PhotoInput from "../Components/PhotoInput";

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
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
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

  const editDetails = () => {
    setEdit(true);
  };
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
  const removeUser = () => {
    dispatch(deleteUser(userDetails));
  };
  const handleDetailsChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((userDetails) => {
      return { ...userDetails, [name]: value };
    });
  };
  const handlePhotoChange = (event) => {
    setNewPhoto(event.target.files[0]);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  // const handleLogout = () => {
  //   dispatch(logout({ uid: userDetails.id }));
  // };
  return (
    <>
      {/* <div onClick={handleLogout}>Logout</div> */}
      <div className="card m-auto mt-4" style={{ width: "500px" }}>
        {/* <EditImage
          imageUrl={userDetails.photo}
          edit={edit}
          setNewPhoto={setNewPhoto}
        /> */}
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
