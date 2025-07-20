import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/dashboard.css";
import CustomChart from "./customChart";

function Admin_Dashboard_Content() {
  const [selected, setSelected] = useState("");

  const handleSelect = (text) => {
    setSelected(text);
  };

  const data = {
    labels: [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ],
    datasets: [
      {
        label: "Clients",
        data: [20, 35, 50, 40, 65, 75, 36, 50, 45, 60, 55, 70],
        backgroundColor: "rgba(40, 193, 68, 0.32)",
        borderColor: "rgba(75, 192, 192, 0.68)",
        borderWidth: 0,
      },
      {
        label: "Opportunités",
        data: [50, 70, 90, 110, 130, 150, 120, 200, 180, 160, 140, 170],
        backgroundColor: "rgba(9, 98, 241, 0.32)",
        borderColor: "rgba(9, 98, 241, 0.68)",
        borderWidth: 0,
      },
      {
        label: "Offres",
        data: [10, 15, 20, 18, 22, 25, 18, 30, 27, 24, 21, 26],
        backgroundColor: "rgba(195, 35, 160, 0.32)",
        borderColor: "rgba(195, 35, 160, 0.68)",
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="d-flex flex-column p-3 pb-0 flex-grow-1">
      {/* statistics */}
      <div className="d-flex p-3 justify-content-between align-items-center mb-2" style={{ width: "100%", backgroundColor: "white" }}>
        {/* Opportunités */}
        <div className="flex-rows rounded-3 shadow p-3 me-4" style={{ width: "30%", height: "auto", backgroundColor: "white" }}>
          <div className="d-flex flex-row justify-content-between mb-3">
            <div className="d-flex flex-column">
              <h5 className="mb-1" style={{ color: "#C9A13C", fontFamily: "corbel" }}>Total des opportunités</h5>
              <h4 style={{ color: "black", fontFamily: "consolas", fontWeight: "bold" }}>7</h4>
            </div>
            <div className="d-flex flex-row">
              <button className="p-4 pt-1 pb-1 btnn" type="button">
                <div id="container-stars"><div id="stars"></div></div>
                <div id="glow"><div className="circle"></div><div className="circle"></div></div>
                <i className="fa-solid fa-table-cells-large" style={{ width: "20px", color: "white" }}></i>
              </button>
            </div>
          </div>
          <hr className="custom-hr" />
          <div className="d-flex flex-row justify-content-center align-items-center">
            <h6 className="me-2" style={{ color: "green", fontFamily: "segoe print", fontWeight: "bold" }}>+2</h6>
            <h6 style={{ color: "gray", fontFamily: "segoe print" }}>Nouvelles opportunités</h6>
          </div>
        </div>

        {/* Clients */}
        <div className="flex-rows rounded-3 shadow p-3 me-4" style={{ width: "30%", height: "auto", backgroundColor: "white" }}>
          <div className="d-flex flex-row justify-content-between mb-3">
            <div className="d-flex flex-column">
              <h5 className="mb-1" style={{ color: "#C9A13C", fontFamily: "corbel" }}>Total des Clients</h5>
              <h4 style={{ color: "black", fontFamily: "consolas", fontWeight: "bold" }}>123</h4>
            </div>
            <div className="d-flex flex-row">
              <button className="p-4 pt-1 pb-1 btnn" type="button">
                <div id="container-stars"><div id="stars"></div></div>
                <div id="glow"><div className="circle"></div><div className="circle"></div></div>
                <i className="fa-solid fa-user-tie" style={{ width: "20px", color: "white" }}></i>
              </button>
            </div>
          </div>
          <hr className="custom-hr" />
          <div className="d-flex flex-row justify-content-center align-items-center">
            <h6 className="me-2" style={{ color: "green", fontFamily: "segoe print", fontWeight: "bold" }}>+5</h6>
            <h6 style={{ color: "gray", fontFamily: "segoe print" }}>Nouveaux clients</h6>
          </div>
        </div>

        {/* Offres */}
        <div className="flex-rows rounded-3 shadow p-3" style={{ width: "30%", height: "auto", backgroundColor: "white" }}>
          <div className="d-flex flex-row justify-content-between mb-3">
            <div className="d-flex flex-column">
              <h5 className="mb-1" style={{ color: "#C9A13C", fontFamily: "corbel" }}>Total des Offres</h5>
              <h4 style={{ color: "black", fontFamily: "consolas", fontWeight: "bold" }}>786</h4>
            </div>
            <div className="d-flex flex-row">
              <button className="p-4 pt-1 pb-1 btnn" type="button">
                <div id="container-stars"><div id="stars"></div></div>
                <div id="glow"><div className="circle"></div><div className="circle"></div></div>
                <i className="fa-solid fa-user-graduate" style={{ width: "20px", color: "white" }}></i>
              </button>
            </div>
          </div>
          <hr className="custom-hr" />
          <div className="d-flex flex-row justify-content-center align-items-center">
            <h6 className="me-2" style={{ color: "green", fontFamily: "segoe print", fontWeight: "bold" }}>+30</h6>
            <h6 style={{ color: "gray", fontFamily: "segoe print" }}>Nouvelles Offres</h6>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="d-flex p-3 justify-content-center align-items-center justify-content-between mt-auto" style={{ width: "100%", backgroundColor: "white" }}>
        <div className="d-flex flex-column rounded-3 shadow-lg me-4 pb-0" style={{ width: "60%", height: "auto", backgroundColor: "white" }}>
          <div className="d-flex flex-row rounded-3 justify-content-between align-items-center p-3 pb-1 mb-2" style={{ height: "70%", width: "100%", backgroundColor: "white" }}>
            <div className="dropdown p-1 rounded-3">
              <button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="true" style={{ color: "black", backgroundColor: "white" }}>
                {selected || "Choisir une période"}
              </button>
              <ul className="dropdown-menu">
                {data.labels.map((month, index) => (
                  <li key={index}>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSelect(month); }}>{month}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-3 p-4" style={{ height: "30%", width: "100%", backgroundColor: "white" }}>
            <CustomChart data={data} options={options} />
          </div>
        </div>

        <div className="d-flex flex-column rounded-3 shadow-lg p-4 align-items-center" style={{ width: "40%", height: "100%", backgroundColor: "white" }}>
          <h6 className="mb-3" style={{ color: "#008080", fontFamily: "corbel", fontSize: "20px" }}>Visualisez vos données avec la puissance de l'IA</h6>
          <hr className="custom-hr" style={{ width: "100%", height: "4px" }} />
          <div className="d-flex flex-column align-items-center justify-content-center h-100" style={{ backgroundColor: "white" }}>
            <img src="pp.png" alt="chatbot Icon" className="mt-2 mb-3" style={{ width: "100px", height: "auto" }} />
            <h6 className="mb-2" style={{ textAlign: "center", fontFamily: "segoe print" }}>Comment puis-je vous aider ?</h6>
            <img src="plots.png" alt="chatbot Icon" className="mt-2 mb-5" style={{ width: "200px", height: "auto" }} />
          </div>
          <div className="d-flex felx-row w-100 mt-auto">
            <textarea className="form-control pe-2" rows="1" placeholder="Tapez votre message ici..." style={{ border: "1px solid #ccc", borderRadius: "10px", resize: "none" }}></textarea>
            <button className="btn justify-content-center align-items-center rounded-3 ms-2" style={{ backgroundColor: "rgba(195, 179, 35, 0.21)" }}>
              <i className="fa-solid fa-arrow-up" style={{ width: "20px" }}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_Dashboard_Content;
