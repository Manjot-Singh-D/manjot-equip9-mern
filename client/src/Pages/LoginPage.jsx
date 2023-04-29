import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loginDetails, setLoginDetails] = useState({ phone: "", password: "" });
  const navigate = useNavigate();
  const submitLogin = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/api/auth/signin", loginDetails, {
        withCredentials: true,
      })
      .then((data) => {
        navigate("/");
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
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
