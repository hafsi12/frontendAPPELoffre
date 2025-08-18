"use client"

import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import api from "../services/api"
import authService from "../services/authService"

function Facture() {
  const [factures, setFactures] = useState([])
  const [contrats, setContrats] = useState([])
  const [selectedFacture, setSelectedFacture] = useState(null)
  const [selectedContrat, setSelectedContrat] = useState(null)
  const [activeModalId, setActiveModalId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statistiques, setStatistiques] = useState(null)

  const canModify = authService.canModifyContracts() || authService.isAdmin()
  const canView = authService.canViewContracts() || authService.isAuthenticated()

  const STATUT_VALIDATION = {
    EN_ATTENTE: "En attente",
    VALIDE: "Validé",
    REFUSE: "Refusé",
  }

  const STATUT_PAIEMENT = {
    NON_PAYE: "Non payé",
    PAYE: "Payé",
    SOLDE: "Soldé",
  }

  useEffect(() => {
    if (canView) {
      fetchContrats()
      fetchFactures()
      fetchStatistiques()
    }
  }, [canView])

  const fetchContrats = async () => {
    try {
      const response = await api.get("/contrats")
      setContrats(response.data)
    } catch (error) {
      console.error("Error fetching contrats:", error)
      setError("Erreur lors du chargement des contrats")
    }
  }

  const fetchFactures = async () => {
    try {
      setLoading(true)
      const response = await api.get("/factures")
      setFactures(response.data)
    } catch (error) {
      console.error("Error fetching factures:", error)
      setError("Erreur lors du chargement des factures")
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistiques = async () => {
    try {
      const response = await api.get("/factures/statistiques")
      setStatistiques(response.data)
    } catch (error) {
      console.error("Error fetching statistiques:", error)
    }
  }

  const generateFacture = async (contratId) => {
    if (!canModify) return

    try {
      const contrat = contrats.find((c) => c.id === contratId)
      if (!contrat || !contrat.livrables || contrat.livrables.length === 0) {
        setError("Le contrat doit avoir des livrables pour générer une facture")
        return
      }

      const response = await api.post(`/factures/contrat/${contratId}`)
      await fetchFactures()
      await fetchStatistiques()
      setActiveModalId(null)
    } catch (error) {
      console.error("Error generating facture:", error)
      setError("Erreur lors de la génération de la facture")
    }
  }

  const regenererFacture = async (contratId) => {
    if (!canModify) return

    try {
      await api.post(`/factures/regenerer/${contratId}`)
      await fetchFactures()
      await fetchStatistiques()
      setError(null)
    } catch (error) {
      console.error("Error regenerating facture:", error)
      setError("Erreur lors de la régénération de la facture")
    }
  }

  const genererTicketPDF = async (factureId) => {
    try {
      const response = await api.get(`/factures/${factureId}/ticket/pdf`, {
        responseType: "blob",
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `ticket-facture-${selectedFacture.numeroFacture}.txt`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating ticket PDF:", error)
      setError("Erreur lors de la génération du ticket PDF")
    }
  }

  const deleteFacture = async (factureId) => {
    if (!canModify) return

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      try {
        await api.delete(`/factures/${factureId}`)
        await fetchFactures()
        await fetchStatistiques()
        setSelectedFacture(null)
      } catch (error) {
        console.error("Error deleting facture:", error)
        setError("Erreur lors de la suppression de la facture")
      }
    }
  }

  const updateLivrableStatus = async (livrableId, statutType, newStatus) => {
    if (!canModify) return

    try {
      const updateData = {}
      updateData[statutType] = newStatus

      await api.put(`/livrables/${livrableId}`, updateData)

      await fetchContrats()
      await fetchFactures()
      await fetchStatistiques()
    } catch (error) {
      console.error("Error updating livrable status:", error)
      setError("Erreur lors de la mise à jour du statut")
    }
  }

  const handleDetailsClick = async (facture) => {
    try {
      const response = await api.get(`/factures/${facture.id}/details`)
      setSelectedFacture(response.data.facture)
      setActiveModalId(null)
    } catch (error) {
      console.error("Error fetching facture details:", error)
      setSelectedFacture(facture)
    }
  }

  const handleGenerateClick = (contrat) => {
    setSelectedContrat(contrat)
    setActiveModalId("generateModal")
  }

  const handleBackClick = () => {
    setSelectedFacture(null)
  }

  const getStatusBadgeClass = (status, type) => {
    if (type === "paiement") {
      switch (status) {
        case "PAYE":
          return "bg-success"
        case "SOLDE":
          return "bg-info"
        case "NON_PAYE":
          return "bg-danger"
        default:
          return "bg-secondary"
      }
    } else {
      switch (status) {
        case "VALIDE":
          return "bg-success"
        case "REFUSE":
          return "bg-danger"
        case "EN_ATTENTE":
          return "bg-warning"
        default:
          return "bg-secondary"
      }
    }
  }

  const renderStatistiques = () => {
    if (!statistiques) return null

    return (
      <div className="shadow-lg rounded-3 w-100 border p-3 mb-4">
        <h5 className="mb-3">
          <i className="fas fa-chart-bar me-2"></i>
          Statistiques des Factures
        </h5>
        <div className="row">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h4>{statistiques.totalFactures}</h4>
                <p className="mb-0">Total Factures</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h4>{statistiques.facturesPayees}</h4>
                <p className="mb-0">Factures Payées</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h4>{statistiques.facturesNonPayees}</h4>
                <p className="mb-0">Non Payées</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h4>{statistiques.montantTotal?.toFixed(2)} MAD</h4>
                <p className="mb-0">Montant Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!canView) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Accès refusé</h4>
          <p>Vous n'avez pas les permissions nécessaires pour voir les factures.</p>
          <small className="text-muted">Rôle actuel: {authService.getRoleDisplayName()}</small>
        </div>
      </div>
    )
  }

  if (selectedFacture && !activeModalId) {
    return (
      <div className="p-4">
        <button className="btn btn-secondary mb-3" onClick={() => setSelectedFacture(null)}>
          ← Retour à la liste
        </button>

        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 className="mb-0">
              <i className="fas fa-file-invoice me-2"></i>
              Facture {selectedFacture.numeroFacture}
            </h3>
            {canModify && (
              <div className="btn-group">
                {selectedFacture.statutFacture === "PAYE" && (
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => genererTicketPDF(selectedFacture.id)}
                    title="Générer ticket PDF"
                  >
                    <i className="fas fa-receipt me-1"></i>
                    Ticket PDF
                  </button>
                )}
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => regenererFacture(selectedFacture.contrat?.id)}
                  title="Régénérer la facture"
                >
                  <i className="fas fa-sync me-1"></i>
                  Régénérer
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteFacture(selectedFacture.id)}
                  title="Supprimer la facture"
                >
                  <i className="fas fa-trash me-1"></i>
                  Supprimer
                </button>
              </div>
            )}
          </div>

          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h5 style={{ color: "black" }}>Informations Facture</h5>
                <p>
                  <strong style={{ color: "black" }}>Numéro:</strong> <span style={{ color: "green" }}>{selectedFacture.numeroFacture}</span>
                </p>
                <p>
                  <strong style={{ color: "black" }}>Date:</strong> <span style={{ color: "green" }}>
                                                                        {new Date(selectedFacture.dateFacture).toLocaleDateString()}
                                                                      </span>
                </p>
                <p>
                  <strong style={{ color: "black" }}>Client:</strong> <span style={{ color: "green" }}>
                                                                          {selectedFacture.contrat?.nameClient || "N/A"}
                                                                        </span>
                </p>
                <p>
                  <strong style={{ color: "black" }}>Statut:</strong>{" "}
                  <span
                    className={`badge ms-2 ${getStatusBadgeClass(
                      selectedFacture.statutFacture,
                      "paiement"
                    )}`}
                  >
                    {STATUT_PAIEMENT[selectedFacture.statutFacture] ||
                      selectedFacture.statutFacture}
                  </span>
                </p>
              </div>
              <div className="col-md-6 text-end">
                <h4 className="text-primary">
                  Montant Total: {selectedFacture.montantTotal?.toFixed(2) || "0.00"} MAD
                </h4>
              </div>
            </div>

            <h5  style={{ color: "blue" }} >Détail des Livrables</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Livrable</th>
                    <th>Description</th>
                    <th>Date Livraison</th>
                    <th>Montant</th>
                    <th>Statut Validation</th>
                    <th>Statut Paiement</th>
                    {canModify && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {selectedFacture.contrat?.livrables?.map((livrable) => (
                    <tr key={livrable.id}>
                      <td>{livrable.titre}</td>
                      <td>{livrable.description}</td>
                      <td>{livrable.dateLivraison ? new Date(livrable.dateLivraison).toLocaleDateString() : "N/A"}</td>
                      <td>{Number.parseFloat(livrable.montant || 0).toFixed(2)} MAD</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(livrable.statutValidation, "validation")}`}>
                          {STATUT_VALIDATION[livrable.statutValidation] || livrable.statutValidation}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(livrable.statutPaiement, "paiement")}`}>
                          {STATUT_PAIEMENT[livrable.statutPaiement] || livrable.statutPaiement}
                        </span>
                      </td>
                      {canModify && (
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => updateLivrableStatus(livrable.id, "statutValidation", "VALIDE")}
                              disabled={livrable.statutValidation === "VALIDE"}
                              title="Valider"
                            >
                              ✓
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => updateLivrableStatus(livrable.id, "statutValidation", "REFUSE")}
                              disabled={livrable.statutValidation === "REFUSE"}
                              title="Refuser"
                            >
                              ✗
                            </button>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => updateLivrableStatus(livrable.id, "statutPaiement", "PAYE")}
                              disabled={livrable.statutPaiement === "PAYE"}
                              title="Marquer comme payé"
                            >
                              💰
                            </button>
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => updateLivrableStatus(livrable.id, "statutPaiement", "SOLDE")}
                              disabled={livrable.statutPaiement === "SOLDE"}
                              title="Marquer comme soldé"
                            >
                              ✅
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr
                    style={{
                      backgroundColor: "#ffffff", // blanc
                      color: "#000000" // texte noir
                    }}
                  >
                    <td colSpan="3">
                      <strong style={{ color: "black" }} >Total</strong>
                    </td>
                    <td>
                      <strong style={{ color: "green" }}>{selectedFacture.montantTotal?.toFixed(2) || "0.00"} MAD</strong>
                    </td>
                    <td colSpan={canModify ? "3" : "2"}></td>
                  </tr>
                </tfoot>

              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column p-3 align-items-center" style={{ backgroundColor: "white" }}>
      {error && (
        <div className="alert alert-danger w-100 mb-3">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div
        className="rounded-3 p-3 shadow-lg d-flex justify-content-between w-100 mb-3"
        style={{
          background: "linear-gradient(to right,rgba(4,4,4,0.77),rgba(45,79,39,0.77),rgba(96,54,39,0.77))",
          zIndex: 1,
        }}
      >
        <h4 className="text-white" style={{ fontFamily: "corbel" }}>
          Gestion des Factures
        </h4>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <>
          {renderStatistiques()}

          <div className="shadow-lg rounded-3 w-100 border p-3 mb-4">
            <h5 className="mb-3">
              <i className="fas fa-file-contract me-2"></i>
              Contrats sans facture
            </h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Détails</th>
                  <th>Nb Livrables</th>
                  <th>Montant Total</th>
                  <th>Statut Estimé</th>
                  {canModify && <th className="text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {contrats
                  .filter((contrat) => !factures.some((f) => f.contrat?.id === contrat.id))
                  .map((contrat) => {
                    const montantTotal =
                      contrat.livrables?.reduce((sum, l) => sum + (Number.parseFloat(l.montant) || 0), 0) || 0
                    const allPaidOrSolde = contrat.livrables?.every(
                      (l) => l.statutPaiement === "PAYE" || l.statutPaiement === "SOLDE",
                    )
                    const statutEstime = allPaidOrSolde ? "PAYE" : "NON_PAYE"

                    return (
                      <tr key={contrat.id}>
                        <td>{contrat.id}</td>
                        <td>{contrat.nameClient}</td>
                        <td>{contrat.details}</td>
                        <td>{contrat.livrables?.length || 0}</td>
                        <td>{montantTotal.toFixed(2)} MAD</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(statutEstime, "paiement")}`}>
                            {STATUT_PAIEMENT[statutEstime]}
                          </span>
                        </td>
                        {canModify && (
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => generateFacture(contrat.id)}
                              disabled={!contrat.livrables || contrat.livrables.length === 0}
                            >
                              <i className="fas fa-plus me-1"></i>
                              Générer
                            </button>
                          </td>
                        )}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

          <div className="shadow-lg rounded-3 w-100 border p-3">
            <h5 className="mb-3">
              <i className="fas fa-file-invoice me-2"></i>
              Factures Générées
            </h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Montant Total</th>
                  <th>Statut</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((facture) => (
                  <tr key={facture.id}>
                    <td>{facture.numeroFacture}</td>
                    <td>{new Date(facture.dateFacture).toLocaleDateString()}</td>
                    <td>{facture.contrat?.nameClient || "N/A"}</td>
                    <td>{facture.montantTotal?.toFixed(2) || "0.00"} MAD</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(facture.statutFacture, "paiement")}`}>
                        {STATUT_PAIEMENT[facture.statutFacture] || facture.statutFacture}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-info" onClick={() => handleDetailsClick(facture)}>
                          <i className="fas fa-eye me-1"></i>
                          Détails
                        </button>
                        {canModify && (
                          <>
                            <button
                              className="btn btn-warning"
                              onClick={() => regenererFacture(facture.contrat?.id)}
                              title="Régénérer"
                            >
                              <i className="fas fa-sync"></i>
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => deleteFacture(facture.id)}
                              title="Supprimer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Facture
