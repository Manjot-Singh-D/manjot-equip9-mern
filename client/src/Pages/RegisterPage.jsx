import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../store/authSlice";
import "../styles/style.css";
import Toast from "../Components/Toast";
import PhotoInput from "../Components/PhotoInput";

const RegisterPage = () => {
  const [registerDetails, setRegisterDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });
  const [validate, setValidate] = useState({
    firstName: true,
    lastName: true,
    phone: true,
    password: true,
    photo: true,
  });
  const [toast, setToast] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 2000);
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
  const isFirstNameValid = (firstName) => {
    if (firstName === "") {
      setValidate((validate) => {
        return { ...validate, ["firstName"]: false };
      });
      return false;
    } else {
      setValidate((validate) => {
        return { ...validate, ["firstName"]: true };
      });
      return true;
    }
  };
  const isLastNameValid = (lastName) => {
    if (lastName === "") {
      setValidate((validate) => {
        return { ...validate, ["lastName"]: false };
      });
      return false;
    } else {
      setValidate((validate) => {
        return { ...validate, ["lastName"]: true };
      });
      return true;
    }
  };
  const isPhotoValid = (photo) => {
    if (!photo) {
      setValidate((validate) => {
        return { ...validate, ["photo"]: false };
      });
      return false;
    } else {
      setValidate((validate) => {
        return { ...validate, ["photo"]: true };
      });
      return true;
    }
  };
  const submitRegister = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("firstName", registerDetails.firstName);
    formData.append("lastName", registerDetails.lastName);
    formData.append("phone", registerDetails.phone);
    formData.append("password", registerDetails.password);

    const photoValid = isPhotoValid(photo);
    const phoneValid = isPhoneValid(registerDetails.phone);
    const passwordValid = isPasswordValid(registerDetails.password);
    const firstNameValid = isFirstNameValid(registerDetails.firstName);
    const lastNameValid = isLastNameValid(registerDetails.lastName);
    if (
      photoValid &&
      phoneValid &&
      passwordValid &&
      firstNameValid &&
      lastNameValid
    ) {
      dispatch(register(formData));
    }
  };
  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterDetails((registerDetails) => {
      return { ...registerDetails, [name]: value };
    });
  };
  return (
    <div>
      {toast && <Toast message={"Error in Registering"} />}
      <form className="m-auto mt-3" style={{ width: "500px" }}>
        <div className="form-group">
          {/* <input type="file" name="photo" onChange={handlePhotoChange} /> */}
          <PhotoInput
            handlePhotoChange={handlePhotoChange}
            photoUrl={previewUrl}
            photoName="photo"
            additionalDetails={{from: "regPage"}}
          />
          <small
            id="photoHelp"
            className="form-text position-absolute invalidText"
          >
            {!validate.photo && "* Invalid Photo"}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="Enter first name"
            name="firstName"
            value={registerDetails.firstName}
            onChange={handleChange}
          />
          <small
            id="firstNameHelp"
            className="form-text position-absolute invalidText"
          >
            {!validate.firstName && "* Invalid First Name"}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Enter last name"
            name="lastName"
            value={registerDetails.lastName}
            onChange={handleChange}
          />
          <small
            id="lastNameHelp"
            className="form-text position-absolute invalidText"
          >
            {!validate.lastName && "* Invalid Last Name"}
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            placeholder="Enter Phone Number"
            name="phone"
            value={registerDetails.phone}
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            name="password"
            value={registerDetails.password}
            onChange={handleChange}
          />
          <small
            id="passwordHelp"
            className="form-text position-absolute invalidText"
          >
            {!validate.password && "* Invalid Password"}
          </small>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={submitRegister}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
