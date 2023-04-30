import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Pages/MainPage";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/authSlice";
import Navbar from "./Components/Navbar";

const App = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!user) {
      // navigate("/register");
    }
    if (user?.data) {
    }
  }, [user, isError, isSuccess, message, dispatch]);

  const handleLogout = () => {
    dispatch(logout({ uid: user.data.id }));
  };
  return (
    <>
      <BrowserRouter>
        <Navbar handleLogout={handleLogout} />
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
