import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/dashboard.css";
import { Link } from "react-router-dom";

import Clients from "./Clients";
import Opportunite from "./Opportunite";
import Admin_Dashboard_Content from "./admin_dashboard";
import Chatbot from "./chatbot";
import Module from "./module";
import Offre from "./Offre";
import Notification from "./notification";

const CurrentDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <span style={{ fontFamily: "calibri", fontSize: "16px" }}>
      {dateTime.toLocaleDateString()} -- {dateTime.toLocaleTimeString()}
    </span>
  );
};

function Admin_Menu() {
  const [selectedButton, setSelectedButton] = useState("dashboard");
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const getButtonStyle = (buttonId) => ({
    backgroundColor:
      selectedButton === buttonId
        ? "rgba(4, 4, 4, 0.77)"
        : hoveredButton === buttonId
        ? "#ECECEC"
        : "white",
    color: selectedButton === buttonId ? "white" : "black",
  });

  const renderContent = () => {
    switch (selectedButton) {
      case "dashboard":
        return <Admin_Dashboard_Content />;
      case "clients":
        return <Clients />;
      case "opportunites":
        return <Opportunite />;
      case "deals":
        return <Module />;
      case "offres":
        return <Offre />;
      case "notifications":
        return <Notification />;
      case "chatbot":
        return <Chatbot />;
      default:
        return <Admin_Dashboard_Content />;
    }
  };

  return (
    <div className="d-flex flex-row p-3 pb-3" style={{ backgroundColor: "white" }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column p-3 rounded-4 shadow-lg me-5 pt-4 position-fixed"
        style={{ backgroundColor: "white", height: "96vh", width: "28vh", zIndex: 0 }}
      >
        {/* Logo */}
        <div className="mb-3 d-flex justify-content-center">
          <img src="menu.png" alt="menu Icon" style={{ width: "40px", height: "auto" }} />
        </div>

        {/* Terragis animated text */}
        <div className="text-center mb-2 animate-terragis">
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              color: "green",
              fontSize: "20px",
              fontFamily: "Segoe UI",
              display: "inline-block",
            }}
          >
            Terragis
          </span>
        </div>

        <hr className="custom-hr" />
        <br />

        <ul className="nav nav-pills flex-column mb-4">
          {/* tes boutons */}
          <li className="nav-item mb-2">
            <button
              className="p-3 pt-1 pb-1 btn btn-sm w-100 text-start d-flex align-items-center rounded-4"
              style={getButtonStyle("dashboard")}
              onClick={() => handleButtonClick("dashboard")}
              onMouseEnter={() => setHoveredButton("dashboard")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <i className="fa-solid fa-chalkboard me-3" style={{ width: "20px" }}></i>
              Dashboard
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className="p-3 pt-1 pb-1 btn btn-sm w-100 text-start d-flex align-items-center rounded-4"
              style={getButtonStyle("clients")}
              onClick={() => handleButtonClick("clients")}
              onMouseEnter={() => setHoveredButton("clients")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <i className="fa-solid fa-users me-3" style={{ width: "20px" }}></i>
              Clients
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className="p-3 pt-1 pb-1 btn btn-sm w-100 text-start d-flex align-items-center rounded-4"
              style={getButtonStyle("opportunites")}
              onClick={() => handleButtonClick("opportunites")}
              onMouseEnter={() => setHoveredButton("opportunites")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <i className="fa-solid fa-bullseye me-3" style={{ width: "20px" }}></i>
              Opportunités
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className="p-3 pt-1 pb-1 btn btn-sm w-100 text-start d-flex align-items-center rounded-4"
              style={getButtonStyle("offres")}
              onClick={() => handleButtonClick("offres")}
              onMouseEnter={() => setHoveredButton("offres")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <i className="fa-solid fa-file-signature me-3" style={{ width: "20px" }}></i>
              Offres
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className="p-3 pt-1 pb-1 btn btn-sm w-100 text-start d-flex align-items-center rounded-4"
              style={getButtonStyle("deals")}
              onClick={() => handleButtonClick("deals")}
              onMouseEnter={() => setHoveredButton("deals")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <i className="fa-solid fa-handshake me-3" style={{ width: "20px" }}></i>
              Deals
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className="p-3 pt-1 pb-1 btn btn-sm w-100 text-start d-flex align-items-center rounded-4"
              style={getButtonStyle("notifications")}
              onClick={() => handleButtonClick("notifications")}
              onMouseEnter={() => setHoveredButton("notifications")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <i className="fas fa-bell me-3" style={{ width: "20px" }}></i>
              Facture
            </button>
          </li>
        </ul>

        <hr className="border-dark" />

        <button
          className="p-3 pt-1 pb-1 btn btn-sm w-100 text-start d-flex align-items-center rounded-4"
          style={getButtonStyle("profil")}
          onClick={() => handleButtonClick("profil")}
          onMouseEnter={() => setHoveredButton("profil")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <i className="fa-solid fa-user-large me-3" style={{ width: "20px" }}></i>
          Profil
        </button>

        <hr className="border-dark" />



        <Link
          to="/"
          className="p-3 pt-1 pb-1 btn w-100 d-flex justify-content-center rounded-4 fw-bold cn_btn mt-auto"
          style={{ color: "white" }}
        >
          Home
        </Link>
      </div>

      {/* Content Section */}
      <div
        className="d-flex flex-column p-0 w-100 flex-grow-1"
        id="dashboard_content"
        style={{ backgroundColor: "white", marginLeft: "33vh" }}
      >
        <div className="d-flex p-3 mb-2" style={{ width: "100%", height: "60px", backgroundColor: "white" }}>
          <div className="me-auto">
            <CurrentDateTime />
          </div>
          <div className="ms-auto d-flex flex-row">
            <button
              className="p-3 pt-1 pb-1 btn btn-sm d-flex align-items-center rounded-4"
              style={getButtonStyle("profil2")}
              onMouseEnter={() => setHoveredButton("profil2")}
              onMouseLeave={() => setHoveredButton(null)}
            >

              <i className="fa-solid fa-user-large ms-3" style={{ width: "20px" }}></i>
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default Admin_Menu;
