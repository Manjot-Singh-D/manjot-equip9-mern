import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "signup", userData, {
    withCredentials: true,
  });

  if (response.data) {
    // console.log("Done !! Registering! : ", response.data);
    // localStorage.setItem("user", JSON.stringify(response.data));
  }

  // return response.data;
  return;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "signin", userData, {
    withCredentials: true,
  });

  if (response.data) {
    // console.log("Done!! Login : ", response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  // console.log("logging out!!");
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
