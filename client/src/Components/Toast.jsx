import React from "react";
import "../styles/style.css";

const Toast = ({ message }) => {
  return (
    <>
      <div className="toastBox">{message}</div>
    </>
  );
};

export default Toast;
