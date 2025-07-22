"use client"
import { useState, useEffect, useCallback } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

function Offre({ initialOpportunity = null, onCloseOffreCreation }) {
  const [currentView, setCurrentView] = useState(initialOpportunity ? "create" : "list")
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [offres, setOffres] = useState([])
  const [selectedOffre, setSelectedOffre] = useState(null)
  const [opportunitiesList, setOpportunitiesList] = useState([])
  const [offreFormData, setOffreFormData] = useState({
    budget: "",
    detail: "",
    sent: false,
    adjuge: "EN_ATTENTE",
    incomingOpportuniteId: initialOpportunity?.idOpp || null,
    documents: [],
    taches: [],
  })
  const [newTask, setNewTask] = useState({
    titre: "",
    detail: "",
    deadline: "",
    assignedPerson: "",
    checked: false,
  })
  const [newDocument, setNewDocument] = useState({
    namefile: "",
    description: "",
    type: "PDF",
    cheminFichier: "",
    file: null,
  })

  const fetchOffres = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:8080/api/offres")
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}. Server response: ${errorText.substring(0, 200)}...`)
      }
      const data = await response.json()
      setOffres(data)
    } catch (err) {
      console.error("Error fetching offres:", err)
      setError("Erreur lors du chargement des offres: " + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOpportunitiesList = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/opportunites")
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}. Server response: ${errorText.substring(0, 200)}...`)
      }
      const data = await response.json()
      setOpportunitiesList(data)
    } catch (err) {
      console.error("Error fetching opportunities list:", err)
      setError("Erreur lors du chargement de la liste des opportunités: " + err.message)
    }
  }, [])

  useEffect(() => {
    fetchOpportunitiesList()
    if (currentView === "list") {
      fetchOffres()
    }
  }, [currentView, fetchOffres, fetchOpportunitiesList])

  const resetOffreForm = useCallback(() => {
    setOffreFormData({
      budget: "",
      detail: "",
      sent: false,
      adjuge: "EN_ATTENTE",
      incomingOpportuniteId: initialOpportunity?.idOpp || null,
      documents: [],
      taches: [],
    })
    setNewTask({
      titre: "",
      detail: "",
      deadline: "",
      assignedPerson: "",
      checked: false,
    })
    setNewDocument({
      namefile: "",
      description: "",
      type: "PDF",
      cheminFichier: "",
      file: null,
    })
  }, [initialOpportunity])

  // Removed the problematic useEffect that was resetting the form on every 'create' view entry.
  // The form will now only reset when explicitly told to (e.g., for a new offer).

  const handleOffreInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setOffreFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "incomingOpportuniteId"
            ? value
              ? Number.parseInt(value)
              : null
            : value,
    }))
  }

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocumentInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === "file" && files?.[0]) {
      setNewDocument((prev) => ({
        ...prev,
        cheminFichier: files[0].name,
        file: files[0],
      }))
    } else {
      setNewDocument((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddTache = () => {
    if (newTask.titre && newTask.detail && newTask.deadline && newTask.assignedPerson) {
      setOffreFormData((prev) => ({
        ...prev,
        taches: [...prev.taches, { ...newTask, id: Date.now() }],
      }))
      setNewTask({ titre: "", detail: "", deadline: "", assignedPerson: "", checked: false })
    } else {
      setError("Veuillez remplir tous les champs de la tâche avant de l'ajouter.")
    }
  }

  const handleRemoveTache = (id) => {
    setOffreFormData((prev) => ({
      ...prev,
      taches: prev.taches.filter((t) => t.id !== id),
    }))
  }

  const handleAddDocument = () => {
    if (newDocument.namefile && newDocument.cheminFichier && newDocument.file) {
      setOffreFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            ...newDocument,
            id: Date.now(),
          },
        ],
      }))
      setNewDocument({ namefile: "", description: "", type: "PDF", cheminFichier: "", file: null })
    } else {
      setError("Veuillez remplir tous les champs du document et sélectionner un fichier avant de l'ajouter.")
    }
  }

  const handleRemoveDocument = (id) => {
    setOffreFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }))
  }

  const validateOffreForm = () => {
    setError(null)
    if (!offreFormData.budget || isNaN(Number(offreFormData.budget)) || Number(offreFormData.budget) <= 0) {
      setError("Le budget doit être un nombre positif et est obligatoire.")
      return false
    }
    if (!selectedOffre && !offreFormData.incomingOpportuniteId && !initialOpportunity) {
      // Added initialOpportunity check
      setError("Veuillez lier cette offre à une opportunité existante.")
      return false
    }
    if (newTask.titre || newTask.detail || newTask.deadline || newTask.assignedPerson) {
      setError("Veuillez ajouter la tâche en cours de saisie à la liste ou vider ses champs.")
      return false
    }
    if (newDocument.namefile || newDocument.cheminFichier || newDocument.file) {
      setError("Veuillez ajouter le document en cours de saisie à la liste ou vider ses champs.")
      return false
    }
    if (offreFormData.taches.length === 0) {
      setError("Veuillez ajouter au moins une tâche à l'offre.")
      return false
    }
    if (offreFormData.documents.length === 0) {
      setError("Veuillez ajouter au moins un document à l'offre.")
      return false
    }
    return true
  }

  const submitOffreToBackend = async () => {
    setError(null)
    setLoading(true)
    try {
      const offreToSend = {
        ...offreFormData,
        budget: Number.parseFloat(offreFormData.budget),
        // Ensure new documents don't send a temporary ID to backend
        documents: offreFormData.documents.map((doc) => ({
          ...doc,
          id: doc.file ? null : doc.id,
        })),
        // Ensure new tasks don't send a temporary ID
        taches: offreFormData.taches.map((tache) => ({
          ...tache,
          id: tache.id && tache.id > 1000000000000 ? null : tache.id,
        })),
      }

      const formData = new FormData()
      formData.append("offre", JSON.stringify(offreToSend))
      offreFormData.documents.forEach((doc) => {
        if (doc.file) {
          formData.append("files", doc.file, doc.cheminFichier)
        }
      })

      const url = selectedOffre
        ? `http://localhost:8080/api/offres/${selectedOffre.idOffre}`
        : "http://localhost:8080/api/offres"
      const method = selectedOffre ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const resultOffre = await response.json()
      if (selectedOffre) {
        setOffres((prev) => prev.map((o) => (o.idOffre === resultOffre.idOffre ? resultOffre : o)))
        setSelectedOffre(resultOffre)
        setCurrentView("details")
      } else {
        setOffres((prev) => [...prev, resultOffre])
        setCurrentView("list")
      }
      resetOffreForm() // Reset form after successful submission
      setShowSummaryModal(false)
    } catch (err) {
      console.error("Error submitting offre:", err)
      setError("Erreur lors de la soumission de l'offre: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOffre = async (id) => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/offres/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}. Server response: ${errorText.substring(0, 200)}...`)
      }
      setOffres((prev) => prev.filter((o) => o.idOffre !== id))
      setCurrentView("list")
    } catch (err) {
      console.error("Error deleting offre:", err)
      setError("Erreur lors de la suppression de l'offre: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/offres/${id}/statut?statut=${newStatus}`, {
        method: "PUT",
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      const updatedOffre = await response.json()
      setOffres((prev) => prev.map((o) => (o.idOffre === updatedOffre.idOffre ? updatedOffre : o)))
      if (selectedOffre?.idOffre === id) {
        setSelectedOffre(updatedOffre)
      }
    } catch (err) {
      console.error("Error updating offre status:", err)
      setError("Erreur lors de la mise à jour du statut: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (offre) => {
    setSelectedOffre(offre)
    setCurrentView("details")
  }

  const handleEditOffre = (offre) => {
    setSelectedOffre(offre)
    setOffreFormData({
      budget: offre.budget,
      detail: offre.detail,
      sent: offre.sent,
      adjuge: offre.adjuge,
      incomingOpportuniteId: offre.opportunite?.idOpp || null,
      documents: offre.documents.map((doc) => ({ ...doc, file: undefined })), // Clear file object for existing docs
      taches: offre.taches.map((tache) => ({ ...tache })),
    })
    setCurrentView("create")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "GAGNEE":
        return "bg-success"
      case "PERDUE":
        return "bg-danger"
      case "EN_ATTENTE":
        return "bg-warning"
      default:
        return "bg-secondary"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "GAGNEE":
        return "fas fa-trophy"
      case "PERDUE":
        return "fas fa-times-circle"
      case "EN_ATTENTE":
        return "fas fa-clock"
      default:
        return "fas fa-question"
    }
  }

  const completedTasksCount = offreFormData.taches.filter((t) => t.checked).length
  const pendingTasksCount = offreFormData.taches.length - completedTasksCount
  const totalFileSize = offreFormData.documents.reduce((acc, doc) => acc + (doc.file?.size || 0), 0)
  const fileSizeInMB = (totalFileSize / (1024 * 1024)).toFixed(2)

  if (currentView === "list") {
    return (
      <div className="d-flex flex-column p-3 align-items-center" style={{ backgroundColor: "white" }}>
        {error && (
          <div className="alert alert-danger w-100 mb-3">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}
        <div
          className="rounded-3 p-3 shadow-lg d-flex justify-content-between w-100 mb-4"
          style={{
            background: "linear-gradient(to right,rgba(4,4,4,0.77),rgba(45,79,39,0.77),rgba(96,54,39,0.77))",
            zIndex: 1,
          }}
        >
          <h4 className="text-white" style={{ fontFamily: "corbel" }}>
            📊 Liste des Offres Soumises
          </h4>
          <button
            className="btn btn-sm rounded-4 bg-white"
            onClick={() => {
              setSelectedOffre(null) // Clear selected offer for new creation
              resetOffreForm() // Reset form for new offer
              setCurrentView("create")
            }}
          >
            <i className="fas fa-plus me-2 text-success"></i> Nouvelle Offre
          </button>
        </div>
        <div className="row g-3 mb-4 w-100" style={{ maxWidth: "1200px" }}>
          <div className="col-md-3">
            <div className="card text-center border-primary">
              <div className="card-body">
                <i className="fas fa-list-alt fa-2x text-primary mb-2"></i>
                <h4 className="text-primary">{offres.length}</h4>
                <p className="card-text">Total Offres</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-success">
              <div className="card-body">
                <i className="fas fa-trophy fa-2x text-success mb-2"></i>
                <h4 className="text-success">{offres.filter((o) => o.adjuge === "GAGNEE").length}</h4>
                <p className="card-text">Gagnées</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-danger">
              <div className="card-body">
                <i className="fas fa-times-circle fa-2x text-danger mb-2"></i>
                <h4 className="text-danger">{offres.filter((o) => o.adjuge === "PERDUE").length}</h4>
                <p className="card-text">Perdues</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-warning">
              <div className="card-body">
                <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                <h4 className="text-warning">{offres.filter((o) => o.adjuge === "EN_ATTENTE").length}</h4>
                <p className="card-text">En Cours</p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <div className="shadow-lg rounded-3 w-100 border p-3" style={{ maxWidth: "1200px" }}>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>ID Offre</th>
                  <th>Opportunité</th>
                  <th>Budget</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {offres.map((offre) => (
                  <tr key={`offre-${offre.idOffre}`}>
                    <td>{offre.idOffre}</td>
                    <td>
                      {/* MODIFICATION ICI: Simplifié pour utiliser directement offre.opportunite */}
                      {offre.opportunite?.projectName || "Non spécifié"}
                    </td>
                    <td>{offre.budget} MAD</td>
                    <td>
                      <span className={`badge ${getStatusBadge(offre.adjuge)}`}>
                        <i className={`${getStatusIcon(offre.adjuge)} me-1`}></i>
                        {offre.adjuge}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleViewDetails(offre)}
                          title="Détails"
                        >
                          <i className="fa-solid fa-search"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditOffre(offre)}
                          title="Modifier"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteOffre(offre.idOffre)}
                          title="Supprimer"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <div className="dropdown ms-2">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            Changer Status
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusChange(offre.idOffre, "EN_ATTENTE")}
                              >
                                <i className="fas fa-clock me-2 text-warning"></i>
                                En cours
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusChange(offre.idOffre, "GAGNEE")}
                              >
                                <i className="fas fa-trophy me-2 text-success"></i>
                                Gagnée
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusChange(offre.idOffre, "PERDUE")}
                              >
                                <i className="fas fa-times-circle me-2 text-danger"></i>
                                Perdue
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  if (currentView === "details" && selectedOffre) {
    return (
      <div className="p-4">
        <button className="btn btn-secondary mb-3" onClick={() => setCurrentView("list")}>
          ← Retour à la liste des offres
        </button>
        {error && (
          <div className="alert alert-danger w-100 mb-3">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Détails de l'Offre #{selectedOffre.idOffre}</h2>
          <button className="btn btn-warning" onClick={() => handleEditOffre(selectedOffre)}>
            <i className="fa-solid fa-pen me-2"></i>Modifier l'Offre
          </button>
        </div>
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">📌 Opportunité liée</h5>
                <p className="card-text text-black font-semibold">
                  {selectedOffre.opportunite?.projectName || "Non spécifié"}
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">💰 Budget de l'Offre</h5>
                <p className="card-text text-black font-semibold">{selectedOffre.budget} MAD</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">📝 Détails</h5>
                <p className="card-text text-black font-semibold">{selectedOffre.detail || "Non spécifié"}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">✅ Statut</h5>
                <span className={`badge ${getStatusBadge(selectedOffre.adjuge)}`}>
                  <i className={`${getStatusIcon(selectedOffre.adjuge)} me-1`}></i>
                  {selectedOffre.adjuge}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg rounded-3 border p-4 mb-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "40px", height: "40px", backgroundColor: "#007bff" }}
            >
              <i className="fas fa-tasks text-white"></i>
            </div>
            <h5 className="mb-0" style={{ color: "#007bff", fontFamily: "corbel" }}>
              Tâches de l'Offre ({selectedOffre.taches?.length || 0})
            </h5>
          </div>
          <div className="bg-light p-3 rounded mb-3">
            <h6 className="text-primary mb-3">
              <i className="fas fa-plus-circle me-2"></i>
              Ajouter une nouvelle tâche
            </h6>
            <div className="mb-2">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Titre de la tâche"
                name="titre"
                value={newTask.titre}
                onChange={handleTaskInputChange}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Détails de la tâche"
                name="detail"
                value={newTask.detail}
                onChange={handleTaskInputChange}
              />
            </div>
            <div className="row g-2 mb-2">
              <div className="col-6">
                <input
                  type="date"
                  className="form-control"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleTaskInputChange}
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Assignée à"
                  name="assignedPerson"
                  value={newTask.assignedPerson}
                  onChange={handleTaskInputChange}
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={async () => {
                if (
                  newTask.titre &&
                  newTask.detail &&
                  newTask.deadline &&
                  newTask.assignedPerson &&
                  selectedOffre.idOffre
                ) {
                  setError(null)
                  setLoading(true)
                  try {
                    const response = await fetch(`http://localhost:8080/api/offres/${selectedOffre.idOffre}/taches`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newTask),
                    })
                    if (!response.ok) {
                      const errorData = await response.json()
                      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
                    }
                    const addedTask = await response.json()
                    setSelectedOffre((prev) => (prev ? { ...prev, taches: [...(prev.taches || []), addedTask] } : null))
                    setNewTask({ titre: "", detail: "", deadline: "", assignedPerson: "", checked: false })
                  } catch (err) {
                    console.error("Error adding task:", err)
                    setError("Erreur lors de l'ajout de la tâche: " + err.message)
                  } finally {
                    setLoading(false)
                  }
                } else {
                  setError("Veuillez remplir tous les champs de la tâche avant de l'ajouter.")
                }
              }}
            >
              <i className="fas fa-plus me-2"></i>
              Ajouter Tâche
            </button>
          </div>
          {selectedOffre.taches?.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {selectedOffre.taches.map((t) => (
                <div key={t.id} className="card mb-2 border-primary">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="card-title text-primary mb-1">{t.titre}</h6>
                        <p className="card-text text-muted small mb-1">{t.detail}</p>
                        <div className="d-flex justify-content-between">
                          <small className="text-success">
                            <i className="fas fa-user me-1"></i>
                            {t.assignedPerson}
                          </small>
                          <small className="text-warning">
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(t.deadline).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={async () => {
                          if (selectedOffre.idOffre && t.id) {
                            setError(null)
                            setLoading(true)
                            try {
                              const response = await fetch(
                                `http://localhost:8080/api/offres/${selectedOffre.idOffre}/taches/${t.id}`,
                                {
                                  method: "DELETE",
                                },
                              )
                              if (!response.ok) {
                                const errorText = await response.text()
                                throw new Error(
                                  `HTTP error! status: ${response.status}. Server response: ${errorText.substring(0, 200)}...`,
                                )
                              }
                              setSelectedOffre((prev) =>
                                prev ? { ...prev, taches: prev.taches?.filter((task) => task.id !== t.id) } : null,
                              )
                            } catch (err) {
                              console.error("Error deleting task:", err)
                              setError("Erreur lors de la suppression de la tâche: " + err.message)
                            } finally {
                              setLoading(false)
                            }
                          }
                        }}
                        title="Supprimer"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Aucune tâche pour cette offre.</p>
          )}
        </div>
        <div className="shadow-lg rounded-3 border p-4 mb-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "40px", height: "40px", backgroundColor: "#ffc107" }}
            >
              <i className="fas fa-file text-white"></i>
            </div>
            <h5 className="mb-0" style={{ color: "#ffc107", fontFamily: "corbel" }}>
              Documents de l'Offre ({selectedOffre.documents?.length || 0})
            </h5>
          </div>
          <div className="bg-light p-3 rounded mb-3">
            <h6 className="text-warning mb-3">
              <i className="fas fa-cloud-upload-alt me-2"></i>
              Ajouter un nouveau document
            </h6>
            <div className="mb-2">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nom du fichier"
                name="namefile"
                value={newDocument.namefile}
                onChange={handleDocumentInputChange}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Description du document"
                name="description"
                value={newDocument.description}
                onChange={handleDocumentInputChange}
              />
            </div>
            <div className="mb-2">
              <select
                className="form-control mb-2"
                name="type"
                value={newDocument.type}
                onChange={handleDocumentInputChange}
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="PPT">PPT</option>
              </select>
            </div>
            <div className="mb-2">
              <input type="file" className="form-control mb-2" name="file" onChange={handleDocumentInputChange} />
            </div>
            {newDocument.cheminFichier && (
              <p className="text-muted small mt-1">Fichier sélectionné: {newDocument.cheminFichier}</p>
            )}
            <button
              type="button"
              className="btn btn-warning w-100"
              onClick={async () => {
                if (newDocument.namefile && newDocument.file && selectedOffre.idOffre) {
                  setError(null)
                  setLoading(true)
                  try {
                    const docToSend = {
                      namefile: newDocument.namefile,
                      description: newDocument.description,
                      type: newDocument.type,
                      cheminFichier: newDocument.cheminFichier,
                    }
                    const formData = new FormData()
                    formData.append("document", JSON.stringify(docToSend))
                    formData.append("file", newDocument.file, newDocument.cheminFichier)
                    const response = await fetch(
                      `http://localhost:8080/api/offres/${selectedOffre.idOffre}/documents`,
                      {
                        method: "POST",
                        body: formData,
                      },
                    )
                    if (!response.ok) {
                      const errorData = await response.json()
                      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
                    }
                    const addedDocument = await response.json()
                    setSelectedOffre((prev) =>
                      prev ? { ...prev, documents: [...(prev.documents || []), addedDocument] } : null,
                    )
                    setNewDocument({ namefile: "", description: "", type: "PDF", cheminFichier: "", file: null })
                  } catch (err) {
                    console.error("Error adding document:", err)
                    setError("Erreur lors de l'ajout du document: " + err.message)
                  } finally {
                    setLoading(false)
                  }
                } else {
                  setError(
                    "Veuillez remplir tous les champs du document et sélectionner un fichier avant de l'ajouter.",
                  )
                }
              }}
            >
              <i className="fas fa-upload me-2"></i>
              Ajouter Document
            </button>
          </div>
          {selectedOffre.documents?.length > 0 ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {selectedOffre.documents.map((f) => (
                <div key={f.id} className="card mb-2 border-warning">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="card-title text-warning mb-1">
                          <i className="fas fa-file-alt me-2"></i>
                          {f.namefile}
                        </h6>
                        <p className="card-text text-muted small mb-1">{f.description}</p>
                        <small className="badge bg-secondary">{f.type || "Document"}</small>
                        {f.cheminFichier && !f.file && (
                          <a
                            href={`http://localhost:8080/api/offres/documents/${f.cheminFichier}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ms-2 text-info"
                          >
                            Télécharger
                          </a>
                        )}
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={async () => {
                          if (selectedOffre.idOffre && f.id) {
                            setError(null)
                            setLoading(true)
                            try {
                              const response = await fetch(
                                `http://localhost:8080/api/offres/${selectedOffre.idOffre}/documents/${f.id}`,
                                {
                                  method: "DELETE",
                                },
                              )
                              if (!response.ok) {
                                const errorText = await response.text()
                                throw new Error(
                                  `HTTP error! status: ${response.status}. Server response: ${errorText.substring(0, 200)}...`,
                                )
                              }
                              setSelectedOffre((prev) =>
                                prev ? { ...prev, documents: prev.documents?.filter((doc) => doc.id !== f.id) } : null,
                              )
                            } catch (err) {
                              console.error("Error deleting document:", err)
                              setError("Erreur lors de la suppression du document: " + err.message)
                            } finally {
                              setLoading(false)
                            }
                          }
                        }}
                        title="Supprimer"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">Aucun document pour cette offre.</p>
          )}
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
        className="rounded-3 p-3 shadow-lg d-flex justify-content-between w-100 mb-4"
        style={{
          background: "linear-gradient(to right,rgba(4,4,4,0.77),rgba(45,79,39,0.77),rgba(96,54,39,0.77))",
          zIndex: 1,
        }}
      >
        <h4 className="text-white" style={{ fontFamily: "corbel" }}>
          📋 {selectedOffre ? "Modification d'Offre" : "Création d'Offre"}
        </h4>
        <div className="d-flex">
          {initialOpportunity && (
            <button className="btn btn-sm rounded-4 bg-white me-2" onClick={onCloseOffreCreation}>
              <i className="fas fa-arrow-left me-2 text-primary"></i> Retour Opportunité
            </button>
          )}
          <button className="btn btn-sm rounded-4 bg-white" onClick={() => setCurrentView("list")}>
            <i className="fas fa-list me-2 text-primary"></i> Voir les Offres
          </button>
        </div>
      </div>
      <div className="w-100" style={{ maxWidth: "1400px" }}>
        <div className="shadow-lg rounded-3 border p-4 mb-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ width: "40px", height: "40px", backgroundColor: "#6c757d" }}
            >
              <i className="fas fa-calculator text-white"></i>
            </div>
            <h5 className="mb-0" style={{ color: "#6c757d", fontFamily: "corbel" }}>
              Tableau de Bord & Statistiques
            </h5>
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card text-center border-success h-100">
                <div className="card-body">
                  <i className="fas fa-dollar-sign fa-2x text-success mb-2"></i>
                  <h4 className="text-success">{offreFormData.budget || "0"} MAD</h4>
                  <p className="card-text text-muted">Budget Total</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-primary h-100">
                <div className="card-body">
                  <i className="fas fa-tasks fa-2x text-primary mb-2"></i>
                  <h4 className="text-primary">{offreFormData.taches.length}</h4>
                  <p className="card-text text-muted">Tâches Totales</p>
                  <small className="text-success">{completedTasksCount} terminées</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-warning h-100">
                <div className="card-body">
                  <i className="fas fa-file-alt fa-2x text-warning mb-2"></i>
                  <h4 className="text-warning">{offreFormData.documents.length}</h4>
                  <p className="card-text text-muted">Documents</p>
                  <small className="text-info">{fileSizeInMB} MB</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-info h-100">
                <div className="card-body">
                  <i className="fas fa-chart-line fa-2x text-info mb-2"></i>
                  <h4 className="text-info">
                    {offreFormData.taches.length > 0
                      ? Math.round((completedTasksCount / offreFormData.taches.length) * 100)
                      : 0}
                    %
                  </h4>
                  <p className="card-text text-muted">Progression</p>
                  <small className="text-secondary">{pendingTasksCount} en attente</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (validateOffreForm()) {
              setShowSummaryModal(true)
            }
          }}
        >
          <div className="shadow-lg rounded-3 border p-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{ width: "40px", height: "40px", backgroundColor: "#28a745" }}
              >
                <i className="fas fa-dollar-sign text-white"></i>
              </div>
              <h5 className="mb-0" style={{ color: "#28a745", fontFamily: "corbel" }}>
                Configuration du Budget
              </h5>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label fw-bold">Budget de l'Offre (MAD)</label>
                <div className="input-group">
                  <span className="input-group-text bg-success text-white">
                    <i className="fas fa-coins"></i>
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    name="budget"
                    value={offreFormData.budget}
                    onChange={handleOffreInputChange}
                    placeholder="Entrer le budget"
                    style={{ borderColor: "#28a745" }}
                    required
                  />
                  <span className="input-group-text">MAD</span>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Détails de l'Offre</label>
                <textarea
                  className="form-control"
                  name="detail"
                  value={offreFormData.detail}
                  onChange={handleOffreInputChange}
                  placeholder="Détails supplémentaires sur l'offre"
                  rows={1}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="form-label fw-bold">Opportunité liée</label>
              {initialOpportunity ? (
                <input type="text" className="form-control" value={initialOpportunity.projectName} readOnly disabled />
              ) : (
                <select
                  className="form-control"
                  name="incomingOpportuniteId"
                  value={offreFormData.incomingOpportuniteId || ""}
                  onChange={handleOffreInputChange}
                  required
                >
                  <option value="">Choisir une opportunité</option>
                  {opportunitiesList.map((opp) => (
                    <option key={`opp-select-${opp.idOpp}`} value={opp.idOpp}>
                      {opp.projectName}
                    </option>
                  ))}
                </select>
              )}
              {initialOpportunity && (
                <input type="hidden" name="incomingOpportuniteId" value={initialOpportunity.idOpp} />
              )}
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="shadow-lg rounded-3 border p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px", backgroundColor: "#007bff" }}
                  >
                    <i className="fas fa-tasks text-white"></i>
                  </div>
                  <h5 className="mb-0" style={{ color: "#007bff", fontFamily: "corbel" }}>
                    Gestion des Tâches
                  </h5>
                </div>
                <div className="bg-light p-3 rounded mb-3">
                  <h6 className="text-primary mb-3">
                    <i className="fas fa-plus-circle me-2"></i>
                    Ajouter une tâche
                  </h6>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Titre de la tâche"
                      name="titre"
                      value={newTask.titre}
                      onChange={handleTaskInputChange}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Détails de la tâche"
                      name="detail"
                      value={newTask.detail}
                      onChange={handleTaskInputChange}
                    />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="date"
                        className="form-control"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleTaskInputChange}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Assignée à"
                        name="assignedPerson"
                        value={newTask.assignedPerson}
                        onChange={handleTaskInputChange}
                      />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary w-100" onClick={handleAddTache}>
                    <i className="fas fa-plus me-2"></i>
                    Ajouter Tâche
                  </button>
                </div>
                {offreFormData.taches.length > 0 && (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <h6 className="text-success mb-3">
                      <i className="fas fa-list me-2"></i>
                      Tâches ({offreFormData.taches.length})
                    </h6>
                    {offreFormData.taches.map((t) => (
                      <div key={t.id} className="card mb-2 border-primary">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="card-title text-primary mb-1">{t.titre}</h6>
                              <p className="card-text text-muted small mb-1">{t.detail}</p>
                              <div className="d-flex justify-content-between">
                                <small className="text-success">
                                  <i className="fas fa-user me-1"></i>
                                  {t.assignedPerson}
                                </small>
                                <small className="text-warning">
                                  <i className="fas fa-calendar me-1"></i>
                                  {new Date(t.deadline).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => handleRemoveTache(t.id)}
                              title="Supprimer"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="shadow-lg rounded-3 border p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px", backgroundColor: "#ffc107" }}
                  >
                    <i className="fas fa-file text-white"></i>
                  </div>
                  <h5 className="mb-0" style={{ color: "#ffc107", fontFamily: "corbel" }}>
                    Gestion des Documents
                  </h5>
                </div>
                <div className="bg-light p-3 rounded mb-3">
                  <h6 className="text-warning mb-3">
                    <i className="fas fa-cloud-upload-alt me-2"></i>
                    Ajouter un document
                  </h6>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Nom du fichier"
                      name="namefile"
                      value={newDocument.namefile}
                      onChange={handleDocumentInputChange}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Description du document"
                      name="description"
                      value={newDocument.description}
                      onChange={handleDocumentInputChange}
                    />
                  </div>
                  <div className="mb-2">
                    <select
                      className="form-control mb-2"
                      name="type"
                      value={newDocument.type}
                      onChange={handleDocumentInputChange}
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX</option>
                      <option value="XLSX">XLSX</option>
                      <option value="PPT">PPT</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <input type="file" className="form-control mb-2" name="file" onChange={handleDocumentInputChange} />
                  </div>
                  {newDocument.cheminFichier && (
                    <p className="text-muted small mt-1">Fichier sélectionné: {newDocument.cheminFichier}</p>
                  )}
                  <button type="button" className="btn btn-warning w-100" onClick={handleAddDocument}>
                    <i className="fas fa-upload me-2"></i>
                    Ajouter Document
                  </button>
                </div>
                {offreFormData.documents.length > 0 && (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <h6 className="text-info mb-3">
                      <i className="fas fa-folder-open me-2"></i>
                      Documents ({offreFormData.documents.length})
                    </h6>
                    {offreFormData.documents.map((f) => (
                      <div key={f.id} className="card mb-2 border-warning">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="card-title text-warning mb-1">
                                <i className="fas fa-file-alt me-2"></i>
                                {f.namefile}
                              </h6>
                              <p className="card-text text-muted small mb-1">{f.description}</p>
                              <small className="badge bg-secondary">{f.type || "Document"}</small>
                              {f.cheminFichier && !f.file && (
                                <a
                                  href={`http://localhost:8080/api/offres/documents/${f.cheminFichier}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ms-2 text-info"
                                >
                                  Télécharger
                                </a>
                              )}
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => handleRemoveDocument(f.id)}
                              title="Supprimer"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success btn-lg px-5" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Chargement...
                </>
              ) : (
                <>
                  <i className="fas fa-clipboard-check me-2"></i>
                  {selectedOffre ? "Mettre à jour l'Offre" : "Vérifier et Soumettre l'Offre"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {showSummaryModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-info-circle me-2"></i>
                  Résumé de l'Offre
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowSummaryModal(false)}
                ></button>
              </div>
              <div className="modal-body text-black">
                {" "}
                <div className="mb-4 p-3 border rounded bg-light">
                  <h5 className="text-primary mb-3">
                    <i className="fas fa-file-invoice-dollar me-2"></i>Informations Générales
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Budget:</strong> {offreFormData.budget} MAD
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Opportunité liée:</strong>{" "}
                        {initialOpportunity?.projectName ||
                          opportunitiesList.find((opp) => opp.idOpp === offreFormData.incomingOpportuniteId)
                            ?.projectName ||
                          "Non spécifié"}
                      </p>
                    </div>
                    <div className="col-12">
                      <p>
                        <strong>Détails:</strong> {offreFormData.detail || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 p-3 border rounded bg-light">
                  <h5 className="text-info mb-3">
                    <i className="fas fa-tasks me-2"></i>Tâches ({offreFormData.taches.length})
                  </h5>
                  {offreFormData.taches.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {offreFormData.taches.map((tache, index) => (
                        <li
                          key={tache.id || index}
                          className="list-group-item d-flex justify-content-between align-items-center text-black"
                        >
                          <div>
                            <strong>{tache.titre}</strong> - {tache.detail}
                            <br />
                            <small className="text-muted">
                              Assigné à: {tache.assignedPerson} | Date limite:{" "}
                              {new Date(tache.deadline).toLocaleDateString()}
                            </small>
                          </div>
                          {tache.checked && <span className="badge bg-success">Terminée</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">Aucune tâche ajoutée.</p>
                  )}
                </div>
                <div className="mb-4 p-3 border rounded bg-light">
                  <h5 className="text-warning mb-3">
                    <i className="fas fa-file-alt me-2"></i>Documents ({offreFormData.documents.length})
                  </h5>
                  {offreFormData.documents.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {offreFormData.documents.map((doc, index) => (
                        <li
                          key={doc.id || index}
                          className="list-group-item d-flex justify-content-between align-items-center text-black"
                        >
                          <div>
                            <strong>{doc.namefile}</strong> ({doc.type})
                            <br />
                            <small className="text-muted">{doc.description}</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">Aucun document ajouté.</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSummaryModal(false)}>
                  <i className="fas fa-times me-2"></i>
                  Annuler
                </button>
                <button type="button" className="btn btn-success" onClick={submitOffreToBackend} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      {selectedOffre ? "Mettre à jour l'Offre" : "Soumettre l'Offre"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Offre
