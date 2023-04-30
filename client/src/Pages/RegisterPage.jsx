import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../store/authSlice";
const RegisterPage = () => {
  const [registerDetails, setRegisterDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // toast.error(message);
    }

    if (isSuccess && user?.data) {
      navigate("/");
    }
    if (isSuccess && !user?.data) {
      navigate("/login");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const submitRegister = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("firstName", registerDetails.firstName);
    formData.append("lastName", registerDetails.lastName);
    formData.append("phone", registerDetails.phone);
    formData.append("password", registerDetails.password);
    // const data = { ...registerDetails, ["formData"]: formData };
    dispatch(register(formData));
  };
  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterDetails((registerDetails) => {
      return { ...registerDetails, [name]: value };
    });
  };
  return (
    <div>
      <div>
        <form>
          <input type="file" name="photo" onChange={handlePhotoChange} />
          <input
            name="firstName"
            type="text"
            value={registerDetails.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            type="text"
            value={registerDetails.lastName}
            onChange={handleChange}
          />
          <input
            name="phone"
            type="tel"
            value={registerDetails.phone}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            value={registerDetails.password}
            onChange={handleChange}
          />
          <button type="submit" onClick={submitRegister}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
