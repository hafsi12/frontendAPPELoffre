"use client"
import { useState, useEffect } from "react"
import authService from "../services/authService"
import api from "../services/api"

const DiagnosticPanel = () => {
  const [diagnosticData, setDiagnosticData] = useState({
    authStatus: null,
    userInfo: null,
    permissions: null,
    apiTests: {},
    loading: true,
  })

  useEffect(() => {
    runDiagnostic()
  }, [])

  const runDiagnostic = async () => {
    setDiagnosticData((prev) => ({ ...prev, loading: true }))

    const results = {
      authStatus: authService.isAuthenticated(),
      userInfo: authService.getCurrentUser(),
      permissions: authService.getPermissionsSummary(),
      apiTests: {},
      loading: false,
    }

    // Test des endpoints API
    const endpoints = [
      { name: "clients", url: "/clients" },
      { name: "opportunites", url: "/opportunites" },
      { name: "offres", url: "/offres" },
      { name: "contrats", url: "/contrats" },
    ]

    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint.url)
        results.apiTests[endpoint.name] = {
          status: "success",
          statusCode: response.status,
          dataLength: response.data?.length || 0,
        }
      } catch (error) {
        results.apiTests[endpoint.name] = {
          status: "error",
          statusCode: error.response?.status || "Network Error",
          error: error.message,
        }
      }
    }

    setDiagnosticData(results)
  }

  if (diagnosticData.loading) {
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5>🔍 Diagnostic du système</h5>
          </div>
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Diagnostic en cours...</span>
            </div>
            <p className="mt-2">Analyse en cours...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
          <h5>🔍 Diagnostic du système</h5>
          <button className="btn btn-light btn-sm" onClick={runDiagnostic}>
            🔄 Actualiser
          </button>
        </div>
        <div className="card-body">
          {/* Statut d'authentification */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6>🔐 Authentification</h6>
              <div className={`alert ${diagnosticData.authStatus ? "alert-success" : "alert-danger"}`}>
                <strong>Statut:</strong> {diagnosticData.authStatus ? "✅ Connecté" : "❌ Non connecté"}
              </div>

              {diagnosticData.userInfo && (
                <div className="card">
                  <div className="card-body">
                    <h6>👤 Informations utilisateur</h6>
                    <p>
                      <strong>Nom d'utilisateur:</strong> {diagnosticData.userInfo.username}
                    </p>
                    <p>
                      <strong>Nom complet:</strong> {diagnosticData.userInfo.firstName}{" "}
                      {diagnosticData.userInfo.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {diagnosticData.userInfo.email}
                    </p>
                    <p>
                      <strong>Rôle:</strong>{" "}
                      <span className={`badge bg-${authService.getRoleColor()}`}>{diagnosticData.userInfo.role}</span>
                    </p>
                    <p>
                      <strong>Token présent:</strong> {diagnosticData.userInfo.token ? "✅ Oui" : "❌ Non"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="col-md-6">
              <h6>🔑 Permissions</h6>
              {diagnosticData.permissions && (
                <div className="card">
                  <div className="card-body">
                    <h6>📋 Résumé des permissions</h6>
                    <div className="row">
                      <div className="col-6">
                        <p>
                          <strong>Clients:</strong>
                        </p>
                        <ul className="list-unstyled ms-3">
                          <li>👁️ Voir: {diagnosticData.permissions.permissions.clients.view ? "✅" : "❌"}</li>
                          <li>✏️ Modifier: {diagnosticData.permissions.permissions.clients.modify ? "✅" : "❌"}</li>
                        </ul>

                        <p>
                          <strong>Opportunités:</strong>
                        </p>
                        <ul className="list-unstyled ms-3">
                          <li>👁️ Voir: {diagnosticData.permissions.permissions.opportunities.view ? "✅" : "❌"}</li>
                          <li>
                            ✏️ Modifier: {diagnosticData.permissions.permissions.opportunities.modify ? "✅" : "❌"}
                          </li>
                        </ul>
                      </div>
                      <div className="col-6">
                        <p>
                          <strong>Offres:</strong>
                        </p>
                        <ul className="list-unstyled ms-3">
                          <li>👁️ Voir: {diagnosticData.permissions.permissions.offers.view ? "✅" : "❌"}</li>
                          <li>✏️ Modifier: {diagnosticData.permissions.permissions.offers.modify ? "✅" : "❌"}</li>
                        </ul>

                        <p>
                          <strong>Contrats:</strong>
                        </p>
                        <ul className="list-unstyled ms-3">
                          <li>👁️ Voir: {diagnosticData.permissions.permissions.contracts.view ? "✅" : "❌"}</li>
                          <li>✏️ Modifier: {diagnosticData.permissions.permissions.contracts.modify ? "✅" : "❌"}</li>
                        </ul>
                      </div>
                    </div>

                    {diagnosticData.permissions.permissions.admin.isAdmin && (
                      <div className="alert alert-warning">
                        <strong>👑 Administrateur:</strong> Accès complet au système
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tests API */}
          <div className="row">
            <div className="col-12">
              <h6>🌐 Tests des endpoints API</h6>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Endpoint</th>
                      <th>Statut</th>
                      <th>Code HTTP</th>
                      <th>Données</th>
                      <th>Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(diagnosticData.apiTests).map(([name, test]) => (
                      <tr key={name}>
                        <td>
                          <code>/api/{name}</code>
                        </td>
                        <td>
                          <span className={`badge ${test.status === "success" ? "bg-success" : "bg-danger"}`}>
                            {test.status === "success" ? "✅ Succès" : "❌ Erreur"}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${test.statusCode === 200 ? "bg-success" : "bg-danger"}`}>
                            {test.statusCode}
                          </span>
                        </td>
                        <td>{test.status === "success" ? `${test.dataLength} éléments` : "-"}</td>
                        <td>{test.error && <small className="text-danger">{test.error}</small>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Conseils de dépannage */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="alert alert-info">
                <h6>💡 Conseils de dépannage</h6>
                <ul className="mb-0">
                  <li>Si vous voyez des erreurs 401: Vérifiez que vous êtes bien connecté</li>
                  <li>Si vous voyez des erreurs 403: Vérifiez vos permissions pour ce module</li>
                  <li>Si les endpoints échouent: Vérifiez que le serveur Spring Boot est démarré</li>
                  <li>Si le token est absent: Essayez de vous reconnecter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiagnosticPanel
