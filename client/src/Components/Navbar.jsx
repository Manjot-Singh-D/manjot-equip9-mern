import React, { useEffect, useState } from "react";
import "../styles/style.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Navbar
const Navbar = ({ handleLogout }) => {
  const location = useLocation();
  const [page, setPage] = useState("");

  // On Url Changes set the state page
  useEffect(() => {
    const pathname = location.pathname;
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    setPage(lastSegment);
  }, [location.pathname]);

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ padding: "1rem 0rem" }}>
        <div
          className="container-fluid"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            className="mr-0 ml-auto"
            id="navbarText"
            style={{ marginRight: "1rem" }}
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            {page !== "register" && (
              <Link to="/register">
                <span className="navbar-text">Register</span>
              </Link>
            )}
            {page !== "login" && (
              <Link to="/login">
                <span className="navbar-text">Login</span>
              </Link>
            )}

            {page !== "login" && page !== "register" && (
              <span
                className="navbar-text"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                Logout
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
