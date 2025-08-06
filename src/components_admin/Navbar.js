"use client"
import { Link, useNavigate } from "react-router-dom"
import authService from "../services/authService"

const Navbar = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  if (!authService.isAuthenticated()) {
    return null
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin">
          <img src="/1.png" alt="Terragis" height="40" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </Link>
            </li>

            {authService.canAccessClients() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/clients">
                  <i className="fas fa-users me-2"></i>
                  Clients
                </Link>
              </li>
            )}

            {authService.canAccessOpportunities() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/opportunities">
                  <i className="fas fa-lightbulb me-2"></i>
                  Opportunités
                </Link>
              </li>
            )}

            {authService.canAccessOffers() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/offers">
                  <i className="fas fa-file-invoice me-2"></i>
                  Offres
                </Link>
              </li>
            )}

            {authService.canAccessContracts() && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/contracts">
                  <i className="fas fa-file-contract me-2"></i>
                  Contrats
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-user me-2"></i>
                {user?.username}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">
                      Rôle:{" "}
                      {user?.role === "ADMIN"
                        ? "Administrateur"
                        : user?.role?.replace("GESTION_", "").replace("_", " ")}
                    </small>
                  </span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Déconnexion
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
