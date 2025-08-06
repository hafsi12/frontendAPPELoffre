"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/authService"
import DiagnosticPanel from "./DiagnosticPanel"
import "../styles/login.css"

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await authService.login(credentials.username, credentials.password)
      navigate("/admin")
    } catch (err) {
      console.error("Erreur de connexion:", err)
      setError("Identifiants invalides ou serveur inaccessible. Utilisez le diagnostic pour plus d'informations.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-gray shadow-sm">
        <div className="container-fluid bb">
          <a className="navbar-brand" href="#">
            <img src="1.png" alt="Terragis" height="60" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-flex ms-auto">
              <a href="/" className="btn btn-primary rounded-pill px-5 py-2 me-4 fw-bold cn_btn">
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>
      <br />
      <br />
      <br />
      <section className="login-section">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-5 d-flex justify-content-center" style={{ height: "520px" }}>
              <div className="contact-form-container" style={{ flex: 1 }}>
                <div>
                  <br />
                  <h1 className="tl3_st centered-title">Connexion</h1>
                  <hr />
                  <br />
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                      <br />
                      <button
                        className="btn btn-sm btn-outline-info mt-2"
                        onClick={() => setShowDiagnostic(!showDiagnostic)}
                      >
                        {showDiagnostic ? "Masquer" : "Afficher"} le diagnostic
                      </button>
                    </div>
                  )}
                  <br />
                  <br />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="Entrez votre identifiant"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Entrez votre mot de passe"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <br />
                  <br />
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-5 py-2 me-4 fw-bold cn_btn"
                      style={{ width: "250px" }}
                      disabled={loading}
                    >
                      {loading ? "Connexion..." : "Se connecter"}
                    </button>
                  </div>
                </form>
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    <strong>Comptes de test :</strong>
                    <br />
                    <span className="text-success">admin/admin123 (Administrateur - Accès complet)</span>
                    <br />
                    user1/password123 (Clients & Opportunités)
                    <br />
                    user2/password123 (Offres uniquement)
                    <br />
                    user3/password123 (Contrats uniquement)
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showDiagnostic && <DiagnosticPanel />}
    </div>
  )
}

export default Login
