import React from "react";
import "../styles/style.css";

// CardForm shows a form to enter details to edit
const CardForm = ({ userDetails, handleDetailsChange, saveDetails }) => {
  return (
    <div className="cardForm">
      <form onSubmit={saveDetails}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            placeholder="Enter first name"
            value={userDetails.firstName}
            name="firstName"
            onChange={handleDetailsChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            placeholder="Enter last name"
            value={userDetails.lastName}
            name="lastName"
            onChange={handleDetailsChange}
          />
        </div>
      </form>
    </div>
  );
};

export default CardForm;
