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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // console.log(message);
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
    // axios
    //   .post("http://localhost:3000/api/auth/signup", registerDetails, {
    //     withCredentials: true,
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     navigate("/login");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    dispatch(register(registerDetails));
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
        <form onSubmit={submitRegister}>
          <input type="file" />
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
