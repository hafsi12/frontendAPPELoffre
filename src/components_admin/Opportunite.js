"use client"

import { useState, useEffect } from "react"
import Modal from "./modal"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

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
    documents: [],
  })
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    fileType: "PDF",
    fileName: "",
    file: null,
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOpportunites()
    fetchClients()
  }, [])

  const fetchOpportunites = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8080/api/opportunites?_embed=documents&_embed=etat")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setOpportunities(data)
    } catch (error) {
      console.error("Error fetching opportunities:", error)
      setError("Erreur lors du chargement des opportunités")
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/clients")
      if (!response.ok) {
        const errorText = await response.text() // Read response as text to see malformed JSON
        console.error("Server error response (text for clients):", errorText)
        throw new Error(`HTTP error! status: ${response.status}. Server response: ${errorText.substring(0, 200)}...`)
      }
      const data = await response.json()
      setClients(data.map((client) => ({ ...client, id: client.idClient })))
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
        fileName: files[0].name,
        file: files[0],
      }))
    } else {
      setNewDocument((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddDocument = () => {
    if (newDocument.title && newDocument.fileName) {
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            id: Date.now(),
            title: newDocument.title,
            description: newDocument.description,
            fileType: newDocument.fileType,
            path: newDocument.fileName,
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
    try {
      const requestData = {
        projectName: formData.projectName,
        budget: formData.budget,
        // Ensure deadline is formatted correctly for backend if it's a Date object
        deadline: formData.deadline ? new Date(formData.deadline).toISOString().split("T")[0] : null,
        description: formData.description,
        incomingClientId: formData.incomingClientId,
        etat: { statut: "EN_COURS" },
        documents: formData.documents.map((doc) => ({
          title: doc.title,
          description: doc.description,
          fileType: doc.fileType,
          path: doc.path,
        })),
      }
      const response = await fetch("http://localhost:8080/api/opportunites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response (text):", errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError)
          throw new Error(
            `Server responded with non-JSON error: ${errorText.substring(0, 200)}... (Status: ${response.status})`,
          )
        }
      }
      const data = await response.json()
      setOpportunities([...opportunities, data])
      resetForm()
      setActiveModalId(null)
    } catch (error) {
      console.error("Error adding opportunity:", error)
      setError(error.message || "Erreur lors de l'ajout de l'opportunité")
    }
  }

  const handleUpdateOpportunity = async () => {
    try {
      const requestData = {
        projectName: formData.projectName,
        budget: formData.budget,
        description: formData.description,
        incomingClientId: formData.incomingClientId,
        idOpp: selectedOpportunity.idOpp,
        // Format deadline to 'yyyy-MM-dd' for the backend
        deadline: formData.deadline ? new Date(formData.deadline).toISOString().split("T")[0] : null,
        documents: formData.documents.map((doc) => ({
          title: doc.title,
          description: doc.description,
          fileType: doc.fileType,
          path: doc.path,
        })),
      }
      const response = await fetch(`http://localhost:8080/api/opportunites/${selectedOpportunity.idOpp}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response (text):", errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError)
          throw new Error(
            `Server responded with non-JSON error: ${errorText.substring(0, 200)}... (Status: ${response.status})`,
          )
        }
      }
      const data = await response.json()
      setOpportunities(opportunities.map((opp) => (opp.idOpp === data.idOpp ? data : opp)))
      resetForm()
      setActiveModalId(null)
      setSelectedOpportunity(null)
    } catch (error) {
      console.error("Error updating opportunity:", error)
      setError("Erreur lors de la mise à jour de l'opportunité")
    }
  }

  const handleDeleteOpportunity = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/opportunites/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response (text):", errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError)
          throw new Error(
            `Server responded with non-JSON error: ${errorText.substring(0, 200)}... (Status: ${response.status})`,
          )
        }
      }
      setOpportunities(opportunities.filter((opp) => opp.idOpp !== id))
      setActiveModalId(null)
    } catch (error) {
      console.error("Error deleting opportunity:", error)
      setError("Erreur lors de la suppression de l'opportunité")
    }
  }

  const updateOpportuniteStatus = async (status, explanation) => {
    try {
      const url = `http://localhost:8080/api/opportunites/${selectedOpportunity.idOpp}/statut?statut=${status}`
      const fullUrl = status === "NO_GO" ? `${url}&justification=${encodeURIComponent(explanation)}` : url
      const response = await fetch(fullUrl, { method: "PUT" })
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response (text):", errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError)
          throw new Error(
            `Server responded with non-JSON error: ${errorText.substring(0, 200)}... (Status: ${response.status})`,
          )
        }
      }
      const data = await response.json()
      setOpportunities(opportunities.map((opp) => (opp.idOpp === data.idOpp ? data : opp)))
      setSelectedOpportunity(data)
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
      // Format deadline for the input type="date"
      deadline: opp.deadline ? new Date(opp.deadline).toISOString().split("T")[0] : "",
      description: opp.description,
      incomingClientId: opp.client?.idClient || null,
      documents: opp.documents || [],
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
          <div>
            {selectedOpportunity.etat?.statut === "GO" ? (
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
            )}
          </div>
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
                  <p className="card-text text-gray-800 font-semibold">{item.value}</p>
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
                      <li key={`doc-${doc.id || index}`}>
                        <a
                          href={doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 font-semibold"
                        >
                          📄 {doc.title} ({doc.fileType})
                        </a>
                        {doc.description && <p className="text-gray-600 small mb-0">{doc.description}</p>}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600">Aucun document</li>
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
        <button className="btn btn-sm rounded-4 bg-white" onClick={() => setActiveModalId("addModal")}>
          <i className="fa-solid fa-plus me-2 text-teal"></i> Ajouter
        </button>
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
                <th className="text-center">Actions</th>
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
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleDetailsClick(opp)}
                        title="Détails"
                      >
                        <i className="fa-solid fa-search"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditClick(opp)}
                        title="Modifier"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Ajout */}
      {activeModalId === "addModal" && (
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
              <h5>Documents</h5>
              {formData.documents.map((doc) => (
                <div key={`doc-form-${doc.id}`} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong className="text-gray-800 font-semibold">{doc.title}</strong> ({doc.fileType})
                    {doc.description && <p className="text-gray-600 small mb-0">{doc.description}</p>}
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
                  <p className="text-gray-600 small mt-1">Fichier sélectionné: {newDocument.fileName}</p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAddDocument}
                  disabled={!newDocument.title || !newDocument.fileName}
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
      {activeModalId === "editModal" && selectedOpportunity && (
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
                    <strong className="text-gray-800 font-semibold">{doc.title}</strong> ({doc.fileType})
                    {doc.description && <p className="text-gray-600 small mb-0">{doc.description}</p>}
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
                  <p className="text-gray-600 small mt-1">Fichier sélectionné: {newDocument.fileName}</p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAddDocument}
                  disabled={!newDocument.title || !newDocument.fileName}
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
      {activeModalId === "deleteModal" && selectedOpportunity && (
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
