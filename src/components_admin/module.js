"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import authService from "../services/authService"
import api from "../services/api"

const safeGet = (obj, path, defaultValue = null) => {
  try {
    return path.split(".").reduce((current, key) => current && current[key], obj) || defaultValue
  } catch (error) {
    // Suppression du log d'erreur
    return defaultValue
  }
}

const ContractManagement = () => {
  const [contrats, setContrats] = useState([])
  const [offresGagnees, setOffresGagnees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeModalId, setActiveModalId] = useState(null)
  const [selectedContrat, setSelectedContrat] = useState(null)
  const [selectedOffre, setSelectedOffre] = useState(null)
  const [selectedLivrable, setSelectedLivrable] = useState(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [expandedRows, setExpandedRows] = useState([])
  const [emailStatus, setEmailStatus] = useState({})
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [signature, setSignature] = useState("")
  const [signerName, setSignerName] = useState("")
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  // Permission checks
  const canModify = authService.canModifyContracts()
  const canView = authService.canViewContracts()

  const [contratFormData, setContratFormData] = useState({
    startDate: "",
    endDate: "",
    details: "",
    nameClient: "",
    offreId: null,
    budget: "",
  })

  const [livrableFormData, setLivrableFormData] = useState({
    titre: "",
    description: "",
    dateLivraison: "",
    montant: "",
    statutValidation: "EN_ATTENTE",
    statutPaiement: "NON_PAYE",
    fichierJoint: "",
  })

  const fetchContrats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/contrats")
      if (response.status !== 200) {
        const errorText = response.statusText
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      const data = response.data
      setContrats(data)
    } catch (err) {
      // Suppression du log d'erreur
      setError(`Erreur lors du chargement des contrats: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOffresGagnees = useCallback(async () => {
    try {
      const response = await api.get("/offres/gagnees-sans-contrat")
      if (response.status !== 200) {
        const errorText = response.statusText
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      const data = response.data
      setOffresGagnees(data)
    } catch (err) {
      // Suppression du log d'erreur
      // Si c'est une erreur 403, ne pas afficher d'erreur générale
      if (err.response?.status === 403) {
        // Suppression du log d'avertissement
        setOffresGagnees([]) // Définir une liste vide
      } else {
        setError(`Erreur lors du chargement des offres gagnées: ${err.message}`)
      }
    }
  }, [])

  const fetchContratLivrables = useCallback(async (contratId) => {
    try {
      const response = await api.get(`/contrats/${contratId}/livrables`)
      if (response.status !== 200) throw new Error("Erreur de chargement")
      return response.data
    } catch (err) {
      // Suppression du log d'erreur
      setError(err.message)
      return []
    }
  }, [])

  useEffect(() => {
    if (canView) {
      fetchContrats()
      fetchOffresGagnees()
    }
  }, [fetchContrats, fetchOffresGagnees, canView])

  useEffect(() => {
    if (showSignatureModal && canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = 400
      canvas.height = 200
      const context = canvas.getContext("2d")
      context.lineCap = "round"
      context.strokeStyle = "#000000"
      context.lineWidth = 2
      contextRef.current = context
    }
  }, [showSignatureModal])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContratFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLivrableInputChange = (e) => {
    const { name, value } = e.target
    setLivrableFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOffreSelect = (e) => {
    const offreId = Number.parseInt(e.target.value)
    const offre = offresGagnees.find((o) => o.idOffre === offreId)
    if (offre) {
      setSelectedOffre(offre)
      setContratFormData((prev) => ({
        ...prev,
        offreId: offreId,
        nameClient: safeGet(offre, "opportunite.client.name", ""),
        details: `Contrat pour l'offre: ${offre.detail || "N/A"}`,
      }))
    }
  }

  const handleCreateContrat = async (e) => {
    e.preventDefault()
    if (!canModify) return

    // Validation adaptée selon la disponibilité des offres
    if (offresGagnees.length > 0 && !selectedOffre) {
      setError("Veuillez sélectionner une offre")
      return
    }
    if (offresGagnees.length === 0 && (!contratFormData.nameClient || !contratFormData.details)) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Préparer les données selon le type de création
      const dataToSend = { ...contratFormData }
      if (offresGagnees.length === 0) {
        // Pour les contrats manuels, supprimer offreId
        delete dataToSend.offreId
      }

      const response = await api.post("/contrats", dataToSend)

      // Vérifier si la création a réussi (200 ou 201)
      if (response.status !== 200 && response.status !== 201) {
        const errorData = response.data
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`)
      }

      const newContrat = response.data
      setContrats((prev) => [...prev, newContrat])
      fetchOffresGagnees()
      toggleModal(null)
      resetForm()
    } catch (err) {
      // Afficher une erreur plus détaillée
      let errorMessage = "Erreur lors de la création du contrat"
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignContract = async () => {
    if (!canModify) return
    if (!selectedContrat || !signature || !signerName) {
      setError("Veuillez remplir tous les champs de signature")
      return
    }
    setLoading(true)
    try {
      const response = await api.post(`/contrats/${selectedContrat.id}/sign`, {
        signature: signature,
        signerName: signerName,
      })

      if (response.status !== 200 && response.status !== 201) {
        const errorData = response.data
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`)
      }

      const signedContrat = response.data
      setContrats((prev) => prev.map((c) => (c.id === signedContrat.id ? signedContrat : c)))
      setShowSignatureModal(false)
      setSignature("")
      setSignerName("")
      clearCanvas()
    } catch (err) {
      let errorMessage = "Erreur lors de la signature"
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAndSendPDF = async (contrat) => {
    if (!canModify) return
    setLoading(true)
    setError(null)
    setEmailStatus((prev) => ({ ...prev, [contrat.id]: "sending" }))
    try {
      const response = await api.post(`/contrats/${contrat.id}/generate-and-send`)
      if (response.status !== 200) {
        const errorData = response.data
        throw new Error(errorData.message || "Erreur lors de l'envoi du contrat")
      }
      const result = response.data
      setEmailStatus((prev) => ({ ...prev, [contrat.id]: "sent" }))
      alert(`Contrat envoyé avec succès à ${result.emailSent}`)
    } catch (err) {
      setError(err.message)
      setEmailStatus((prev) => ({ ...prev, [contrat.id]: "error" }))
    } finally {
      setLoading(false)
    }
  }

  const handleAddLivrable = async (e) => {
    e.preventDefault()
    if (!canModify) return
    if (!selectedContrat) return
    setLoading(true)
    try {
      const response = await api.post(`/contrats/${selectedContrat.id}/livrables`, {
        ...livrableFormData,
        montant: Number.parseFloat(livrableFormData.montant),
      })

      // Accepter les codes 200 et 201
      if (response.status !== 200 && response.status !== 201) {
        const errorData = response.data
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`)
      }

      const newLivrable = response.data

      const contratResponse = await api.get(`/contrats/${selectedContrat.id}`)
      const updatedContrat = contratResponse.data
      const livrables = await fetchContratLivrables(selectedContrat.id)
      setSelectedContrat({
        ...updatedContrat,
        livrables: livrables,
      })
      setLivrableFormData({
        titre: "",
        description: "",
        dateLivraison: "",
        montant: "",
        statutValidation: "EN_ATTENTE",
        statutPaiement: "NON_PAYE",
        fichierJoint: "",
      })
    } catch (err) {
      // Afficher une erreur plus détaillée
      let errorMessage = "Erreur lors de l'ajout du livrable"
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLivrable = async (e) => {
    e.preventDefault()
    if (!canModify) return
    if (!selectedLivrable || !selectedContrat) return
    setLoading(true)
    try {
      const response = await api.put(`/contrats/${selectedContrat.id}/livrables/${selectedLivrable.id}`, {
        ...livrableFormData,
        montant: Number.parseFloat(livrableFormData.montant),
      })

      if (response.status !== 200 && response.status !== 201) {
        const errorData = response.data
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`)
      }

      const contratResponse = await api.get(`/contrats/${selectedContrat.id}`)
      const updatedContrat = contratResponse.data
      const livrables = await fetchContratLivrables(selectedContrat.id)
      setSelectedContrat({
        ...updatedContrat,
        livrables: livrables,
      })
      setLivrableFormData({
        titre: "",
        description: "",
        dateLivraison: "",
        montant: "",
        statutValidation: "EN_ATTENTE",
        statutPaiement: "NON_PAYE",
        fichierJoint: "",
      })
      setSelectedLivrable(null)
    } catch (err) {
      let errorMessage = "Erreur lors de la modification du livrable"
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLivrable = async (contratId, livrableId) => {
    if (!canModify) return
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livrable ?")) return
    setLoading(true)
    try {
      const response = await api.delete(`/contrats/${contratId}/livrables/${livrableId}`)

      if (response.status !== 200 && response.status !== 204) {
        const errorData = response.data
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`)
      }

      const contratResponse = await api.get(`/contrats/${contratId}`)
      const updatedContrat = contratResponse.data
      const livrables = await fetchContratLivrables(contratId)
      setSelectedContrat({
        ...updatedContrat,
        livrables: livrables,
      })
    } catch (err) {
      let errorMessage = "Erreur lors de la suppression du livrable"
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectLivrableForEdit = (livrable) => {
    setSelectedLivrable(livrable)
    setLivrableFormData({
      titre: livrable.titre,
      description: livrable.description,
      dateLivraison: livrable.dateLivraison ? new Date(livrable.dateLivraison).toISOString().split("T")[0] : "",
      montant: livrable.montant.toString(),
      statutValidation: livrable.statutValidation,
      statutPaiement: livrable.statutPaiement,
      fichierJoint: livrable.fichierJoint || "",
    })
  }

  const startDrawing = (e) => {
    if (!canModify) return
    setIsDrawing(true)
    const rect = canvasRef.current.getBoundingClientRect()
    contextRef.current.beginPath()
    contextRef.current.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e) => {
    if (!isDrawing || !canModify) return
    const rect = canvasRef.current.getBoundingClientRect()
    contextRef.current.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing || !canModify) return
    setIsDrawing(false)
    contextRef.current.closePath()
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL("image/png")
    setSignature(dataURL.split(",")[1])
  }

  const clearCanvas = () => {
    if (!canModify) return
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
    setSignature("")
  }

  const handleDeleteContrat = async (id) => {
    if (!canModify) return
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) return
    setLoading(true)
    setError(null)
    try {
      const response = await api.delete(`/contrats/${id}`)
      if (response.status !== 204) {
        const errorData = response.data
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`)
      }
      // Mise à jour optimiste de l'état local
      setContrats((prevContrats) => {
        const newContrats = prevContrats.filter((contrat) => contrat.id !== id)
        return newContrats
      })
      // Rafraîchir les données
      await fetchOffresGagnees()
    } catch (err) {
      setError(`Échec de la suppression du contrat: ${err.message}`)
      // Recharger les données pour synchronisation
      await fetchContrats()
    } finally {
      setLoading(false)
    }
  }

  const toggleModal = async (modalId, contrat = null) => {
    if (!canModify && modalId && modalId !== "livrables") return
    setActiveModalId(modalId)
    if (modalId === "livrables" && contrat) {
      setLoading(true)
      try {
        const fullContratData = await api.get(`/contrats/${contrat.id}`).then((res) => res.data)
        const livrables = await fetchContratLivrables(contrat.id)
        setSelectedContrat({
          ...fullContratData,
          livrables: livrables,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      setSelectedContrat(contrat)
    }
    if (!modalId) resetForm()
  }

  const resetForm = () => {
    setContratFormData({
      startDate: "",
      endDate: "",
      details: "",
      nameClient: "",
      offreId: null,
      budget: "",
    })
    setSelectedOffre(null)
    setLivrableFormData({
      titre: "",
      description: "",
      dateLivraison: "",
      montant: "",
      statutValidation: "EN_ATTENTE",
      statutPaiement: "NON_PAYE",
      fichierJoint: "",
    })
    setSelectedLivrable(null)
  }

  const toggleExpandRow = (rowId) => {
    setExpandedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]))
  }

  const getButtonStyle = (buttonId) => ({
    minWidth: "80px",
    backgroundColor: hoveredButton === buttonId ? "#ECECEC" : "white",
    fontFamily: "corbel",
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIF":
        return "bg-success"
      case "TERMINE":
        return "bg-secondary"
      case "SUSPENDU":
        return "bg-warning"
      default:
        return "bg-primary"
    }
  }

  const getEmailStatusIcon = (contratId) => {
    const status = emailStatus[contratId]
    switch (status) {
      case "sending":
        return <i className="fas fa-spinner fa-spin text-warning"></i>
      case "sent":
        return <i className="fas fa-check-circle text-success"></i>
      case "error":
        return <i className="fas fa-exclamation-circle text-danger"></i>
      default:
        return <i className="fas fa-envelope text-primary"></i>
    }
  }

  const handleDownloadPDF = async (contrat) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post(`/contrats/${contrat.id}/generate-pdf`, {}, { responseType: "blob" })
      if (response.status !== 200) {
        throw new Error("Erreur lors de la génération du PDF")
      }
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `contrat_${contrat.id}_${contrat.nameClient.replace(/\s+/g, "_")}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      alert("Document téléchargé avec succès !")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocument = async (document) => {
    try {
      if (document.id) {
        const response = await api.get(`/documents/${document.id}/download`, { responseType: "blob" })
        if (response.status !== 200) {
          throw new Error("Erreur lors du téléchargement du document")
        }
        const blob = response.data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = document.namefile || `document_${document.id}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        alert("Document non disponible pour le téléchargement")
      }
    } catch (error) {
      alert("Erreur lors du téléchargement du document: " + error.message)
    }
  }

  // Check permissions before rendering
  if (!canView) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Accès refusé</h4>
          <p>Vous n'avez pas les permissions nécessaires pour voir les contrats.</p>
        </div>
      </div>
    )
  }

  if (loading && contrats.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
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
        className="rounded-3 p-3 d-flex shadow-lg justify-content-between"
        style={{
          background:
            "linear-gradient(to right,rgba(4, 4, 4, 0.77),rgba(4, 4, 4, 0.77), rgba(45, 79, 39, 0.77), rgba(96, 54, 39, 0.77))",
          width: "95%",
          marginBottom: "-40px",
          zIndex: 1,
        }}
      >
        <h4 style={{ color: "white", fontFamily: "corbel" }}>
          📋 Gestion des Contrats
          {!canModify && <small className="ms-2 badge bg-warning text-dark">LECTURE SEULE</small>}
        </h4>
        <div className="d-flex flex-row">
          {canModify && (
            <button
              className="d-flex p-5 pt-0 pb-0 btn btn-sm rounded-4 justify-content-center align-items-center"
              style={{ backgroundColor: "white" }}
              onClick={() => toggleModal("createContrat")}
              title="Créer un nouveau contrat"
            >
              <i className="fa-solid fa-plus me-3" style={{ color: "#008080" }}></i>
              Nouveau Contrat
            </button>
          )}
        </div>
      </div>

      <div className="w-100 mb-4" style={{ paddingTop: canModify ? "60px" : "20px" }}>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card text-center border-primary">
              <div className="card-body">
                <i className="fas fa-file-contract fa-2x text-primary mb-2"></i>
                <h4 className="text-primary">{contrats.length}</h4>
                <p className="card-text text-black">Total Contrats</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-success">
              <div className="card-body">
                <i className="fas fa-handshake fa-2x text-success mb-2"></i>
                <h4 className="text-success">{contrats.filter((c) => c.statut === "ACTIF").length}</h4>
                <p className="card-text text-black">Actifs</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-warning">
              <div className="card-body">
                <i className="fas fa-pen-fancy fa-2x text-warning mb-2"></i>
                <h4 className="text-warning">{contrats.filter((c) => c.signed).length}</h4>
                <p className="card-text text-black">Signés</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-info">
              <div className="card-body">
                <i className="fas fa-calendar-check fa-2x text-info mb-2"></i>
                <h4 className="text-info">{contrats.filter((c) => c.statut === "TERMINE").length}</h4>
                <p className="card-text text-black">Terminés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="d-flex p-3 flex-column shadow-lg rounded-3 pt-5 w-100 border"
        style={{
          backgroundColor: "white",
          position: "relative",
          zIndex: 0,
        }}
      >
        <div className="p-1 pt-3">
          <table className="table">
            <thead>
              <tr>
                <th style={{ color: "rgb(165, 168, 164)" }}>ID</th>
                <th style={{ color: "rgb(165, 168, 164)" }}>CLIENT</th>
                <th style={{ color: "rgb(165, 168, 164)" }}>PROJET</th>
                <th style={{ color: "rgb(165, 168, 164)" }}>BUDGET</th>
                <th style={{ color: "rgb(165, 168, 164)" }}>STATUT</th>
                <th style={{ color: "rgb(165, 168, 164)" }}>SIGNATURE</th>
                <th className="text-center" style={{ color: "rgb(165, 168, 164)" }}>
                  DÉTAILS
                </th>
                <th className="text-center" style={{ color: "rgb(165, 168, 164)" }}>
                  PDF
                </th>
                {canModify && (
                  <th className="text-center" style={{ color: "rgb(165, 168, 164)" }}>
                    EMAIL
                  </th>
                )}
                <th className="text-center" style={{ color: "rgb(165, 168, 164)" }}>
                  LIVRABLES
                </th>
                {canModify && (
                  <th className="text-center" style={{ color: "rgb(165, 168, 164)" }}>
                    ACTIONS
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {contrats.map((contrat) => (
                <React.Fragment key={contrat.id}>
                  <tr>
                    <td style={{ color: "black" }}>#{contrat.id}</td>
                    <td style={{ color: "black" }}>{contrat.nameClient}</td>
                    <td style={{ color: "black" }}>
                      {safeGet(
                        contrat,
                        "offre.opportunite.projectName",
                        contrat.details?.split(":")[1]?.trim() || "N/A",
                      )}
                    </td>
                    <td style={{ color: "black" }}>
                      {safeGet(contrat, "offre.budget")
                        ? `${contrat.offre.budget} MAD`
                        : contrat.budget
                          ? `${contrat.budget} MAD`
                          : "N/A"}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(contrat.statut || "ACTIF")}`}>
                        {contrat.statut || "ACTIF"}
                      </span>
                    </td>
                    <td>
                      {contrat.signed ? (
                        <span className="badge bg-success">
                          <i className="fas fa-check me-1"></i>
                          Signé
                        </span>
                      ) : canModify ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setSelectedContrat(contrat)
                            setShowSignatureModal(true)
                          }}
                        >
                          <i className="fas fa-pen me-1"></i>
                          Signer
                        </button>
                      ) : (
                        <span className="badge bg-secondary">
                          <i className="fas fa-clock me-1"></i>
                          Non signé
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm rounded-4"
                        style={getButtonStyle("details")}
                        onMouseEnter={() => setHoveredButton("details")}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => toggleExpandRow(`row-${contrat.id}`)}
                      >
                        <i className="fa-solid fa-eye" style={{ color: "rgb(60, 201, 192)" }}></i>
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm rounded-4"
                        style={getButtonStyle("pdf")}
                        onMouseEnter={() => setHoveredButton("pdf")}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleDownloadPDF(contrat)}
                        disabled={loading || !contrat.signed}
                        title={!contrat.signed ? "Le contrat doit être signé avant l'export" : "Télécharger le PDF"}
                      >
                        <i className="fas fa-file-pdf text-danger"></i>
                      </button>
                    </td>
                    {canModify && (
                      <td className="text-center">
                        <button
                          className="btn btn-sm rounded-4"
                          style={getButtonStyle("email")}
                          onMouseEnter={() => setHoveredButton("email")}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => handleGenerateAndSendPDF(contrat)}
                          disabled={loading || !contrat.signed}
                          title={!contrat.signed ? "Le contrat doit être signé avant l'envoi" : "Envoyer par email"}
                        >
                          {getEmailStatusIcon(contrat.id)}
                        </button>
                      </td>
                    )}
                    <td className="text-center">
                      <button
                        className="btn btn-sm rounded-4"
                        style={getButtonStyle("livrables")}
                        onMouseEnter={() => setHoveredButton("livrables")}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => toggleModal("livrables", contrat)}
                      >
                        <i className="fa-solid fa-tasks" style={{ color: "rgb(255, 193, 7)" }}></i>
                      </button>
                    </td>
                    {canModify && (
                      <td className="text-center">
                        <button
                          className="btn btn-sm rounded-4 me-2"
                          style={getButtonStyle("delete")}
                          onMouseEnter={() => setHoveredButton("delete")}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => handleDeleteContrat(contrat.id)}
                        >
                          <i className="fa-solid fa-trash" style={{ color: "red" }}></i>
                        </button>
                      </td>
                    )}
                  </tr>
                  {expandedRows.includes(`row-${contrat.id}`) && (
                    <tr key={`expanded-${contrat.id}`}>
                      <td colSpan={canModify ? 11 : 9}>
                        <div className="p-3 rounded-3 border" style={{ backgroundColor: "#f8f9fa" }}>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="card mb-3">
                                <div className="card-header bg-primary text-white">
                                  <h6 className="mb-0">📋 Informations du Contrat</h6>
                                </div>
                                <div className="card-body">
                                  <p style={{ color: "black" }}>
                                    <strong style={{ color: "black" }}>Date de début:</strong>{" "}
                                    {contrat.startDate ? new Date(contrat.startDate).toLocaleDateString() : "N/A"}
                                  </p>
                                  <p style={{ color: "black" }}>
                                    <strong style={{ color: "black" }}>Date de fin:</strong>{" "}
                                    {contrat.endDate ? new Date(contrat.endDate).toLocaleDateString() : "N/A"}
                                  </p>
                                  <p style={{ color: "black" }}>
                                    <strong style={{ color: "black" }}>Détails:</strong>{" "}
                                    {contrat.details || "Aucun détail spécifié"}
                                  </p>
                                  {contrat.signed && (
                                    <>
                                      <p style={{ color: "black" }}>
                                        <strong style={{ color: "black" }}>Signé par:</strong> {contrat.signerName}
                                      </p>
                                      <p style={{ color: "black" }}>
                                        <strong style={{ color: "black" }}>Date de signature:</strong>{" "}
                                        {contrat.dateSignature
                                          ? new Date(contrat.dateSignature).toLocaleDateString()
                                          : "N/A"}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="card mb-3">
                                <div className="card-header bg-success text-white">
                                  <h6 className="mb-0">
                                    🎯 Informations {contrat.offre ? "de l'Offre" : "du Contrat"}
                                  </h6>
                                </div>
                                <div className="card-body">
                                  <p style={{ color: "black" }}>
                                    <strong style={{ color: "black" }}>Budget:</strong>{" "}
                                    {safeGet(contrat, "offre.budget")
                                      ? `${contrat.offre.budget} MAD`
                                      : contrat.budget
                                        ? `${contrat.budget} MAD`
                                        : "N/A"}
                                  </p>
                                  {contrat.offre ? (
                                    <>
                                      <p style={{ color: "black" }}>
                                        <strong style={{ color: "black" }}>Tâches:</strong>{" "}
                                        {safeGet(contrat, "offre.taches.length", 0)}
                                      </p>
                                      {safeGet(contrat, "offre.taches") && contrat.offre.taches.length > 0 && (
                                        <div className="mt-2">
                                          <small className="text-muted" style={{ color: "black !important" }}>
                                            Liste des tâches:
                                          </small>
                                          <ul className="list-unstyled ms-3">
                                            {contrat.offre.taches.slice(0, 3).map((tache, index) => (
                                              <li key={index} className="small" style={{ color: "black" }}>
                                                • {tache.titre || `Tâche ${index + 1}`}
                                                {tache.checked && <span className="text-success ms-1">✓</span>}
                                              </li>
                                            ))}
                                            {contrat.offre.taches.length > 3 && (
                                              <li className="small" style={{ color: "black" }}>
                                                ... et {contrat.offre.taches.length - 3} autres
                                              </li>
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                      <p style={{ color: "black" }}>
                                        <strong style={{ color: "black" }}>Documents:</strong>{" "}
                                        {safeGet(contrat, "offre.documents.length", 0)}
                                      </p>
                                    </>
                                  ) : (
                                    <p style={{ color: "black" }}>
                                      <strong style={{ color: "black" }}>Type:</strong> Contrat manuel
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {contrat.offre && (
                            <div className="row mt-2">
                              <div className="col-md-6">
                                {safeGet(contrat, "offre.documents") && contrat.offre.documents.length > 0 && (
                                  <div className="card">
                                    <div className="card-header bg-info text-white">
                                      <h6 className="mb-0">📄 Documents Associés</h6>
                                    </div>
                                    <div className="card-body">
                                      <div className="ms-3">
                                        {contrat.offre.documents.map((document, index) => (
                                          <div
                                            key={index}
                                            className="d-flex align-items-center justify-content-between border rounded p-2 mb-1"
                                            style={{ backgroundColor: "white" }}
                                          >
                                            <div className="d-flex align-items-center">
                                              <i className="fas fa-file-alt text-primary me-2"></i>
                                              <div>
                                                <div className="small fw-bold" style={{ color: "black" }}>
                                                  {document.namefile || `Document ${index + 1}`}
                                                </div>
                                                <div
                                                  className="text-muted"
                                                  style={{ fontSize: "0.75rem", color: "black !important" }}
                                                >
                                                  {document.type || "Type non spécifié"}
                                                </div>
                                              </div>
                                            </div>
                                            <button
                                              className="btn btn-sm btn-outline-primary"
                                              onClick={() => handleDownloadDocument(document)}
                                              title="Télécharger le document"
                                            >
                                              <i className="fas fa-download"></i>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="col-md-6">
                                {safeGet(contrat, "offre.opportunite") && (
                                  <div className="card">
                                    <div className="card-header bg-secondary text-white">
                                      <h6 className="mb-0">🏢 Informations Client</h6>
                                    </div>
                                    <div className="card-body">
                                      <p style={{ color: "black" }}>
                                        <strong style={{ color: "black" }}>Projet:</strong>{" "}
                                        {safeGet(contrat, "offre.opportunite.projectName", "N/A")}
                                      </p>
                                      <p style={{ color: "black" }}>
                                        <strong style={{ color: "black" }}>Client:</strong>{" "}
                                        {safeGet(contrat, "offre.opportunite.client.name", "N/A")}
                                      </p>
                                      {safeGet(contrat, "offre.opportunite.client.contacts") &&
                                        contrat.offre.opportunite.client.contacts.length > 0 && (
                                          <p style={{ color: "black" }}>
                                            <strong style={{ color: "black" }}>Contact:</strong>{" "}
                                            {safeGet(contrat, "offre.opportunite.client.contacts.0.email", "N/A")}
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Contrat */}
      {activeModalId === "createContrat" && canModify && (
        <div
          className="modal show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 4,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" style={{ fontFamily: "corbel", color: "#008080" }}>
                  📋 Nouveau Contrat
                </h4>
                <button type="button" className="btn-close" onClick={() => toggleModal(null)}></button>
              </div>
              <form onSubmit={handleCreateContrat}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label" style={{ color: "black" }}>
                        {offresGagnees.length > 0 ? "Offre Gagnée" : "Type de Contrat"}
                      </label>
                      {offresGagnees.length > 0 ? (
                        <select
                          className="form-control"
                          name="offreId"
                          value={contratFormData.offreId || ""}
                          onChange={handleOffreSelect}
                          required
                        >
                          <option value="">Sélectionner une offre gagnée</option>
                          {offresGagnees.map((offre) => (
                            <option key={offre.idOffre} value={offre.idOffre}>
                              {safeGet(offre, "opportunite.projectName", "Projet non spécifié")} - {offre.budget} MAD
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="alert alert-info">
                          <i className="fas fa-info-circle me-2"></i>
                          <strong>Création manuelle de contrat</strong>
                          <br />
                          Vous pouvez créer un contrat en saisissant manuellement les informations ci-dessous.
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: "black" }}>
                        Date de début
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={contratFormData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: "black" }}>
                        Date de fin
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={contratFormData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {offresGagnees.length === 0 && (
                      <div className="col-md-6">
                        <label className="form-label" style={{ color: "black" }}>
                          Budget (MAD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          name="budget"
                          value={contratFormData.budget || ""}
                          onChange={handleInputChange}
                          placeholder="Montant du contrat"
                          required
                        />
                      </div>
                    )}
                    <div className="col-12">
                      <label className="form-label" style={{ color: "black" }}>
                        Nom du Client
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nameClient"
                        value={contratFormData.nameClient}
                        onChange={handleInputChange}
                        required
                        readOnly={!!selectedOffre}
                        placeholder={offresGagnees.length === 0 ? "Nom du client" : ""}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{ color: "black" }}>
                        Détails du Contrat
                      </label>
                      <textarea
                        className="form-control"
                        name="details"
                        value={contratFormData.details}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Détails et conditions du contrat..."
                        required
                      />
                    </div>
                    {selectedOffre && (
                      <div className="col-12">
                        <div className="alert alert-info">
                          <h6 style={{ color: "black" }}>📊 Résumé de l'Offre Sélectionnée:</h6>
                          <p style={{ color: "black" }}>
                            <strong>Projet:</strong> {safeGet(selectedOffre, "opportunite.projectName", "N/A")}
                          </p>
                          <p style={{ color: "black" }}>
                            <strong>Budget:</strong> {selectedOffre.budget} MAD
                          </p>
                          <p style={{ color: "black" }}>
                            <strong>Tâches:</strong> {safeGet(selectedOffre, "taches.length", 0)}
                          </p>
                          <p style={{ color: "black" }}>
                            <strong>Documents:</strong> {safeGet(selectedOffre, "documents.length", 0)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => toggleModal(null)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Création...
                      </>
                    ) : (
                      "Créer le Contrat"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Signature */}
      {showSignatureModal && canModify && (
        <div
          className="modal show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 4,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" style={{ fontFamily: "corbel", color: "#ffc107" }}>
                  ✍️ Signature Électronique
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowSignatureModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label" style={{ color: "black" }}>
                    Nom du signataire
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Entrez votre nom complet"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "black" }}>
                    Signature
                  </label>
                  <div className="border rounded p-2" style={{ backgroundColor: "#f8f9fa" }}>
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: canModify ? "crosshair" : "not-allowed",
                        backgroundColor: "white",
                        width: "100%",
                        maxWidth: "400px",
                        height: "200px",
                      }}
                    />
                    <div className="mt-2">
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearCanvas}>
                        <i className="fas fa-eraser me-1"></i>
                        Effacer
                      </button>
                      <small className="text-muted ms-3" style={{ color: "black !important" }}>
                        Dessinez votre signature dans la zone ci-dessus
                      </small>
                    </div>
                  </div>
                </div>
                {selectedContrat && (
                  <div className="alert alert-info">
                    <h6 style={{ color: "black" }}>📋 Contrat à signer:</h6>
                    <p style={{ color: "black" }}>
                      <strong>Client:</strong> {selectedContrat.nameClient}
                    </p>
                    <p style={{ color: "black" }}>
                      <strong>Projet:</strong>{" "}
                      {safeGet(
                        selectedContrat,
                        "offre.opportunite.projectName",
                        selectedContrat.details?.split(":")[1]?.trim() || "N/A",
                      )}
                    </p>
                    <p style={{ color: "black" }}>
                      <strong>Budget:</strong> {safeGet(selectedContrat, "offre.budget", selectedContrat.budget || 0)}{" "}
                      MAD
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSignatureModal(false)}>
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleSignContract}
                  disabled={loading || !signature || !signerName}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Signature...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-pen-fancy me-2"></i>
                      Signer le Contrat
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Livrables */}
      {activeModalId === "livrables" && selectedContrat && (
        <div
          className="modal show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 4,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" style={{ fontFamily: "corbel", color: "#ffc107" }}>
                  📦 Gestion des Livrables - Contrat #{selectedContrat.id}
                  {!canModify && <small className="ms-2 badge bg-warning text-dark">LECTURE SEULE</small>}
                </h4>
                <button type="button" className="btn-close" onClick={() => toggleModal(null)}></button>
              </div>
              <div className="modal-body">
                {canModify && (
                  <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-plus me-2"></i>
                        {selectedLivrable ? "Modifier le Livrable" : "Ajouter un Livrable"}
                      </h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={selectedLivrable ? handleUpdateLivrable : handleAddLivrable}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label" style={{ color: "black" }}>
                              Titre du livrable
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="titre"
                              value={livrableFormData.titre}
                              onChange={handleLivrableInputChange}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" style={{ color: "black" }}>
                              Date de livraison
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              name="dateLivraison"
                              value={livrableFormData.dateLivraison}
                              onChange={handleLivrableInputChange}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" style={{ color: "black" }}>
                              Montant (MAD)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              name="montant"
                              value={livrableFormData.montant}
                              onChange={handleLivrableInputChange}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" style={{ color: "black" }}>
                              Fichier joint (optionnel)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="fichierJoint"
                              value={livrableFormData.fichierJoint}
                              onChange={handleLivrableInputChange}
                              placeholder="Chemin ou URL du fichier"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" style={{ color: "black" }}>
                              Statut de Validation
                            </label>
                            <select
                              className="form-control"
                              name="statutValidation"
                              value={livrableFormData.statutValidation}
                              onChange={handleLivrableInputChange}
                              required
                            >
                              <option value="EN_ATTENTE">En attente</option>
                              <option value="VALIDE">Validé</option>
                              <option value="REFUSE">Refusé</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label" style={{ color: "black" }}>
                              Statut de Paiement
                            </label>
                            <select
                              className="form-control"
                              name="statutPaiement"
                              value={livrableFormData.statutPaiement}
                              onChange={handleLivrableInputChange}
                              required
                            >
                              <option value="NON_PAYE">Non payé</option>
                              <option value="PAYE">Payé</option>
                              <option value="SOLDE">Soldé</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <label className="form-label" style={{ color: "black" }}>
                              Description
                            </label>
                            <textarea
                              className="form-control"
                              name="description"
                              value={livrableFormData.description}
                              onChange={handleLivrableInputChange}
                              rows="3"
                              placeholder="Description détaillée du livrable"
                              required
                            />
                          </div>
                          <div className="col-12">
                            <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                              {selectedLivrable ? "Modifier" : "Ajouter"}
                            </button>
                            {selectedLivrable && (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                  setSelectedLivrable(null)
                                  setLivrableFormData({
                                    titre: "",
                                    description: "",
                                    dateLivraison: "",
                                    montant: "",
                                    statutValidation: "EN_ATTENTE",
                                    statutPaiement: "NON_PAYE",
                                    fichierJoint: "",
                                  })
                                }}
                              >
                                Annuler
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-list me-2"></i>
                      Liste des Livrables ({selectedContrat.livrables?.length || 0})
                    </h5>
                  </div>
                  <div className="card-body">
                    {selectedContrat.livrables?.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th style={{ color: "black" }}>Titre</th>
                              <th style={{ color: "black" }}>Description</th>
                              <th style={{ color: "black" }}>Date Livraison</th>
                              <th style={{ color: "black" }}>Montant</th>
                              <th style={{ color: "black" }}>Statut Validation</th>
                              <th style={{ color: "black" }}>Statut Paiement</th>
                              {canModify && <th style={{ color: "black" }}>Actions</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedContrat.livrables.map((livrable) => (
                              <tr key={livrable.id || `livrable-${Math.random()}`}>
                                <td style={{ color: "black" }}>
                                  <strong>{livrable.titre}</strong>
                                  {livrable.fichierJoint && (
                                    <div>
                                      <small style={{ color: "black" }}>
                                        <i className="fas fa-paperclip me-1"></i>
                                        Fichier joint
                                      </small>
                                    </div>
                                  )}
                                </td>
                                <td style={{ color: "black" }}>
                                  <small>{livrable.description}</small>
                                </td>
                                <td style={{ color: "black" }}>
                                  {new Date(livrable.dateLivraison).toLocaleDateString()}
                                </td>
                                <td style={{ color: "black" }}>
                                  <strong>{livrable.montant} MAD</strong>
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      livrable.statutValidation === "VALIDE"
                                        ? "bg-success"
                                        : livrable.statutValidation === "REFUSE"
                                          ? "bg-danger"
                                          : "bg-warning"
                                    }`}
                                  >
                                    {livrable.statutValidation}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      livrable.statutPaiement === "PAYE"
                                        ? "bg-success"
                                        : livrable.statutPaiement === "SOLDE"
                                          ? "bg-info"
                                          : "bg-warning"
                                    }`}
                                  >
                                    {livrable.statutPaiement}
                                  </span>
                                </td>
                                {canModify && (
                                  <td>
                                    <div className="btn-group" role="group">
                                      <button
                                        className="btn btn-sm btn-outline-primary"
                                        title="Modifier"
                                        onClick={() => handleSelectLivrableForEdit(livrable)}
                                      >
                                        <i className="fas fa-edit"></i>
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        title="Supprimer"
                                        onClick={() => handleDeleteLivrable(selectedContrat.id, livrable.id)}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                        <p className="text-muted" style={{ color: "black !important" }}>
                          Aucun livrable défini pour ce contrat
                        </p>
                        {canModify && (
                          <p className="text-muted" style={{ color: "black !important" }}>
                            Utilisez le formulaire ci-dessus pour ajouter des livrables
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => toggleModal(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContractManagement
