import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/getUserDetails", {
        withCredentials: true,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        navigate("/register");
      });
  }, []);
  return <div>Main Page</div>;
};

export default MainPage;
