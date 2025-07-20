import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/dashboard.css"; // Import the CSS file
import PieChart from "./pieChart";

function Module() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [activeModalId, setActiveModalId] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]); // Tracks rows with expanded collapsibles

  const toggleExpandRow = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const getButtonStyle = (buttonId) => ({
    minWidth: "80px",
    backgroundColor: hoveredButton === buttonId ? "#ECECEC" : "white",
    fontFamily: "corbel",
  });

  const toggleModal = (modalId) => {
    setActiveModalId(activeModalId === modalId ? null : modalId);
  };

  {
    /*--------------------------------------------------------------------------*/
  }

  return (
    <div
      className="d-flex flex-column p-3 align-items-center"
      style={{ backgroundColor: "white" }}
    >
      {/*Header Div---------------------------------------------------------------------*/}
      <div
        className="rounded-3 p-3 d-flex shadow-lg  justify-content-between"
        style={{
          background:
            "linear-gradient(to right,rgba(4, 4, 4, 0.77),rgba(4, 4, 4, 0.77), rgba(45, 79, 39, 0.77), rgba(96, 54, 39, 0.77))",
          width: "95%",
          marginBottom: "-40px",
          zIndex: 1,
        }}
      >
        <h4 style={{ color: "white", fontFamily: "corbel" }}>
          Modules & Elements
        </h4>

        <div class="d-flex flex-row">
          {/*ajouter module*/}
          <button
            class="d-flex p-5 pt-0 pb-0 btn btn-sm rounded-4 justify-content-center align-items-center "
            style={{ backgroundColor: "white" }}
            onClick={() => toggleModal("modal5")}
          >
            <i
              className="fa-solid fa-plus me-3"
              style={{ color: " #008080" }}
            ></i>
            Module
          </button>
        </div>
      </div>

      {/*Table Div----------------------------------------------------------------------*/}
      <div
        className="d-flex p-3 flex-column shadow-lg rounded-3 pt-5 w-100 border"
        style={{
          backgroundColor: "white",
          position: "relative",
          zIndex: 0,
        }}
      >
        <div className="p-1 pt-3">
          <table className="table">
            <thead>
              <tr>
                <th style={{ color: "rgb(165, 168, 164)" }}>ID</th>
                <th style={{ color: "rgb(165, 168, 164)" }}>MODULE</th>
                <th style={{ color: "rgb(165, 168, 164)" }}>CLASSE</th>
                <th
                  className="text-center align-middle"
                  style={{ color: "rgb(165, 168, 164)" }}
                >
                  ELEMENTS
                </th>
                <th
                  className="text-center align-middle"
                  style={{ color: "rgb(165, 168, 164)" }}
                >
                  MODIFICATION
                </th>

                <th
                  className="text-center align-middle"
                  style={{ color: "rgb(165, 168, 164)" }}
                >
                  SUPPRESSION
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>G384765</td>
                <td>Java Enterprise Edition</td>
                <td>IID2</td>

                {/*btn show element*/}
                <td className="text-center align-middle">
                  <button
                    className="btn btn-sm rounded-4"
                    style={getButtonStyle("ele")}
                    onMouseEnter={() => setHoveredButton("ele")}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => toggleExpandRow("row1")}
                  >
                    <i
                      className="fa-solid fa-plus"
                      style={{ width: "40px", color: "rgb(60, 201, 192)" }}
                    ></i>
                  </button>
                </td>
                <td className="text-center align-middle">
                  <button
                    className="btn btn-sm rounded-4"
                    style={getButtonStyle("mod")}
                    onMouseEnter={() => setHoveredButton("mod")}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => toggleModal("modal2")}
                  >
                    <i
                      className="fa-solid fa-pen"
                      style={{ width: "20px", color: "rgb(38, 187, 110)" }}
                    ></i>
                  </button>
                </td>

                <td className="text-center align-middle">
                  <button
                    className="btn btn-sm rounded-4"
                    style={getButtonStyle("sup")}
                    onMouseEnter={() => setHoveredButton("sup")}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => toggleModal("modal3")}
                  >
                    <i
                      className="fa-solid fa-trash"
                      style={{ width: "20px", color: "red" }}
                    ></i>
                  </button>
                </td>
              </tr>

              {/* Collapsible 1 Section to show elements*/}
              {expandedRows.includes("row1") && (
                <tr>
                  <td colSpan="6">
                    <div
                      className="p-1 rounded-3"
                      style={{
                        borderColor: "rgba(83, 81, 71, 0.47)",
                        borderWidth: "2px",
                        borderStyle: "solid",
                      }}
                    >
                      {/* Content inside the collapsible */}
                      <div
                        class="p-3 rounded-3 "
                        style={{ backgroundColor: "white" }}
                      >
                        <table class="table">
                          <thead>
                            <tr>
                              <th style={{ color: "rgb(218, 184, 33)" }}>
                                ELEMENT
                              </th>
                              <th style={{ color: "rgb(218, 184, 33)" }}>
                                ENSEIGNANT
                              </th>
                              <th style={{ color: "rgb(218, 184, 33)" }}>
                                MODALITÉ
                              </th>
                              <th
                                className="text-center align-middle"
                                style={{ color: "rgb(218, 184, 33)" }}
                              >
                                MODIFICATION
                              </th>
                              <th
                                className="text-center align-middle"
                                style={{ color: "rgb(218, 184, 33)" }}
                              >
                                SUPRESSION
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="align-middle">POO avancée</td>
                              <td className="align-middle">
                                GHERABI NOREDDINE
                              </td>
                              <td class="d-flex flex-row align-middle">
                                <ul class="list-unstyled">
                                  <li>Projet</li>
                                  <li>TP</li>
                                  <li>Exam</li>
                                </ul>
                                <ul class="list-unstyled ms-3">
                                  <li>:</li>
                                  <li>:</li>
                                  <li>:</li>
                                </ul>

                                <ul class="list-unstyled ms-3">
                                  <li>50%</li>
                                  <li>30%</li>
                                  <li>20%</li>
                                </ul>
                              </td>
                              <td className="text-center align-middle">
                                <button
                                  className="btn btn-sm rounded-4"
                                  style={getButtonStyle("modi")}
                                  onMouseEnter={() => setHoveredButton("modi")}
                                  onMouseLeave={() => setHoveredButton(null)}
                                  onClick={() => toggleModal("modal7")}
                                >
                                  <i
                                    className="fa-solid fa-pen"
                                    style={{
                                      width: "20px",
                                      color: "rgb(176, 173, 163)",
                                    }}
                                  ></i>
                                </button>
                              </td>
                              <td className="text-center align-middle">
                                <button
                                  className="btn btn-sm rounded-4"
                                  style={getButtonStyle("supp")}
                                  onMouseEnter={() => setHoveredButton("supp")}
                                  onMouseLeave={() => setHoveredButton(null)}
                                  onClick={() => toggleModal("modal8")}
                                >
                                  <i
                                    className="fa-solid fa-trash"
                                    style={{
                                      width: "20px",
                                      color: "rgb(176, 173, 163)",
                                    }}
                                  ></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan="100%"
                                style={{ width: "100%" }}
                                className="p-3"
                              >
                                <div
                                  className="d-flex justify-content-center align-items-center p-3 rounded-4"
                                  style={{
                                    backgroundColor: "rgba(129, 116, 74, 0.1)",
                                  }}
                                >
                                  <button
                                    class="d-flex p-5 pt-2 pb-2 btn btn-sm rounded-4 justify-content-center align-items-center "
                                    style={{ backgroundColor: "white" }}
                                    onClick={() => toggleModal("modal9")}
                                  >
                                    <i
                                      className="fa-solid fa-plus me-3"
                                      style={{ color: "rgb(179, 162, 53)" }}
                                    ></i>
                                    Elément
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals ---------------------------------------------------------------------------------------------*/}

      {/*Modification-----------------------*/}
      {activeModalId === "modal2" && (
        <div
          className="modal show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 4,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4
                  className="modal-title"
                  style={{
                    fontFamily: "corbel",
                    color: "rgb(38, 187, 110)",
                  }}
                >
                  Mise à jour
                </h4>
              </div>
              <div className="modal-body">
                <div class="d-flex flex-column p-3">
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInput"
                    placeholder="Nouveau Nom"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal2")}
                >
                  Modifier
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal2")}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Suppression-------------------------------------------------------------------*/}
      {activeModalId === "modal3" && (
        <div
          className="modal show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 5,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4
                  className="modal-title"
                  style={{ fontFamily: "corbel", color: "red" }}
                >
                  Suppression
                </h4>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir retirer ce Module ?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal3")}
                >
                  Retour
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal3")}
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Ajouter Module-------------------------------------------------------------------*/}
      {activeModalId === "modal5" && (
        <div
          className="modal show "
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 3,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header">
                <h4
                  className="modal-title"
                  style={{
                    fontFamily: "corbel",
                    color: " #008080",
                  }}
                >
                  Nouveau Module
                </h4>
              </div>

              <div className="modal-body">
                <div class="d-flex flex-column p-3">
                  <input
                    type="text"
                    className="form-control mb-4"
                    id="exampleInput"
                    placeholder="Intitulé du module "
                  />

                  <select className="form-control mb-4" defaultValue="">
                    <option value="" disabled>
                      Choisissez une filière
                    </option>
                    <option value="IID">IID</option>
                    <option value="GI">GI</option>
                    <option value="GE">GE</option>
                  </select>

                  <select className="form-control" defaultValue="">
                    <option value="" disabled>
                      Choisissez une classe
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal5")}
                >
                  Inserer
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal5")}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Modification-------------------------------------------------------------------*/}
      {activeModalId === "modal7" && (
        <div
          className="modal show "
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 3,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header">
                <h4
                  className="modal-title"
                  style={{
                    fontFamily: "corbel",
                    color: " rgb(218, 184, 33)",
                  }}
                >
                  Mise à jour
                </h4>
              </div>

              <div className="modal-body">
                <div class="d-flex flex-column p-3">
                  <input
                    type="text"
                    className="form-control mb-4"
                    id="exampleInput"
                    placeholder="Nouveau intitulé "
                  />

                  <select className="form-control mb-4" defaultValue="">
                    <option value="" disabled>
                      Choisissez un nouveau enseignant
                    </option>
                    <option value="IID">prof1</option>
                    <option value="GI">prof2</option>
                    <option value="GE">prof3</option>
                  </select>

                  <input
                    type="number"
                    class="form-control mb-4"
                    id="exampleInput"
                    placeholder="Nouveau pourcentage Projet"
                    min="0"
                    max="100"
                    step="1"
                  />

                  <input
                    type="number"
                    class="form-control mb-4"
                    id="exampleInput"
                    placeholder="Nouveau pourcentage TP"
                    min="0"
                    max="100"
                    step="1"
                  />

                  <input
                    type="number"
                    class="form-control mb-4"
                    id="exampleInput"
                    placeholder="Nouveau pourcentage Exam"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal7")}
                >
                  Mettre à jour
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal7")}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Suppression -------------------------------------------------------------------*/}
      {activeModalId === "modal8" && (
        <div
          className="modal show "
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 3,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header">
                <h4
                  className="modal-title"
                  style={{
                    fontFamily: "corbel",
                    color: " red",
                  }}
                >
                  Suppression
                </h4>
              </div>

              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir retirer cet Element ?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal8")}
                >
                  Retour
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal8")}
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*Ajouter Element-------------------------------------------------------------------*/}
      {activeModalId === "modal9" && (
        <div
          className="modal show "
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 3,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content ">
              <div className="modal-header">
                <h4
                  className="modal-title"
                  style={{
                    fontFamily: "corbel",
                    color: " #008080",
                  }}
                >
                  Nouveau Elément
                </h4>
              </div>

              <div className="modal-body">
                <div class="d-flex flex-column p-3">
                  <input
                    type="text"
                    className="form-control mb-4"
                    id="exampleInput"
                    placeholder="Intitulé de l'elément "
                  />

                  <select className="form-control mb-4" defaultValue="">
                    <option value="" disabled>
                      Choisissez un enseignant
                    </option>
                    <option value="IID">IID</option>
                    <option value="GI">GI</option>
                    <option value="GE">GE</option>
                  </select>

                  <input
                    type="number"
                    class="form-control mb-4"
                    id="exampleInput"
                    placeholder="Pourcentage/Module"
                    min="0"
                    max="100"
                    step="1"
                  />

                  <div class="d-flex flex-row">
                    <input
                      type="number"
                      class="form-control me-2"
                      id="exampleInput"
                      placeholder="% Projet"
                      min="0"
                      max="100"
                      step="1"
                    />

                    <input
                      type="number"
                      class="form-control me-2"
                      id="exampleInput"
                      placeholder="% TP"
                      min="0"
                      max="100"
                      step="1"
                    />

                    <input
                      type="number"
                      class="form-control"
                      id="exampleInput"
                      placeholder="% Exam"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal9")}
                >
                  Inserer
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleModal("modal9")}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Module;
