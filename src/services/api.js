import axios from "axios"
import authService from "./authService"

const API_BASE_URL = "http://localhost:8080/api"

// Créer une instance Axios avec la configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for large file uploads
})

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = authService.getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log("🔑 Token ajouté à la requête:", token.substring(0, 20) + "...")
    } else {
      console.warn("⚠️ Aucun token d'authentification trouvé")
    }
    return config
  },
  (error) => {
    console.error("❌ Erreur dans l'intercepteur de requête:", error)
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse API réussie: ${response.config.url} ${response.status}`)
    return response
  },
  (error) => {
    console.error(`❌ Erreur API: ${error.config?.url} ${error.response?.status}`, error.response?.data)

    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      console.warn("🔒 Session expirée, redirection vers la page de connexion")
      authService.logout()
      window.location.href = "/login"
    }

    // Gérer les erreurs d'autorisation
    if (error.response?.status === 403) {
      console.warn("🚫 Accès refusé - Permissions insuffisantes")
    }

    return Promise.reject(error)
  },
)

// Method to check if the backend server is accessible
const checkServerConnection = async () => {
  try {
    console.log("🔍 Checking server connection...")
    const response = await api.get("/offres", { timeout: 5000 })
    console.log("✅ Server connection successful")
    return true
  } catch (error) {
    console.error("❌ Server connection failed:", error.message)
    return false
  }
}

// Method to handle multipart uploads with proper headers
const postMultipart = async (url, formData) => {
  try {
    console.log("📤 Sending multipart request to:", url)
    const response = await api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds for large file uploads
    })
    return response
  } catch (error) {
    console.error("❌ Multipart upload failed:", error.message)
    throw error
  }
}

api.checkServerConnection = checkServerConnection
api.postMultipart = postMultipart

export default api
