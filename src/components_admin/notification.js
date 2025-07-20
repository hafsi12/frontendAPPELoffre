import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Assurez-vous que Bootstrap est importé
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/dashboard.css"; // Importer le fichier CSS

function Notification() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [activeModalId, setActiveModalId] = useState(null);
  const [destinataire, setDestinataire] = useState("");
  const [objet, setObjet] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Message 1", visible: true, isRead: false },
    { id: 2, message: "Message 2", visible: true, isRead: false },
    { id: 3, message: "Message 3", visible: true, isRead: false },
  ]);
  const [deleteId, setDeleteId] = useState(null);

  const getButtonStyle = (buttonId) => ({
    minWidth: "80px",
    backgroundColor: hoveredButton === buttonId ? "#ECECEC" : "white",
    fontFamily: "corbel",
  });

  const toggleModal = (modalId) => {
    setActiveModalId(activeModalId === modalId ? null : modalId);
  };

  const handleReplyClick = (name, message) => {
    setDestinataire(name);
    setObjet(message);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleDelete = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === deleteId
          ? { ...notification, visible: false }
          : notification
      )
    );
    toggleModal("modal1"); // Fermer le modal
    setDeleteId(null); // Réinitialiser l'ID à supprimer
  };

  return (
    <div
      className="d-flex flex-row p-3 align-items-start"
      style={{ backgroundColor: "white" }}
    >
      {/* Nouveau Message */}
      <div
        className="d-flex flex-column p-3 justify-content-center align-items-center me-5"
        style={{ backgroundColor: "white", width: "45%" }}
      >
        {/* Header */}
        <div
          className="rounded-3 p-3 d-flex shadow-lg justify-content-between"
          style={{
            background:
              "linear-gradient(to right,rgba(4, 4, 4, 0.77),rgba(4, 4, 4, 0.77), rgba(45, 79, 39, 0.77), rgba(96, 54, 39, 0.77))",
            width: "85%",
            marginBottom: "-40px",
            zIndex: 1,
          }}
        >
          <h4 style={{ color: "white", fontFamily: "corbel" }}>
            Nouvelle Annonce
          </h4>
          <button
            className="d-flex p-3 pt-0 pb-0 btn btn-sm rounded-4 justify-content-center align-items-center me-2"
            style={{ backgroundColor: "white" }}
          >
            <i
              className="fa-solid fa-share me-3"
              style={{ color: "#008080" }}
            ></i>
            Envoyer
          </button>
        </div>

        {/* Contenu */}
        <div
          className=" d-flex flex-column p-3 w-100 rounded-3  shadow mb-4 "
          style={{ backgroundColor: "white" }}
        >
          <div className="d-flex flex-column w-100 mb-4 pt-3">
            {/* Destinataire */}
            <div className="d-flex rounded-3 shadow p-3 mb-4 mt-5">
              <textarea
                style={{
                  backgroundColor: "white",
                  fontFamily: "corbel",
                  fontSize: "17px",
                }}
                placeholder="Destinataire"
                rows="1"
                value={destinataire}
                onChange={(e) => setDestinataire(e.target.value)}
              ></textarea>
            </div>

            {/* Objet */}
            <div className="d-flex rounded-3 shadow p-3 mb-4">
              <textarea
                style={{
                  backgroundColor: "white",
                  fontFamily: "corbel",
                  fontSize: "17px",
                }}
                placeholder="Objet ..."
                rows="1"
                value={objet}
                onChange={(e) => setObjet(e.target.value)}
              ></textarea>
            </div>

            {/* Message */}
            <div className="d-flex rounded-3 shadow p-3">
              <textarea
                style={{
                  backgroundColor: "white",
                  fontFamily: "corbel",
                  fontSize: "17px",
                }}
                placeholder="Ecrivez un nouveau message ..."
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>

      </div>

      {/* Notifications */}
      <div
        className="d-flex flex-column me-auto pt-3"
        style={{
          backgroundColor: "white",
          width: "50%",
          maxHeight: "84vh",
          overflowY: "auto",
        }}
      >
        <h5 style={{ fontFamily: "dubai", color: "gray" }}>1-10-2025</h5>

        {/* Notifications */}
        {notifications.map(
          (notification) =>
            notification.visible && (
              <div
                key={notification.id}
                className="mb-3 d-flex flex-row me-auto pt-3 w-100"
                style={{ backgroundColor: "white" }}
              >
                <div
                  className="d-flex flex-column w-100"
                  style={{ backgroundColor: "white" }}
                >
                  {/* Icone */}
                  <div
                    className="d-flex justify-content-center align-items-center border rounded-circle p-3"
                    style={{ width: "25px", height: "25px" }}
                  >
                    <i
                      className="fa-solid fa-circle"
                      style={{ fontSize: "13px", color: "rgb(109, 163, 44)" }}
                    ></i>
                  </div>

                  <div className="d-flex flex-column w-100 p-3">
                    {/* Ligne de temps */}
                    <div
                      className="d-flex flex-row pt-3 pb-3 pe-3 p-4 w-100"
                      style={{
                        backgroundColor: "white",
                        borderLeft: "5px solid rgba(197, 203, 198, 0.53)",
                      }}
                    >
                      {/* Message */}
                      <div
                        className="d-flex flex-column rounded-4 justify-content-between shadow p-3 w-100 div-with-border"
                        style={{ backgroundColor: "white" }}
                      >
                        <div
                          className="d-flex flex-row mb-2 justify-content-between"
                          style={{ backgroundColor: "white" }}
                        >
                          <div
                            className="d-flex flex-column mb-2"
                            style={{ backgroundColor: "white" }}
                          >
                            <h6
                              style={{
                                color: notification.isRead
                                  ? "black"
                                  : "rgba(205, 48, 116, 0.85)",
                              }}
                            >
                              GHERABI Noreddine
                            </h6>
                            <span
                              className="mb-3"
                              style={{
                                color: notification.isRead
                                  ? "black"
                                  : "rgba(205, 48, 116, 0.85)",
                              }}
                            >
                              Notes POO-JEE
                            </span>
                          </div>
                          <div className="d-flex">
                            <p style={{ fontFamily: "calibri", color: "gray" }}>
                              7:45 PM
                            </p>
                          </div>
                        </div>

                        {/* Boutons */}
                        <div
                          className="mb-2 rounded-4 p-2 d-flex flex-row justify-content-center align-items-center shadow"
                          style={{ backgroundColor: "white" }}
                        >
                          {/* Répondre */}
                          <button
                            className="btn btn-sm rounded-4 mb-2"
                            style={getButtonStyle("reply")}
                            onMouseEnter={() => setHoveredButton("reply")}
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() =>
                              handleReplyClick(
                                "GHERABI Noreddine",
                                "Notes POO-JEE"
                              )
                            }
                          >
                            <i
                              className="fa-solid fa-reply"
                              style={{ color: "rgba(111, 164, 98, 0.56)" }}
                            ></i>
                          </button>

                          {/* Marquer comme lu */}
                          <button
                            className="btn btn-sm rounded-4 mb-2"
                            style={getButtonStyle("mark")}
                            onMouseEnter={() => setHoveredButton("mark")}
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <i
                              className="fa-duotone fa-solid fa-check"
                              style={{
                                width: "20px",
                                color: "rgb(104, 122, 112,0.56)",
                              }}
                            ></i>
                          </button>

                          {/* Modifier */}
                          <button
                            className="btn btn-sm rounded-4 mb-2"
                            style={getButtonStyle("mod")}
                            onMouseEnter={() => setHoveredButton("mod")}
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => toggleModal("modal2")}
                          >
                            <i
                              className="fa-solid fa-envelope-open"
                              style={{
                                width: "20px",
                                color: "rgb(38, 160, 187,0.56)",
                              }}
                            ></i>
                          </button>

                          {/* Supprimer */}
                          <button
                            className="btn btn-sm rounded-4 mb-2"
                            style={getButtonStyle("delete")}
                            onMouseEnter={() => setHoveredButton("delete")}
                            onMouseLeave={() => setHoveredButton(null)}
                            onClick={() => {
                              setActiveModalId("modal1");
                              setDeleteId(notification.id);
                            }}
                          >
                            <i
                              className="fa-solid fa-trash"
                              style={{
                                width: "20px",
                                color: "rgb(187, 43, 38,0.56)",
                              }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        )}

        {/* Modals */}
        {activeModalId === "modal2" && (
          <div
            className="modal show"
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 3,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4
                    className="modal-title"
                    style={{ fontFamily: "corbel", color: "#C9A13C" }}
                  >
                    Notes POO-JEE
                  </h4>
                </div>
                <div className="modal-body d-flex flex-row align-items-center justify-content-center">
                  <div className="p-1 pt-3 w-100 justify-content-center align-items-center">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th
                            style={{
                              fontFamily: "corbel",
                              color: "rgb(127, 121, 107)",
                            }}
                          >
                            NOM
                          </th>
                          <th
                            style={{
                              fontFamily: "corbel",
                              color: "rgb(127, 121, 107)",
                            }}
                          >
                            PRENOM
                          </th>
                          <th
                            style={{
                              fontFamily: "corbel",
                              color: "rgb(127, 121, 107)",
                            }}
                          >
                            NOTE
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>EL HARKAOUI</td>
                          <td>Chaymae</td>
                          <td>20</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => toggleModal("modal2")}
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => toggleModal("modal2")}
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => toggleModal("modal2")}
                  >
                    Exporter en PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModalId === "modal1" && (
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
                    Suppression du message
                  </h4>
                </div>
                <div className="modal-body">
                  <p>Êtes-vous sûr de vouloir supprimer ce message ?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => toggleModal("modal1")}
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleDelete}
                  >
                    Oui
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
