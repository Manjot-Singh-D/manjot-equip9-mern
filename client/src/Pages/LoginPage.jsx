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
      <form onSubmit={submitLogin}>
        <div className="form-group">
          <label htmlFor="phoneNumberInput">Phone Number</label>
          <input
            name="phone"
            type="tel"
            className="form-control"
            id="phoneNumberInput"
            aria-describedby="phoneHelp"
            placeholder="Enter phone"
            value={loginDetails.phone}
            onChange={handleChange}
          />
          <small id="phoneHelp" className="form-text text-muted">
            {/* We'll never share your email with anyone else. */}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="passwordInput">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="passwordInput"
            placeholder="Password"
            value={loginDetails.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Check me out
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div>
        {/* <form onSubmit={submitLogin}>
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
        </form> */}
      </div>
    </div>
  );
};

export default LoginPage;
