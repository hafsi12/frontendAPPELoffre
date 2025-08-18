const API_URL = "http://localhost:8080/api/auth"

class AuthService {
  login(username, password) {
    return fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid credentials")
        }
        return response.json()
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("user", JSON.stringify(data))
        }
        return data
      })
  }

  logout() {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  register(userData) {
    return fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(userData),
    })
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
        return null
      }
    }
    return null
  }

  getAuthToken() {
    const user = this.getCurrentUser()
    return user?.token
  }

  isAuthenticated() {
    const user = this.getCurrentUser()
    return !!user?.token
  }

  hasRole(role) {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  hasAnyRole(roles) {
    const user = this.getCurrentUser()
    return roles.includes(user?.role)
  }

  // Vérifications de permissions spécifiques
  isAdmin() {
    return this.hasRole("ADMIN")
  }

  getUserRole() {
    const user = this.getCurrentUser()
    return user?.role || null
  }

  canAccessClients() {
    return this.hasAnyRole(["ADMIN", "GESTION_CLIENTS_OPPORTUNITES", "GESTION_OFFRES", "GESTION_CONTRATS"])
  }

  canAccessOpportunities() {
    return this.hasAnyRole(["ADMIN", "GESTION_CLIENTS_OPPORTUNITES", "GESTION_OFFRES", "GESTION_CONTRATS"])
  }

  canAccessOffers() {
    return this.hasAnyRole(["ADMIN", "GESTION_CLIENTS_OPPORTUNITES", "GESTION_OFFRES", "GESTION_CONTRATS"])
  }

  canAccessContracts() {
    return this.hasAnyRole(["ADMIN", "GESTION_CLIENTS_OPPORTUNITES", "GESTION_OFFRES", "GESTION_CONTRATS"])
  }
  canAccessWonOffers() {
    return this.hasAnyRole(["ADMIN", "GESTION_OFFRES", "GESTION_CONTRATS"])
  }

  // Permissions de modification (pour différencier lecture/écriture)
  canModifyClients() {
    return this.hasAnyRole(["ADMIN", "GESTION_CLIENTS_OPPORTUNITES"])
  }

  canModifyOpportunities() {
    return this.hasAnyRole(["ADMIN", "GESTION_CLIENTS_OPPORTUNITES"])
  }

  canModifyOffers() {
    return this.hasAnyRole(["ADMIN", "GESTION_OFFRES"])
  }

  canModifyContracts() {
    return this.hasAnyRole(["ADMIN", "GESTION_CONTRATS"])
  }

  // Permissions de lecture (tous peuvent voir pour les statistiques)
  canViewClients() {
    return this.isAuthenticated()
  }

  canViewOpportunities() {
    return this.isAuthenticated()
  }

  canViewOffers() {
    return this.isAuthenticated()
  }

  canViewContracts() {
    return this.isAuthenticated()
  }

  // Permissions administratives
  canManageUsers() {
    return this.isAdmin()
  }

  canAccessAdminPanel() {
    return this.isAdmin()
  }

  canViewAllData() {
    return this.isAdmin()
  }

  canExportData() {
    return this.isAdmin()
  }

  canManageSystem() {
    return this.isAdmin()
  }

  // Permissions spécifiques par module
  canCreateClient() {
    return this.canModifyClients()
  }

  canUpdateClient() {
    return this.canModifyClients()
  }

  canDeleteClient() {
    return this.canModifyClients()
  }

  canArchiveClient() {
    return this.canModifyClients()
  }

  canCreateOpportunity() {
    return this.canModifyOpportunities()
  }

  canUpdateOpportunity() {
    return this.canModifyOpportunities()
  }

  canDeleteOpportunity() {
    return this.canModifyOpportunities()
  }

  canCreateOffer() {
    return this.canModifyOffers()
  }

  canUpdateOffer() {
    return this.canModifyOffers()
  }

  canDeleteOffer() {
    return this.canModifyOffers()
  }

  canCreateContract() {
    return this.canModifyContracts()
  }

  canUpdateContract() {
    return this.canModifyContracts()
  }

  canDeleteContract() {
    return this.canModifyContracts()
  }

  // Méthodes utilitaires
  getUserInfo() {
    const user = this.getCurrentUser()
    if (!user) return null

    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      fullName: `${user.firstName} ${user.lastName}`,
      displayRole: this.getRoleDisplayName(),
    }
  }

  getRoleDisplayName() {
    const user = this.getCurrentUser()
    if (!user?.role) return "Aucun rôle"

    switch (user.role) {
      case "ADMIN":
        return "Administrateur"
      case "GESTION_CLIENTS_OPPORTUNITES":
        return "Gestion Clients & Opportunités"
      case "GESTION_OFFRES":
        return "Gestion des Offres"
      case "GESTION_CONTRATS":
        return "Gestion des Contrats"
      default:
        return user.role.replace("GESTION_", "").replace("_", " ")
    }
  }

  getRoleColor() {
    const user = this.getCurrentUser()
    if (!user?.role) return "secondary"

    switch (user.role) {
      case "ADMIN":
        return "warning"
      case "GESTION_CLIENTS_OPPORTUNITES":
        return "info"
      case "GESTION_OFFRES":
        return "success"
      case "GESTION_CONTRATS":
        return "secondary"
      default:
        return "secondary"
    }
  }

  getPermissionsSummary() {
    if (!this.isAuthenticated()) return null

    return {
      role: this.getCurrentUser()?.role,
      displayName: this.getRoleDisplayName(),
      permissions: {
        clients: {
          view: this.canViewClients(),
          modify: this.canModifyClients(),
        },
        opportunities: {
          view: this.canViewOpportunities(),
          modify: this.canModifyOpportunities(),
        },
        offers: {
          view: this.canViewOffers(),
          modify: this.canModifyOffers(),
        },
        contracts: {
          view: this.canViewContracts(),
          modify: this.canModifyContracts(),
        },
        admin: {
          isAdmin: this.isAdmin(),
          canManageUsers: this.canManageUsers(),
          canManageSystem: this.canManageSystem(),
        },
      },
    }
  }

  // Méthode pour vérifier si le token est expiré
  isTokenExpired() {
    const user = this.getCurrentUser()
    if (!user?.token) return true

    try {
      const payload = JSON.parse(atob(user.token.split(".")[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      console.error("Error checking token expiration:", error)
      return true
    }
  }

  // Méthode pour rafraîchir automatiquement le token si nécessaire
  checkTokenValidity() {
    if (this.isTokenExpired()) {
      this.logout()
      return false
    }
    return true
  }

  // Méthode pour obtenir les headers d'authentification
  getAuthHeaders() {
    const token = this.getAuthToken()
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        }
  }

  // Méthode pour faire des requêtes authentifiées
  async authenticatedRequest(url, options = {}) {
    if (!this.checkTokenValidity()) {
      throw new Error("Session expirée")
    }

    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  // Méthodes pour la gestion des erreurs d'authentification
  handleAuthError(error) {
    if (error.status === 401 || error.status === 403) {
      this.logout()
      return true
    }
    return false
  }

  // Méthode pour debug - à supprimer en production
  debugPermissions() {
    if (process.env.NODE_ENV === "development") {
      console.log("=== DEBUG PERMISSIONS ===")
      console.log("User:", this.getCurrentUser())
      console.log("Permissions Summary:", this.getPermissionsSummary())
      console.log("========================")
    }
  }
}

const authService = new AuthService()
export default authService
