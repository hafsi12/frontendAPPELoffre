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
            <ul className="list-group">
              {contacts.map((contact) => (
                <li key={contact.id} className="list-group-item">
                  <div>
                    <strong style={{ color: "green" }}>{contact.name}</strong>
                  </div>
                  <div>{contact.position}</div>
                  <div>{contact.email}</div>
                  <div>{contact.phone}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun contact associé à ce client</p>
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

  if (loading) return <div className="text-center my-5">Chargement en cours...</div>

  return (
    <div className="d-flex flex-column p-3 align-items-center" style={{ backgroundColor: "white" }}>
      {/* Header */}
      <div
        className="rounded-3 p-3 d-flex shadow-lg justify-content-between"
        style={{
          background: "linear-gradient(to right,rgba(4, 4, 4, 0.77),rgba(4, 4, 4, 0.77), rgba(45, 79, 39, 0.77))",
          width: "95%",
          marginBottom: "-40px",
          zIndex: 1,
        }}
      >
        <h4 style={{ color: "white", fontFamily: "corbel" }}>Gestion des Clients {!canModify && "(Lecture seule)"}</h4>
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

      {/* Table */}
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
                <th>Code</th>
                <th>Client</th>
                <th>Ville / Pays</th>
                <th>Adresse</th>
                <th>Site Web</th>
                <th>Téléphone fixe</th>
                <th>Secteur</th>
                <th>Contacts</th>
                <th>Détails</th>
                {canModify && <th>Modifier</th>}
                {canModify && <th>Archiver</th>}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.idClient}>
                  <td><span className="badge bg-dark">{client.clientCode || "-"}</span></td>
                  <td>{client.name}</td>
                  <td>
                    {client.city ? client.city : "-"}
                    {client.city && client.country ? " / " : ""}
                    {client.country ? client.country : ""}
                  </td>
                  <td>{client.address || "-"}</td>
                  <td>
                    {client.webSite ? (
                      <a href={client.webSite} target="_blank" rel="noopener noreferrer">
                        {client.webSite}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{client.landline || "-"}</td>
                  <td>{client.secteur || "-"}</td>
                  <td className="text-center">
                    <button className="btn btn-sm" onClick={() => toggleModal("contacts", client)}>
                      Voir
                    </button>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm" onClick={() => toggleModal("details", client)}>
                      🔍
                    </button>
                  </td>
                  {canModify && (
                    <td className="text-center">
                      <button className="btn btn-sm" onClick={() => toggleModal("editClient", client)}>
                        ✏️
                      </button>
                    </td>
                  )}
                  {canModify && (
                    <td className="text-center">
                      <button className="btn btn-sm text-danger" onClick={() => toggleModal("archiveClient", client)}>
                        {client.archived ? "🗄️" : "🗃️"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <Modal title="Archivage" color="red" onClose={() => toggleModal(null)}>
          <p>Voulez-vous vraiment {selectedClient?.archived ? "désarchiver" : "archiver"} ce client ?</p>
          <button className="btn btn-danger me-2" onClick={handleArchive}>
            Oui, {selectedClient?.archived ? "Désarchiver" : "Archiver"}
          </button>
          <button className="btn btn-secondary" onClick={() => toggleModal(null)}>
            Annuler
          </button>
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
    </div>
  )
}
