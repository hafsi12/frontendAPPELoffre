import { Navigate } from "react-router-dom"
import authService from "../services/authService"

const ProtectedRoute = ({ children, requiredPermission }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Si une permission spécifique est requise
  if (requiredPermission) {
    let hasPermission = false

    switch (requiredPermission) {
      case "clients":
        hasPermission = authService.canAccessClients()
        break
      case "opportunities":
        hasPermission = authService.canAccessOpportunities()
        break
      case "offers":
        hasPermission = authService.canAccessOffers()
        break
      case "contracts":
        hasPermission = authService.canAccessContracts()
        break
      default:
        hasPermission = false
    }

    if (!hasPermission) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger text-center">
            <h4>Accès refusé</h4>
            <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            <p>Votre rôle: {authService.getCurrentUser()?.role}</p>
          </div>
        </div>
      )
    }
  }

  return children
}

export default ProtectedRoute
