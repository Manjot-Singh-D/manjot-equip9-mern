import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../store/authSlice";

const MainPage = () => {
  const [userDetails, setUserDetails] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // console.log(user.data);
    if (!user) {
      navigate("/register");
    }
    if (user?.data) {
      setUserDetails(user.data);
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  
  return (
    <div>
      <div>
        <div onClick={editValues}>Edit</div>
      </div>
      <img src={userDetails.photo} height={300} width={400} />
      <p>firstName : {userDetails.firstName}</p>
      <p>lastName : {userDetails.lastName}</p>
      <p>phone : {userDetails.phone}</p>
    </div>
  );
};

export default MainPage;
