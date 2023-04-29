import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../store/authSlice";

const LoginPage = () => {
  const [loginDetails, setLoginDetails] = useState({ phone: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
      // toast.error(message);
    }

    if (isSuccess && user?.data) {
      console.log(isSuccess, user);
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const submitLogin = (event) => {
    event.preventDefault();

    dispatch(login(loginDetails));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails((loginDetails) => {
      return { ...loginDetails, [name]: value };
    });
  };
  return (
    <div>
      <div>
        <form onSubmit={submitLogin}>
          <input
            name="phone"
            type="tel"
            value={loginDetails.phone}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            value={loginDetails.password}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
