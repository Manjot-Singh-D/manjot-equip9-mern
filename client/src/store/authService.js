import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "signup", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  if (response.data) {
    // localStorage.setItem("user", JSON.stringify(response.data));
  }

  // return response.data;
  return;
};
// Update User
const updateUser = async (updatedValues) => {
  const response = await axios.patch(
    API_URL + "updateUser",
    updatedValues.formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );
  let newData = { ...response.data.data };
  if (response.data) {
    if (!newData.photo) {
      newData = { ...newData, ["photo"]: updatedValues.photo };
    }
    response.data.data = newData;
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};
// Delete User
const deleteUser = async (userDetails) => {
  const response = await axios.delete(API_URL + "deleteUser", {
    params: { userId: userDetails.id },
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  if (response) {
    localStorage.removeItem("user");
  }

  return response.data;
};
// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "signin", userData, {
    withCredentials: true,
  });

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = async (uid) => {
  const response = await axios.post(API_URL + "logout", uid, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  if (response) {
    localStorage.removeItem("user");
  }

  return response.data;
};

const authService = {
  register,
  logout,
  login,
  updateUser,
  deleteUser,
};

export default authService;
