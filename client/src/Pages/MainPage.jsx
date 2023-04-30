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

const MainPage = () => {
  const [userDetails, setUserDetails] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
  });
  const [newPhoto, setNewPhoto] = useState(null);
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
  const handleLogout = () => {
    dispatch(logout({ uid: userDetails.id }));
  };
  return (
    <div>
      <div onClick={handleLogout}>Logout</div>
      <div className="card" style={{ width: "45%" }}>
        <EditImage
          imageUrl={userDetails.photo}
          edit={edit}
          setNewPhoto={setNewPhoto}
        />
        <div className="card-body">
          {/* <h5 className="card-title">Card title</h5> */}
          {edit ? (
            <CardForm
              userDetails={userDetails}
              handleDetailsChange={handleDetailsChange}
              saveDetails={saveDetails}
            />
          ) : (
            <p className="card-text">
              {greeting} {userDetails.firstName} {userDetails.lastName}
            </p>
          )}
          <div>
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
    </div>
  );
};

export default MainPage;
