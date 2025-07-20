"use client"

import { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"

function Offre() {
  const [currentView, setCurrentView] = useState("create") // "create" ou "list"
  const [showChecklist, setShowChecklist] = useState(false)
  const [budget, setBudget] = useState("")
  const [task, setTask] = useState({
    title: "",
    detail: "",
    deadline: "",
    assignedPerson: "",
  })
  const [tasks, setTasks] = useState([])
  const [fileMeta, setFileMeta] = useState({
    name: "",
    description: "",
    file: null,
  })
  const [filesMeta, setFilesMeta] = useState([])
  const [submittedOffers, setSubmittedOffers] = useState([
    {
      id: 1,
      project: "Migration Cloud ACME",
      budget: "50000",
      submittedDate: "2024-01-15",
      status: "En cours",
      tasksCount: 5,
      documentsCount: 8,
    },
    {
      id: 2,
      project: "Développement App Mobile",
      budget: "75000",
      submittedDate: "2024-01-10",
      status: "Win",
      tasksCount: 8,
      documentsCount: 12,
    },
  ])

  // Checklist des documents requis
  const [checklist, setChecklist] = useState({
    registreCommerce: false,
    attestationFiscale: false,
    attestationCNSS: false,
    bilanFinancier: false,
    lettreEngagement: false,
    dossierTechnique: false,
    references: false,
    assurance: false,
  })

  const checklistItems = [
    { key: "registreCommerce", label: "Registre de Commerce (RC)", required: true },
    { key: "attestationFiscale", label: "Attestation Fiscale", required: true },
    { key: "attestationCNSS", label: "Attestation CNSS", required: true },
    { key: "bilanFinancier", label: "Bilan Financier (3 dernières années)", required: true },
    { key: "lettreEngagement", label: "Lettre d'Engagement", required: true },
    { key: "dossierTechnique", label: "Dossier Technique", required: true },
    { key: "references", label: "Références et Attestations de Bonne Exécution", required: false },
    { key: "assurance", label: "Attestation d'Assurance", required: false },
  ]

  const handleAddTask = () => {
    if (task.title && task.detail && task.deadline && task.assignedPerson) {
      setTasks([...tasks, { ...task, id: Date.now() }])
      setTask({ title: "", detail: "", deadline: "", assignedPerson: "" })
    }
  }

  const handleAddFileMeta = () => {
    if (fileMeta.name && fileMeta.description && fileMeta.file) {
      setFilesMeta([...filesMeta, { ...fileMeta, id: Date.now() }])
      setFileMeta({ name: "", description: "", file: null })
    }
  }

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleRemoveFile = (id) => {
    setFilesMeta(filesMeta.filter((f) => f.id !== id))
  }

  const handleSubmitClick = (e) => {
    e.preventDefault()
    setShowChecklist(true)
  }

  const handleFinalSubmit = () => {
    const requiredItems = checklistItems.filter((item) => item.required)
    const checkedRequired = requiredItems.filter((item) => checklist[item.key])

    if (checkedRequired.length < requiredItems.length) {
      alert("Veuillez vérifier tous les documents obligatoires avant de soumettre.")
      return
    }

    // Créer la nouvelle offre
    const newOffer = {
      id: Date.now(),
      project: `Offre ${submittedOffers.length + 1}`,
      budget: budget,
      submittedDate: new Date().toISOString().split("T")[0],
      status: "En cours",
      tasksCount: tasks.length,
      documentsCount: filesMeta.length,
    }

    setSubmittedOffers([...submittedOffers, newOffer])
    setShowChecklist(false)

    // Reset form
    setBudget("")
    setTasks([])
    setFilesMeta([])
    setChecklist({
      registreCommerce: false,
      attestationFiscale: false,
      attestationCNSS: false,
      bilanFinancier: false,
      lettreEngagement: false,
      dossierTechnique: false,
      references: false,
      assurance: false,
    })

    // Aller à la liste des offres
    setCurrentView("list")
  }

  const handleStatusChange = (offerId, newStatus) => {
    setSubmittedOffers(submittedOffers.map((offer) => (offer.id === offerId ? { ...offer, status: newStatus } : offer)))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Win":
        return "bg-success"
      case "Lost":
        return "bg-danger"
      case "En cours":
        return "bg-warning"
      default:
        return "bg-secondary"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Win":
        return "fas fa-trophy"
      case "Lost":
        return "fas fa-times-circle"
      case "En cours":
        return "fas fa-clock"
      default:
        return "fas fa-question"
    }
  }

  // Calculs pour les statistiques
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const pendingTasks = tasks.length - completedTasks
  const totalFileSize = filesMeta.reduce((acc, file) => acc + (file.file?.size || 0), 0)
  const fileSizeInMB = (totalFileSize / (1024 * 1024)).toFixed(2)

  if (currentView === "list") {
    return (
      <div className="d-flex flex-column p-3 align-items-center" style={{ backgroundColor: "white" }}>
        {/* Header */}
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
          <button className="btn btn-sm rounded-4 bg-white" onClick={() => setCurrentView("create")}>
            <i className="fas fa-plus me-2 text-success"></i> Nouvelle Offre
          </button>
        </div>

        {/* Statistiques des offres */}
        <div className="row g-3 mb-4 w-100" style={{ maxWidth: "1200px" }}>
          <div className="col-md-3">
            <div className="card text-center border-primary">
              <div className="card-body">
                <i className="fas fa-list-alt fa-2x text-primary mb-2"></i>
                <h4 className="text-primary">{submittedOffers.length}</h4>
                <p className="card-text">Total Offres</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-success">
              <div className="card-body">
                <i className="fas fa-trophy fa-2x text-success mb-2"></i>
                <h4 className="text-success">{submittedOffers.filter((o) => o.status === "Win").length}</h4>
                <p className="card-text">Gagnées</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-danger">
              <div className="card-body">
                <i className="fas fa-times-circle fa-2x text-danger mb-2"></i>
                <h4 className="text-danger">{submittedOffers.filter((o) => o.status === "Lost").length}</h4>
                <p className="card-text">Perdues</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center border-warning">
              <div className="card-body">
                <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                <h4 className="text-warning">{submittedOffers.filter((o) => o.status === "En cours").length}</h4>
                <p className="card-text">En Cours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="shadow-lg rounded-3 w-100 border p-3" style={{ maxWidth: "1200px" }}>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Projet</th>
                <th>Budget</th>
                <th>Date Soumission</th>
                <th>Tâches</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedOffers.map((offer) => (
                <tr key={offer.id}>
                  <td className="fw-bold">{offer.project}</td>
                  <td>{offer.budget} MAD</td>
                  <td>{new Date(offer.submittedDate).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-primary">{offer.tasksCount}</span>
                  </td>
                  <td>
                    <span className="badge bg-info">{offer.documentsCount}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(offer.status)}`}>
                      <i className={`${getStatusIcon(offer.status)} me-1`}></i>
                      {offer.status}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        Changer Status
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button className="dropdown-item" onClick={() => handleStatusChange(offer.id, "En cours")}>
                            <i className="fas fa-clock me-2 text-warning"></i>
                            En cours
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={() => handleStatusChange(offer.id, "Win")}>
                            <i className="fas fa-trophy me-2 text-success"></i>
                            Win
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={() => handleStatusChange(offer.id, "Lost")}>
                            <i className="fas fa-times-circle me-2 text-danger"></i>
                            Lost
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column p-3 align-items-center" style={{ backgroundColor: "white" }}>
      {/* Header */}
      <div
        className="rounded-3 p-3 shadow-lg d-flex justify-content-between w-100 mb-4"
        style={{
          background: "linear-gradient(to right,rgba(4,4,4,0.77),rgba(45,79,39,0.77),rgba(96,54,39,0.77))",
          zIndex: 1,
        }}
      >
        <h4 className="text-white" style={{ fontFamily: "corbel" }}>
          📋 Création d'Offre
        </h4>
        <button className="btn btn-sm rounded-4 bg-white" onClick={() => setCurrentView("list")}>
          <i className="fas fa-list me-2 text-primary"></i> Voir les Offres
        </button>
      </div>

      <div className="w-100" style={{ maxWidth: "1400px" }}>
        {/* Section Calculs/Statistiques en haut */}
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
                  <h4 className="text-success">{budget || "0"} MAD</h4>
                  <p className="card-text text-muted">Budget Total</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-primary h-100">
                <div className="card-body">
                  <i className="fas fa-tasks fa-2x text-primary mb-2"></i>
                  <h4 className="text-primary">{tasks.length}</h4>
                  <p className="card-text text-muted">Tâches Totales</p>
                  <small className="text-success">{completedTasks} terminées</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center border-warning h-100">
                <div className="card-body">
                  <i className="fas fa-file-alt fa-2x text-warning mb-2"></i>
                  <h4 className="text-warning">{filesMeta.length}</h4>
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
                    {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                  </h4>
                  <p className="card-text text-muted">Progression</p>
                  <small className="text-secondary">{pendingTasks} en attente</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitClick}>
          {/* Section Budget Configuration */}
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
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Entrer le budget"
                    style={{ borderColor: "#28a745" }}
                  />
                  <span className="input-group-text">MAD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaires côte à côte */}
          <div className="row g-4">
            {/* Colonne Gauche - Gestion des Tâches */}
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

                {/* Formulaire d'ajout de tâche */}
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
                      value={task.title}
                      onChange={(e) => setTask({ ...task, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Détails de la tâche"
                      value={task.detail}
                      onChange={(e) => setTask({ ...task, detail: e.target.value })}
                    />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="date"
                        className="form-control"
                        value={task.deadline}
                        onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Assignée à"
                        value={task.assignedPerson}
                        onChange={(e) => setTask({ ...task, assignedPerson: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary w-100" onClick={handleAddTask}>
                    <i className="fas fa-plus me-2"></i>
                    Ajouter Tâche
                  </button>
                </div>

                {/* Liste des tâches */}
                {tasks.length > 0 && (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <h6 className="text-success mb-3">
                      <i className="fas fa-list me-2"></i>
                      Tâches ({tasks.length})
                    </h6>
                    {tasks.map((t) => (
                      <div key={t.id} className="card mb-2 border-primary">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="card-title text-primary mb-1">{t.title}</h6>
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
                              onClick={() => handleRemoveTask(t.id)}
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

            {/* Colonne Droite - Gestion des Documents */}
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

                {/* Formulaire d'ajout de fichier */}
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
                      value={fileMeta.name}
                      onChange={(e) => setFileMeta({ ...fileMeta, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Description du document"
                      value={fileMeta.description}
                      onChange={(e) => setFileMeta({ ...fileMeta, description: e.target.value })}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="file"
                      className="form-control mb-2"
                      onChange={(e) => setFileMeta({ ...fileMeta, file: e.target.files[0] })}
                    />
                  </div>
                  <button type="button" className="btn btn-warning w-100" onClick={handleAddFileMeta}>
                    <i className="fas fa-upload me-2"></i>
                    Ajouter Document
                  </button>
                </div>

                {/* Liste des fichiers */}
                {filesMeta.length > 0 && (
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <h6 className="text-info mb-3">
                      <i className="fas fa-folder-open me-2"></i>
                      Documents ({filesMeta.length})
                    </h6>
                    {filesMeta.map((f) => (
                      <div key={f.id} className="card mb-2 border-warning">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="card-title text-warning mb-1">
                                <i className="fas fa-file-alt me-2"></i>
                                {f.name}
                              </h6>
                              <p className="card-text text-muted small mb-1">{f.description}</p>
                              <small className="badge bg-secondary">{f.file?.type || "Document"}</small>
                              {f.file?.size && (
                                <small className="text-muted ms-2">({(f.file.size / 1024).toFixed(1)} KB)</small>
                              )}
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => handleRemoveFile(f.id)}
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

          {/* Bouton de soumission */}
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success btn-lg px-5">
              <i className="fas fa-clipboard-check me-2"></i>
              Vérifier et Soumettre l'Offre
            </button>
          </div>
        </form>
      </div>

      {/* Modal Checklist */}
      {showChecklist && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-clipboard-check me-2"></i>
                  Checklist de Vérification - Documents Requis
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowChecklist(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Veuillez vérifier que vous avez tous les documents requis avant de soumettre votre offre.
                </div>

                <div className="row">
                  {checklistItems.map((item) => (
                    <div key={item.key} className="col-md-6 mb-3">
                      <div className={`card ${item.required ? "border-danger" : "border-secondary"}`}>
                        <div className="card-body p-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={item.key}
                              checked={checklist[item.key]}
                              onChange={(e) => setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                            />
                            <label className="form-check-label" htmlFor={item.key}>
                              <strong>{item.label}</strong>
                              {item.required && <span className="text-danger ms-1">*</span>}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="alert alert-warning mt-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <strong>Note:</strong> Les documents marqués d'un astérisque (*) sont obligatoires pour la soumission.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowChecklist(false)}>
                  <i className="fas fa-times me-2"></i>
                  Annuler
                </button>
                <button type="button" className="btn btn-success" onClick={handleFinalSubmit}>
                  <i className="fas fa-paper-plane me-2"></i>
                  Soumettre l'Offre
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
