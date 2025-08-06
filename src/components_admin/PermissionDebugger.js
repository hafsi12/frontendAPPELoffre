"use client"
import { useState } from "react"
import authService from "../services/authService"

const PermissionDebugger = () => {
  const [isVisible, setIsVisible] = useState(false)

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const user = authService.getCurrentUser()
  const permissions = authService.getPermissionsSummary()

  if (!isVisible) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <button className="btn btn-sm btn-outline-info" onClick={() => setIsVisible(true)}>
          🔍 Debug Permissions
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        maxHeight: "500px",
        overflowY: "auto",
        zIndex: 9999,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div className="card">
        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
          <h6 className="mb-0">🔍 Debug Permissions</h6>
          <button className="btn btn-sm btn-light" onClick={() => setIsVisible(false)}>
            ✕
          </button>
        </div>
        <div className="card-body p-3">
          <div className="mb-3">
            <h6>👤 Utilisateur actuel</h6>
            <div className="small">
              <p className="mb-1">
                <strong>Username:</strong> {user?.username || "Non connecté"}
              </p>
              <p className="mb-1">
                <strong>Rôle:</strong>
                <span className={`badge bg-${authService.getRoleColor()} ms-1`}>{user?.role || "Aucun"}</span>
              </p>
              <p className="mb-1">
                <strong>Token:</strong> {user?.token ? "✅ Présent" : "❌ Absent"}
              </p>
            </div>
          </div>

          {permissions && (
            <div className="mb-3">
              <h6>🔑 Permissions</h6>
              <div className="small">
                <div className="row">
                  <div className="col-6">
                    <p className="mb-1">
                      <strong>Clients:</strong>
                    </p>
                    <ul className="list-unstyled ms-2 small">
                      <li>👁️ {permissions.permissions.clients.view ? "✅" : "❌"} Voir</li>
                      <li>✏️ {permissions.permissions.clients.modify ? "✅" : "❌"} Modifier</li>
                    </ul>

                    <p className="mb-1">
                      <strong>Opportunités:</strong>
                    </p>
                    <ul className="list-unstyled ms-2 small">
                      <li>👁️ {permissions.permissions.opportunities.view ? "✅" : "❌"} Voir</li>
                      <li>✏️ {permissions.permissions.opportunities.modify ? "✅" : "❌"} Modifier</li>
                    </ul>
                  </div>
                  <div className="col-6">
                    <p className="mb-1">
                      <strong>Offres:</strong>
                    </p>
                    <ul className="list-unstyled ms-2 small">
                      <li>👁️ {permissions.permissions.offers.view ? "✅" : "❌"} Voir</li>
                      <li>✏️ {permissions.permissions.offers.modify ? "✅" : "❌"} Modifier</li>
                    </ul>

                    <p className="mb-1">
                      <strong>Contrats:</strong>
                    </p>
                    <ul className="list-unstyled ms-2 small">
                      <li>👁️ {permissions.permissions.contracts.view ? "✅" : "❌"} Voir</li>
                      <li>✏️ {permissions.permissions.contracts.modify ? "✅" : "❌"} Modifier</li>
                    </ul>
                  </div>
                </div>

                {permissions.permissions.admin.isAdmin && (
                  <div className="alert alert-warning py-2 small">
                    👑 <strong>Administrateur</strong> - Accès complet
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-3">
            <h6>🧪 Actions de test</h6>
            <div className="d-grid gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => authService.debugPermissions()}>
                📝 Log permissions dans la console
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => console.log("User:", user, "Permissions:", permissions)}
              >
                📊 Log données complètes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PermissionDebugger
