"use client"
const Modal = ({ title, color, onClose, children }) => {
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    zIndex: 1000,
    width: "50%",
    maxWidth: "600px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  }
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  }
  const headerStyle = {
    backgroundColor: color || "#007bff",
    color: "white",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px 5px 0 0",
    textAlign: "center",
  }
  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  }
  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2>{title}</h2>
          <button style={closeButtonStyle} onClick={onClose}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </>
  )
}
export default Modal
