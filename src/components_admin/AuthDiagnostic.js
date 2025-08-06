"use client"

import { useState, useEffect } from "react"
import authService from "../services/authService"

const AuthDiagnostic = () => {
  const [diagnosticData, setDiagnosticData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostic = async () => {
      try {
        const token = authService.getAuthToken()
        const user = authService.getCurrentUser()

        const diagnostic = {
          tokenPresent: !!token,
          tokenPrefix: token ? token.substring(0, 20) + "..." : null,
          userPresent: !!user,
          username: user?.username || null,
          roles: user?.roles || [],
          localStorage: {
            token: localStorage.getItem("token") ? "Présent" : "Absent",
            user: localStorage.getItem("user") ? "Présent" : "Absent",
          },
        }

        // Test de l'endpoint de diagnostic
        if (token) {
          try {
            const response = await fetch("http://localhost:8080/api/diagnostic/current-user", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            const serverDiagnostic = await response.json()
            diagnostic.serverResponse = serverDiagnostic
          } catch (error) {
            diagnostic.serverError = error.message
          }
        }

        setDiagnosticData(diagnostic)
      } catch (error) {
        console.error("Erreur diagnostic:", error)
      } finally {
        setLoading(false)
      }
    }

    runDiagnostic()
  }, [])

  if (loading) {
    return <div className="p-4 bg-blue-100 rounded">🔍 Diagnostic en cours...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-3">🔍 Diagnostic d'Authentification</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded">
          <h4 className="font-semibold text-green-700">État Local</h4>
          <ul className="text-sm mt-2">
            <li>Token: {diagnosticData.tokenPresent ? "✅ Présent" : "❌ Absent"}</li>
            <li>Utilisateur: {diagnosticData.userPresent ? "✅ Présent" : "❌ Absent"}</li>
            <li>Username: {diagnosticData.username || "N/A"}</li>
            <li>Rôles: {diagnosticData.roles.join(", ") || "Aucun"}</li>
          </ul>
        </div>

        <div className="bg-white p-3 rounded">
          <h4 className="font-semibold text-blue-700">LocalStorage</h4>
          <ul className="text-sm mt-2">
            <li>Token: {diagnosticData.localStorage.token}</li>
            <li>User: {diagnosticData.localStorage.user}</li>
          </ul>
        </div>

        {diagnosticData.serverResponse && (
          <div className="bg-white p-3 rounded md:col-span-2">
            <h4 className="font-semibold text-purple-700">Réponse Serveur</h4>
            <div className="text-sm mt-2">
              <p>Authentifié: {diagnosticData.serverResponse.authenticated ? "✅" : "❌"}</p>
              <p>Token valide: {diagnosticData.serverResponse.tokenValid ? "✅" : "❌"}</p>
              <p>Username: {diagnosticData.serverResponse.username || "N/A"}</p>
              {diagnosticData.serverResponse.error && (
                <p className="text-red-600">Erreur: {diagnosticData.serverResponse.error}</p>
              )}
            </div>
          </div>
        )}

        {diagnosticData.serverError && (
          <div className="bg-red-100 p-3 rounded md:col-span-2">
            <h4 className="font-semibold text-red-700">Erreur Serveur</h4>
            <p className="text-sm mt-2">{diagnosticData.serverError}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthDiagnostic
