import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../store/authSlice";
import "../styles/style.css";
import Toast from "../Components/Toast";
const LoginPage = () => {
  const [loginDetails, setLoginDetails] = useState({ phone: "", password: "" });
  const [validate, setValidate] = useState({ phone: true, password: true });
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log("Error");
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 2000);
    }

    if (isSuccess && user?.data) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const allDigits = (phoneNumber) => {
    for (let index = 0; index < phoneNumber.length; index++) {
      if (phoneNumber[index] >= "0" && phoneNumber[index] <= "9") {
        continue;
      } else {
        return false;
      }
    }
    return true;
  };
  const isPhoneValid = (phoneNumber) => {
    if (phoneNumber.length !== 10 || !allDigits(phoneNumber)) {
      setValidate((validate) => {
        return { ...validate, ["phone"]: false };
      });
      return false;
    } else {
      setValidate((validate) => {
        return { ...validate, ["phone"]: true };
      });
      return true;
    }
  };
  const isPasswordValid = (password) => {
    if (password === "") {
      setValidate((validate) => {
        return { ...validate, ["password"]: false };
      });
      return false;
    } else {
      setValidate((validate) => {
        return { ...validate, ["password"]: true };
      });
      return true;
    }
  };
  const submitLogin = (event) => {
    event.preventDefault();
    const phoneValid = isPhoneValid(loginDetails.phone);
    const passwordValid = isPasswordValid(loginDetails.password);
    if (phoneValid && passwordValid) {
      dispatch(login(loginDetails));
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails((loginDetails) => {
      return { ...loginDetails, [name]: value };
    });
  };

  return (
    <>
      {toast && <Toast message={"Error Login"} />}
      <div className="m-auto mt-4" style={{ width: "500px" }}>
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
            <small
              id="phoneHelp"
              className="form-text position-absolute invalidText"
            >
              {!validate.phone && "* Invalid Phone Number"}
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
            <small
              id="passwordHelp"
              className="form-text position-absolute invalidText"
            >
              {!validate.password && "* Invalid Password"}
            </small>
          </div>
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
        <div></div>
      </div>
    </>
  );
};

export default LoginPage;
