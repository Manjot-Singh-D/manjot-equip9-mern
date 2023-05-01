import React from "react";
import "../styles/style.css";

// A toast for showing messages at the bottom right
const Toast = ({ message }) => {
  return (
    <>
      <div className="toastBox">{message}</div>
    </>
  );
};

export default Toast;
