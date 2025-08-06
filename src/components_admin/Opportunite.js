
"use client"

import { useState, useEffect } from "react"
import Modal from "./modal"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import api from "../services/api" // Change from "@/services/api"
import authService from "../services/authService"



function Opportunite({ onNavigateToOffre }) {
  const [opportunities, setOpportunities] = useState([])
  const [clients, setClients] = useState([])
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [activeModalId, setActiveModalId] = useState(null)
  const [status, setStatus] = useState(null)
  const [decisionExplanation, setDecisionExplanation] = useState("")
  const [showConfirmGo, setShowConfirmGo] = useState(false)
  const [showConfirmNoGo, setShowConfirmNoGo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    projectName: "",
    budget: "",
    deadline: "",
    description: "",
    incomingClientId: null,
    documents: [], // This will store metadata (title, description, fileType, path)
  })
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    fileType: "PDF",
    fileName: "", // This will store the original file name
    file: null, // This will store the actual File object
  })
  const [error, setError] = useState(null)

  const canModify = authService.canModifyOpportunities()
  const canView = authService.canViewOpportunities()

  useEffect(() => {
    fetchOpportunites()
    fetchClients()
  }, [])

  const fetchOpportunites = async () => {
    try {
      setLoading(true)
      const response = await api.get("/opportunites?_embed=documents&_embed=etat") // Use api.get
      setOpportunities(response.data)
    } catch (error) {
      console.error("Error fetching opportunities:", error)
      setError("Erreur lors du chargement des opportunités")
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients") // Use api.get
      setClients(response.data.map((client) => ({ ...client, id: client.idClient })))
    } catch (error) {
      console.error("Error fetching clients:", error)
      setError("Erreur lors du chargement des clients: " + error.message) // Display error message from backend
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClientChange = (e) => {
    const clientId = e.target.value ? Number.parseInt(e.target.value) : null
    setFormData((prev) => ({ ...prev, incomingClientId: clientId }))
  }

  const handleDocumentChange = (e) => {
    const { name, value, files } = e.target
    if (name === "file" && files?.[0]) {
      setNewDocument((prev) => ({
        ...prev,
        fileName: files[0].name, // Store original file name
        file: files[0], // Store the actual File object
      }))
    } else {
      setNewDocument((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddDocument = () => {
    if (newDocument.title && newDocument.fileName && newDocument.file) {
      // Ensure file is present
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            id: Date.now(), // Temporary ID for frontend list, will be null for backend
            title: newDocument.title,
            description: newDocument.description,
            fileType: newDocument.fileType,
            path: newDocument.fileName, // Use original file name as path for now, backend will update
            file: newDocument.file, // Keep the actual File object for submission
          },
        ],
      }))
      setNewDocument({
        title: "",
        description: "",
        fileType: "PDF",
        fileName: "",
        file: null,
      })
    }
  }

  const handleRemoveDocument = (id) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }))
  }

  const handleAddOpportunity = async () => {
    if (!canModify) return
    try {
      const opportunityData = {
        projectName: formData.projectName,
        budget: formData.budget,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString().split("T")[0] : null,
        description: formData.description,
        incomingClientId: formData.incomingClientId,
        etat: { statut: "EN_COURS" },
        // Send only metadata for documents, the actual files will be in FormData
        documents: formData.documents.map((doc) => ({
          id: doc.file ? null : doc.id, // Set ID to null for new files (those with a 'file' object)
          title: doc.title,
          description: doc.description,
          fileType: doc.fileType,
          path: doc.path, // This will be the original filename for new, or stored path for existing
        })),
      }

      const formDataToSend = new FormData()
      formDataToSend.append("opportunite", JSON.stringify(opportunityData))

      // Append actual file objects
      formData.documents.forEach((doc) => {
        if (doc.file) {
          formDataToSend.append("files", doc.file, doc.fileName) // Append the File object with its original name
        }
      })

      const response = await api.post("/opportunites", formDataToSend, {
        // Use api.post
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      })

      setOpportunities([...opportunities, response.data])
      resetForm()
      setActiveModalId(null)
    } catch (error) {
      console.error("Error adding opportunity:", error)
      setError(error.message || "Erreur lors de l'ajout de l'opportunité")
    }
  }

  const handleUpdateOpportunity = async () => {
    if (!canModify) return
    try {
      // Debugging logs
      console.log("Attempting to update opportunity with ID:", selectedOpportunity?.idOpp)
      console.log("Current selectedOpportunity state:", selectedOpportunity)

      const opportunityData = {
        projectName: formData.projectName,
        budget: formData.budget,
        description: formData.description,
        incomingClientId: formData.incomingClientId,
        idOpp: selectedOpportunity.idOpp, // Ensure this ID is correct
        deadline: formData.deadline ? new Date(formData.deadline).toISOString().split("T")[0] : null,
        // Send only metadata for documents, the actual files will be in FormData
        documents: formData.documents.map((doc) => ({
          id: doc.file ? null : doc.id, // Set ID to null for new files (those with a 'file' object)
          title: doc.title,
          description: doc.description,
          fileType: doc.fileType,
          path: doc.path, // This will be the stored filename for existing, or original for new
        })),
      }

      // Debugging log for data being sent
      console.log("Opportunity data being sent:", opportunityData)

      const formDataToSend = new FormData()
      formDataToSend.append("opportunite", JSON.stringify(opportunityData))

      // Append actual file objects for new/changed files
      formData.documents.forEach((doc) => {
        if (doc.file) {
          // Only append if a new File object is present
          formDataToSend.append("files", doc.file, doc.fileName)
        }
      })

      // Debugging log for files being sent
      console.log(
        "Files being sent:",
        formData.documents.filter((doc) => doc.file).map((doc) => doc.fileName),
      )

      // IMPORTANT: Changed URL to use query parameter for ID as per backend change
      const response = await api.put(`/opportunites?id=${selectedOpportunity.idOpp}`, formDataToSend, {
        // Use api.put
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      })

      setOpportunities(opportunities.map((opp) => (opp.idOpp === response.data.idOpp ? response.data : opp)))
      resetForm()
      setActiveModalId(null)
      // IMPORTANT: Update selectedOpportunity with the new data to stay on the details page
      setSelectedOpportunity(response.data) // Keep this line to stay on the details page
    } catch (error) {
      console.error("Error updating opportunity:", error)
      setError("Erreur lors de la mise à jour de l'opportunité")
    }
  }

  const handleDeleteOpportunity = async (id) => {
    if (!canModify) return
    try {
      await api.delete(`/opportunites/${id}`) // Use api.delete
      setOpportunities(opportunities.filter((opp) => opp.idOpp !== id))
      setActiveModalId(null)
    } catch (error) {
      console.error("Error deleting opportunity:", error)
      setError("Erreur lors de la suppression de l'opportunité")
    }
  }

  const updateOpportuniteStatus = async (status, explanation) => {
    if (!canModify) return
    try {
      const url = `/opportunites/${selectedOpportunity.idOpp}/statut?statut=${status}`
      const fullUrl = status === "NO_GO" ? `${url}&justification=${encodeURIComponent(explanation)}` : url

      const response = await api.put(fullUrl) // Use api.put
      setOpportunities(opportunities.map((opp) => (opp.idOpp === response.data.idOpp ? response.data : opp)))
      setSelectedOpportunity(response.data)
    } catch (error) {
      console.error("Error updating status:", error)
      setError("Erreur lors de la mise à jour du statut")
    }
  }

  const handleDetailsClick = (opp) => {
    setSelectedOpportunity(opp)
    setActiveModalId(null)
    setStatus(opp.etat?.statut || null)
    setDecisionExplanation(opp.etat?.justification || "")
  }

  const handleEditClick = (opp) => {
    setSelectedOpportunity(opp)
    setFormData({
      projectName: opp.projectName,
      budget: opp.budget,
      deadline: opp.deadline ? new Date(opp.deadline).toISOString().split("T")[0] : "",
      description: opp.description,
      incomingClientId: opp.client?.idClient || null,
      // When editing, documents from the backend already have their stored 'path'
      // We need to ensure 'file' is null for existing documents unless a new file is selected
      documents: opp.documents ? opp.documents.map((doc) => ({ ...doc, file: null })) : [],
    })
    setActiveModalId("editModal")
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    if (newStatus === "GO") {
      setShowConfirmGo(true)
      setShowConfirmNoGo(false)
    } else {
      setShowConfirmGo(false)
      setShowConfirmNoGo(true)
    }
  }

  const confirmDecision = (confirmed) => {
    if (confirmed) {
      updateOpportuniteStatus(status, decisionExplanation)
    }
    setShowConfirmGo(false)
    setShowConfirmNoGo(false)
    setDecisionExplanation("")
  }

  const resetForm = () => {
    setFormData({
      projectName: "",
      budget: "",
      deadline: "",
      description: "",
      incomingClientId: null,
      documents: [],
    })
    setNewDocument({
      title: "",
      description: "",
      fileType: "PDF",
      fileName: "",
      file: null,
    })
  }

  const handleBackClick = () => {
    setSelectedOpportunity(null)
    setStatus(null)
    setDecisionExplanation("")
    setShowConfirmGo(false)
    setShowConfirmNoGo(false)
  }

  if (!canView) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Accès refusé</h4>
          <p>Vous n'avez pas les permissions nécessaires pour voir les opportunités.</p>
        </div>
      </div>
    )
  }

  if (selectedOpportunity && !activeModalId) {
    return (
      <div className="p-4">
        <button className="btn btn-secondary mb-3" onClick={handleBackClick}>
          ← Retour à la liste
        </button>

        {selectedOpportunity.etat?.statut === "NO_GO" && (
          <div className="alert alert-danger mb-4">
            <h4 className="text-danger">NO GO</h4>
            <p className="mb-0">{selectedOpportunity.etat.justification}</p>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Étude de faisabilité de l'opportunité</h2>
          {canModify ? (
            selectedOpportunity.etat?.statut === "GO" ? (
              <button className="btn btn-success" onClick={() => onNavigateToOffre(selectedOpportunity)}>
                + Offre
              </button>
            ) : selectedOpportunity.etat?.statut === "NO_GO" ? (
              <button className="btn btn-danger" disabled>
                ❌ NO GO
              </button>
            ) : (
              <>
                <button
                  className={`btn me-2 ${status === "GO" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => handleStatusChange("GO")}
                >
                  ✅ GO
                </button>
                <button
                  className={`btn ${status === "NO_GO" ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => handleStatusChange("NO_GO")}
                >
                  ❌ NO GO
                </button>
              </>
            )
          ) : (
            <div className="alert alert-info">
              <i className="fas fa-eye me-2"></i>
              Mode lecture seule
            </div>
          )}
        </div>

        {showConfirmGo && (
          <div className="card mb-4 border-success">
            <div className="card-header bg-success text-white">Confirmation GO</div>
            <div className="card-body">
              <p>Confirmez-vous le GO pour cette opportunité?</p>
              <div className="d-flex justify-content-end">
                <button className="btn btn-outline-secondary me-2" onClick={() => confirmDecision(false)}>
                  Annuler
                </button>
                <button className="btn btn-success" onClick={() => confirmDecision(true)}>
                  Confirmer GO
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmNoGo && (
          <div className="card mb-4 border-danger">
            <div className="card-header bg-danger text-white">Confirmation NO GO</div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="explanation" className="form-label">
                  Veuillez expliquer la décision NO GO:
                </label>
                <textarea
                  id="explanation"
                  className="form-control"
                  rows="3"
                  value={decisionExplanation}
                  onChange={(e) => setDecisionExplanation(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-outline-secondary me-2" onClick={() => confirmDecision(false)}>
                  Annuler
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => confirmDecision(true)}
                  disabled={!decisionExplanation}
                >
                  Confirmer NO GO
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 g-4">
          {[
            { label: "📌 Nom du projet", value: selectedOpportunity.projectName },
            { label: "🏢 Client", value: selectedOpportunity.client?.name || "Non spécifié" },
            { label: "💰 Budget", value: selectedOpportunity.budget || "Non spécifié" },
            { label: "📅 Deadline", value: selectedOpportunity.deadline || "Non spécifié" },
            { label: "📝 Description", value: selectedOpportunity.description || "Non spécifié" },
          ].map((item, index) => (
            <div className="col" key={`detail-${index}`}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold">{item.label}</h5>
                  <p className="card-text" style={{ color: "#000", fontWeight: 600 }}>{item.value}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">📎 Documents attachés</h5>
                <ul className="mb-0">
                  {selectedOpportunity.documents?.length > 0 ? (
                    selectedOpportunity.documents.map((doc, index) => (
                      <li key={`doc-${doc.id || index}`} style={{ marginBottom: 8 }}>
                        <a
                          href={`http://localhost:8080/api/opportunites/documents/${doc.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#000", fontWeight: 600, textDecoration: "none" }}
                        >
                          📄 {doc.title} ({doc.fileType})
                        </a>
                        {doc.description && <p className="small mb-0" style={{ color: "#6c757d" }}>{doc.description}</p>}
                      </li>
                    ))
                  ) : (
                    <li style={{ color: "#6c757d" }}>Aucun document</li>
                  )}
                </ul>
              </div>
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
          Liste des Opportunités
        </h4>
        {canModify && (
          <button className="btn btn-sm rounded-4 bg-white" onClick={() => setActiveModalId("addModal")}>
            <i className="fa-solid fa-plus me-2 text-teal"></i> Ajouter
          </button>
        )}
      </div>


      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="shadow-lg rounded-3 w-100 border p-3">
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Projet</th>
                <th>Client</th>
                <th>Budget</th>
                <th>Deadline</th>
                <th>Statut</th>
                <th className="text-center">Détails</th>
                {canModify && <th className="text-center">Modifier</th>}
                {canModify && <th className="text-center">Supprimer</th>}
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={`opp-${opp.idOpp}`}>
                  <td>{opp.projectName}</td>
                  <td>{opp.client?.name || "Non spécifié"}</td>
                  <td>{opp.budget || "Non spécifié"}</td>
                  <td>{opp.deadline || "Non spécifié"}</td>
                  <td>
                    {opp.etat?.statut === "GO" ? (
                      <span className="badge bg-success">GO</span>
                    ) : opp.etat?.statut === "NO_GO" ? (
                      <span className="badge bg-danger">NO GO</span>
                    ) : (
                      <span className="badge bg-secondary">En cours</span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleDetailsClick(opp)}
                      title="Détails"
                    >
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </td>
                  {canModify && (
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditClick(opp)}
                        title="Modifier"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </td>
                  )}
                  {canModify && (
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setSelectedOpportunity(opp)
                          setActiveModalId("deleteModal")
                        }}
                        title="Supprimer"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Ajout */}
      {activeModalId === "addModal" && canModify && (
        <Modal title="Nouvelle Opportunité" color="#008080" onClose={() => setActiveModalId(null)}>
          <form className="d-flex flex-column gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nom du projet"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              required
            />
            <select
              className="form-control"
              value={formData.incomingClientId || ""}
              onChange={handleClientChange}
              required
            >
              <option value="">Choisir un client</option>
              {clients.map((client) => (
                <option key={`client-${client.id}`} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Budget (MAD)"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              className="form-control"
              placeholder="Deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
            />
            <textarea
              className="form-control"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />

            <div className="card p-3">
              <h5 style={{ color: "#000" }}>Documents</h5>

              {formData.documents.map((doc) => (
                <div key={`doc-form-${doc.id}`} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong style={{ color: "#000", fontWeight: 700 }}>{doc.title}</strong> ({doc.fileType})
                    {doc.description && <p className="small mb-0" style={{ color: "#6c757d" }}>{doc.description}</p>}
                  </div>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveDocument(doc.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}

              <div className="mt-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Titre du document"
                  name="title"
                  value={newDocument.title}
                  onChange={handleDocumentChange}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  name="description"
                  value={newDocument.description}
                  onChange={handleDocumentChange}
                  rows="2"
                />
                <select
                  className="form-control mb-2"
                  name="fileType"
                  value={newDocument.fileType}
                  onChange={handleDocumentChange}
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="PPT">PPT</option>
                </select>
                <input type="file" className="form-control mb-2" name="file" onChange={handleDocumentChange} />
                {newDocument.fileName && (
                  <p className="small mt-1" style={{ color: "#6c757d" }}>Fichier sélectionné: {newDocument.fileName}</p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAddDocument}
                  disabled={!newDocument.title || !newDocument.fileName || !newDocument.file} // Ensure file is selected
                >
                  Ajouter document
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddOpportunity}
              disabled={!formData.projectName || !formData.incomingClientId || !formData.budget}
            >
              Ajouter
            </button>
          </form>
        </Modal>
      )}

      {/* Modal Modification */}
      {activeModalId === "editModal" && canModify && selectedOpportunity && (
        <Modal title="Modifier Opportunité" color="green" onClose={() => setActiveModalId(null)}>
          <form className="d-flex flex-column gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Nom du projet"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              required
            />
            <select
              className="form-control"
              value={formData.incomingClientId || ""}
              onChange={handleClientChange}
              required
            >
              <option value="">Choisir un client</option>
              {clients.map((client) => (
                <option key={`client-edit-${client.id}`} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Budget (MAD)"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              className="form-control"
              placeholder="Deadline"
              name="deadline"
              value={formData.deadline} // This is now formatted to yyyy-MM-dd
              onChange={handleInputChange}
            />
            <textarea
              className="form-control"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />

            <div className="card p-3">
              <h5>Documents</h5>
              {formData.documents.map((doc) => (
                <div key={`doc-edit-${doc.id}`} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong style={{ color: "#000", fontWeight: 700 }}>{doc.title}</strong> ({doc.fileType})
                    {doc.description && <p className="small mb-0" style={{ color: "#6c757d" }}>{doc.description}</p>}
                  </div>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveDocument(doc.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}

              <div className="mt-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Titre du document"
                  name="title"
                  value={newDocument.title}
                  onChange={handleDocumentChange}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  name="description"
                  value={newDocument.description}
                  onChange={handleDocumentChange}
                  rows="2"
                />
                <select
                  className="form-control mb-2"
                  name="fileType"
                  value={newDocument.fileType}
                  onChange={handleDocumentChange}
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="PPT">PPT</option>
                </select>
                <input type="file" className="form-control mb-2" name="file" onChange={handleDocumentChange} />
                {newDocument.fileName && (
                  <p className="small mt-1" style={{ color: "#6c757d" }}>Fichier sélectionné: {newDocument.fileName}</p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAddDocument}
                  disabled={!newDocument.title || !newDocument.fileName || !newDocument.file} // Ensure file is selected
                >
                  Ajouter document
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateOpportunity}
              disabled={!formData.projectName || !formData.incomingClientId || !formData.budget}
            >
              Mettre à jour
            </button>
          </form>
        </Modal>
      )}

      {/* Modal Suppression */}
      {activeModalId === "deleteModal" && canModify && selectedOpportunity && (
        <Modal title="Supprimer Opportunité" color="red" onClose={() => setActiveModalId(null)}>
          <p>Confirmer la suppression de l'opportunité "{selectedOpportunity.projectName}" ?</p>
          <button className="btn btn-danger" onClick={() => handleDeleteOpportunity(selectedOpportunity.idOpp)}>
            Oui, supprimer
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => setActiveModalId(null)}>
            Annuler
          </button>
        </Modal>
      )}
    </div>
  )
}

export default Opportunite
