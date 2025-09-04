"use client"
import { useState, useEffect, useCallback } from "react"
import {
  getClients,
  createClient,
  updateClient,
  archiveClient,
  createContact,
  getClientById,
} from "../api/clientService"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/dashboard.css"
import Modal from "./modal"
import authService from "../services/authService"

// Composant Formulaire Client
const FormClient = ({ formData, onChange, onSubmit, editMode = false, readOnly = false }) => {
  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <input
        className="form-control"
        name="name"
        placeholder="Nom du client"
        value={formData.name}
        onChange={onChange}
        required
        readOnly={readOnly}
      />
      <div className="row">
        <div className="col-md-6">
          <input
            className="form-control"
            name="country"
            placeholder="Pays"
            value={formData.country || ""}
            onChange={onChange}
            readOnly={readOnly}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="city"
            placeholder="Ville"
            value={formData.city || ""}
            onChange={onChange}
            readOnly={readOnly}
          />
        </div>
      </div>
      <input
        className="form-control"
        name="address"
        placeholder="Adresse"
        value={formData.address}
        onChange={onChange}
        readOnly={readOnly}
      />
      <div className="row">
        <div className="col-md-6">
          <input
            className="form-control"
            name="webSite"
            placeholder="Site Web"
            value={formData.webSite}
            onChange={onChange}
            readOnly={readOnly}
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="landline"
            placeholder="Téléphone fixe"
            value={formData.landline || ""}
            onChange={onChange}
            readOnly={readOnly}
          />
        </div>
      </div>
      <input
        className="form-control"
        name="secteur"
        placeholder="Secteur"
        value={formData.secteur}
        onChange={onChange}
        readOnly={readOnly}
      />
      {!readOnly && (
        <button type="submit" className="btn btn-success">
          {editMode ? "Mettre à jour" : "Ajouter"}
        </button>
      )}
    </form>
  )
}

// Composant Formulaire Contact
const FormContact = ({ onSubmit, onChange, formData, readOnly = false }) => {
  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <input
        className="form-control"
        name="name"
        placeholder="Nom complet"
        value={formData.name}
        onChange={onChange}
        required
        readOnly={readOnly}
      />
      <input
        className="form-control"
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={onChange}
        required
        readOnly={readOnly}
      />
      <input
        className="form-control"
        name="phone"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={onChange}
        readOnly={readOnly}
      />
      <input
        className="form-control"
        name="position"
        placeholder="Poste"
        value={formData.position}
        onChange={onChange}
        readOnly={readOnly}
      />
      {!readOnly && (
        <button type="submit" className="btn btn-primary">
          Enregistrer
        </button>
      )}
    </form>
  )
}

// Composant Liste des Contacts
const ClientContacts = ({ clientId }) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    clientId: clientId,
  })

  const canModify = authService.canModifyClients()

  const fetchContacts = useCallback(async () => {
    try {
      const response = await getClientById(clientId)
      setContacts(Array.from(response.data.contacts || []))
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setContacts([])
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    if (clientId) fetchContacts()
  }, [clientId, fetchContacts])

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canModify) {
      alert("Vous n'avez pas les permissions pour ajouter des contacts")
      return
    }

    try {
      await createContact(clientId, contactForm)
      setShowForm(false)
      fetchContacts()
      setContactForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        clientId: clientId,
      })
    } catch (error) {
      console.error("Error adding contact:", error)
      alert(`Erreur lors de l'ajout du contact: ${error.response?.data?.message || error.message}`)
    }
  }

  if (loading) return <div>Chargement des contacts...</div>

  return (
    <div>
      {!showForm ? (
        <>
          {canModify && (
            <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
              + Ajouter Contact
            </button>
          )}
          {contacts.length > 0 ? (
            <div className="row">
              {contacts.map((contact) => (
                <div key={contact.id} className="col-md-6 mb-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="card-title fw-bold" style={{ color: "green" }}>{contact.name}</h6>
                      <p className="card-text mb-1" style={{ color: "black" }}>
                        <small style={{ color: "green" }}>Poste:</small> {contact.position || '-'}
                      </p>
                      <p className="card-text mb-1" style={{ color: "black" }}>
                        <small style={{ color: "green" }}>Email:</small> {contact.email}
                      </p>
                      <p className="card-text mb-0" style={{ color: "black" }}>
                        <small style={{ color: "green" }}>Téléphone:</small> {contact.phone || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">Aucun contact associé à ce client</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <button className="btn btn-secondary mb-3" onClick={() => setShowForm(false)}>
            ← Retour à la liste
          </button>
          <FormContact onSubmit={handleSubmit} onChange={handleContactChange} formData={contactForm} />
        </div>
      )}
    </div>
  )
}

// Composant Principal Clients
export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [archivedView, setArchivedView] = useState(false)
  const [activeModalId, setActiveModalId] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    webSite: "",
    address: "",
    secteur: "",
    country: "",
    city: "",
    landline: "",
  })

  const canModify = authService.canModifyClients()

  const fetchClients = useCallback(async () => {
    try {
      const response = await getClients(archivedView)
      setClients(Array.from(response.data))
    } catch (error) {
      console.error("Error fetching clients:", error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [archivedView])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canModify) {
      alert("Vous n'avez pas les permissions pour modifier les clients")
      return
    }

    try {
      if (formData.id) {
        await updateClient(formData.id, formData)
      } else {
        await createClient(formData)
      }
      fetchClients()
      toggleModal(null)
    } catch (error) {
      console.error("Error saving client:", error)
      alert(`Erreur: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleArchive = async () => {
    if (!canModify) {
      alert("Vous n'avez pas les permissions pour archiver les clients")
      return
    }

    if (!selectedClient?.idClient) return
    try {
      await archiveClient(selectedClient.idClient)
      fetchClients()
      toggleModal(null)
    } catch (error) {
      console.error("Error archiving client:", error)
      alert(`Erreur lors de l'archivage: ${error.response?.data?.message || error.message}`)
    }
  }

  const toggleModal = (modalId, client = null) => {
    setActiveModalId(modalId)
    setSelectedClient(client)
    if (client) {
      setFormData({
        id: client.idClient,
        name: client.name || "",
        webSite: client.webSite || "",
        address: client.address || "",
        secteur: client.secteur || "",
        country: client.country || "",
        city: client.city || "",
        landline: client.landline || "",
      })
    } else {
      setFormData({
        id: null,
        name: "",
        webSite: "",
        address: "",
        secteur: "",
        country: "",
        city: "",
        landline: "",
      })
    }
  }

  // Filtrer les clients selon le terme de recherche
  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.secteur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: "rgba(45, 79, 39, 0.77)" }} role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="text-muted mt-3">Chargement des clients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column p-3 align-items-center" style={{ backgroundColor: "white" }}>
      {/* Header - Couleurs originales conservées */}
      <div
        className="rounded-3 p-3 d-flex shadow-lg justify-content-between align-items-center"
        style={{
          background: "linear-gradient(to right,rgba(4, 4, 4, 0.77),rgba(4, 4, 4, 0.77), rgba(45, 79, 39, 0.77))",
          width: "95%",
          marginBottom: "-40px",
          zIndex: 1,
        }}
      >
        <div>
          <h4 style={{ color: "white", fontFamily: "corbel", marginBottom: "4px" }}>
            Gestion des Clients {!canModify && "(Lecture seule)"}
          </h4>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "14px" }}>
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
            {archivedView ? ' archivé' : ' actif'}{filteredClients.length > 1 ? 's' : ''}
          </p>
        </div>
        <div>
          {canModify && (
            <button className="btn btn-light me-2" onClick={() => toggleModal("addClient")}>
              + Client
            </button>
          )}
          <button className="btn btn-outline-dark" onClick={() => setArchivedView(!archivedView)}>
            {archivedView ? "Voir Actifs" : "Voir Archivés"}
          </button>
        </div>
      </div>

      {/* Container principal */}
      <div
        className="d-flex p-3 flex-column shadow-lg rounded-3 pt-5 w-100 border"
        style={{
          backgroundColor: "white",
          position: "relative",
          zIndex: 0,
        }}
      >
        {/* Barre de recherche */}
        <div className="row mb-4 pt-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                🔍
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Rechercher par nom, secteur, pays ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Clients Grid - Style professionnel avec cartes */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: "4rem", color: "rgba(45, 79, 39, 0.3)" }}>
              🏢
            </div>
            <h5 className="text-muted mb-3">
              {searchTerm ? "Aucun client trouvé" : "Aucun client disponible"}
            </h5>
            <p className="text-muted">
              {searchTerm
                ? "Essayez de modifier votre recherche"
                : archivedView
                  ? "Aucun client archivé pour le moment"
                  : "Commencez par ajouter votre premier client"
              }
            </p>
            {!searchTerm && !archivedView && canModify && (
              <button
                className="btn btn-success mt-3"
                onClick={() => toggleModal("addClient")}
              >
                + Ajouter le premier client
              </button>
            )}
          </div>
        ) : (
          <div className="row">
            {filteredClients.map((client) => (
              <div key={client.idClient} className="col-lg-6 col-xl-4 mb-4">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-header bg-white border-0 pb-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="card-title mb-1 fw-bold" style={{ color: "rgba(45, 79, 39, 0.9)" }}>
                          {client.name}
                        </h6>
                        <span className="badge bg-dark">{client.clientCode || "N/A"}</span>
                      </div>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-light"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          ⋮
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => toggleModal("details", client)}
                            >
                              👁️ Voir détails
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => toggleModal("contacts", client)}
                            >
                              👥 Contacts
                            </button>
                          </li>
                          {canModify && (
                            <>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => toggleModal("editClient", client)}
                                >
                                  ✏️ Modifier
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => toggleModal("archiveClient", client)}
                                >
                                  🗃️ {client.archived ? "Désarchiver" : "Archiver"}
                                </button>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body pt-2">
                    <div className="mb-3">
                      <div className="row g-2">
                        <div className="col-12">
                          <div className="d-flex align-items-center mb-2">
                            <span className="me-2">📍</span>
                            <small className="text-muted">
                              {client.city && client.country
                                ? `${client.city}, ${client.country}`
                                : client.city || client.country || "Non renseigné"
                              }
                            </small>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center mb-2">
                            <span className="me-2">🏭</span>
                            <small className="text-muted">{client.secteur || "Secteur non précisé"}</small>
                          </div>
                        </div>
                        {client.webSite && (
                          <div className="col-12">
                            <div className="d-flex align-items-center mb-2">
                              <span className="me-2">🌐</span>
                              <a
                                href={client.webSite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none small"
                              >
                                {client.webSite.length > 25
                                  ? `${client.webSite.substring(0, 25)}...`
                                  : client.webSite
                                }
                              </a>
                            </div>
                          </div>
                        )}
                        {client.landline && (
                          <div className="col-12">
                            <div className="d-flex align-items-center">
                              <span className="me-2">📞</span>
                              <small className="text-muted">{client.landline}</small>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-auto">
                      <button
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => toggleModal("contacts", client)}
                      >
                        👥 Contacts
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => toggleModal("details", client)}
                      >
                        👁️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeModalId === "addClient" && canModify && (
        <Modal title="Nouveau Client" color="#008080" onClose={() => toggleModal(null)}>
          <FormClient formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} />
        </Modal>
      )}

      {activeModalId === "editClient" && (
        <Modal title="Modifier Client" color="green" onClose={() => toggleModal(null)}>
          <FormClient
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            editMode={true}
            readOnly={!canModify}
          />
        </Modal>
      )}

      {activeModalId === "archiveClient" && canModify && (
        <Modal title="Confirmation" color="red" onClose={() => toggleModal(null)}>
          <div className="text-center">
            <div className="mb-3" style={{ fontSize: "3rem", color: "orange" }}>
              ⚠️
            </div>
            <h5>Confirmation requise</h5>
            <p>Voulez-vous vraiment {selectedClient?.archived ? "désarchiver" : "archiver"} ce client ?</p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-danger" onClick={handleArchive}>
                Oui, {selectedClient?.archived ? "Désarchiver" : "Archiver"}
              </button>
              <button className="btn btn-secondary" onClick={() => toggleModal(null)}>
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeModalId === "details" && (
        <Modal title="Détails du Client" color="#C9A13C" onClose={() => toggleModal(null)}>
          <div className="p-3">
            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Code client:</strong>
                <br />
                <span className="badge bg-dark mt-1">{selectedClient?.clientCode || "-"}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Nom:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.name}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Pays:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.country || "-"}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Ville:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.city || "-"}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Adresse:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.address || "-"}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Site Web:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.webSite || "-"}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Téléphone fixe:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.landline || "-"}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Secteur:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.secteur || "-"}</span>
              </div>
            </div>

            <div className="mb-4 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="mb-3">
                <strong className="text-primary">Statut:</strong>
                <br />
                <span className="mt-1 d-block">{selectedClient?.archived ? "Archivé" : "Actif"}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeModalId === "contacts" && (
        <Modal title="Contacts Associés" color="#7B68EE" onClose={() => toggleModal(null)}>
          <ClientContacts clientId={selectedClient?.idClient} />
        </Modal>
      )}

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(45, 79, 39, 0.15) !important;
        }
      `}</style>
    </div>
  )
}