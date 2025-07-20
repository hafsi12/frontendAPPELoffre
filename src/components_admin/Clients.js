"use client" // [^1]
import { useState, useEffect, useCallback } from "react"
import { getClients, createClient, updateClient, archiveClient, createContact } from "../api/clientService"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/dashboard.css"
import Modal from "./modal" // Corrected import path for Modal

// Composant Formulaire Client
const FormClient = ({ formData, onChange, onSubmit, editMode = false }) => {
  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <input
        className="form-control"
        name="name"
        placeholder="Nom du client"
        value={formData.name}
        onChange={onChange}
        required
      />
      <input
        className="form-control"
        name="webSite"
        placeholder="Site Web"
        value={formData.webSite}
        onChange={onChange}
      />
      <input
        className="form-control"
        name="address"
        placeholder="Adresse"
        value={formData.address}
        onChange={onChange}
      />
      <input
        className="form-control"
        name="secteur"
        placeholder="Secteur"
        value={formData.secteur}
        onChange={onChange}
      />
      <button type="submit" className="btn btn-success">
        {editMode ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  )
}

// Composant Formulaire Contact
const FormContact = ({ onSubmit, onChange, formData }) => {
  return (
    <form className="d-flex flex-column gap-3" onSubmit={onSubmit}>
      <input
        className="form-control"
        name="name"
        placeholder="Nom complet"
        value={formData.name}
        onChange={onChange}
        required
      />
      <input
        className="form-control"
        name="email"
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={onChange}
        required
      />
      <input className="form-control" name="phone" placeholder="Téléphone" value={formData.phone} onChange={onChange} />
      <input
        className="form-control"
        name="position"
        placeholder="Poste"
        value={formData.position}
        onChange={onChange}
      />
      <button type="submit" className="btn btn-primary">
        Enregistrer
      </button>
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
  const fetchContacts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/clients/${clientId}/contacts`)
      setContacts(Array.from(response.data)) // Ensure it's an array
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setContacts([]) // Ensure contacts is an empty array on error
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
          <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
            + Ajouter Contact
          </button>
          {contacts.length > 0 ? (
            <ul className="list-group">
              {contacts.map((contact) => (
                <li key={contact.id} className="list-group-item">
                  {" "}
                  {/* Added key prop */}
                  <div>
                    <strong>{contact.name}</strong>
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
        <FormContact onSubmit={handleSubmit} onChange={handleContactChange} formData={contactForm} />
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
  })
  const fetchClients = useCallback(async () => {
    try {
      const response = await getClients(archivedView)
      setClients(Array.from(response.data)) // Explicitly convert to array
    } catch (error) {
      console.error("Error fetching clients:", error)
      setClients([]) // Ensure clients is an empty array on error
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
    console.log("Submitting form with formData:", formData)
    try {
      if (formData.id) {
        console.log("Attempting to update client with ID:", formData.id)
        await updateClient(formData.id, formData)
      } else {
        console.log("Attempting to create new client.")
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
    if (!selectedClient?.idClient) return
    try {
      // The backend now toggles the status, so we just call the archiveClient function
      await archiveClient(selectedClient.idClient)
      fetchClients() // Re-fetch clients to update the UI with the new status
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
        id: client.idClient, // Use idClient from backend response
        name: client.name || "",
        webSite: client.webSite || "",
        address: client.address || "",
        secteur: client.secteur || "",
      })
    } else {
      setFormData({
        id: null,
        name: "",
        webSite: "",
        address: "",
        secteur: "",
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
        <h4 style={{ color: "white", fontFamily: "corbel" }}>Gestion des Clients</h4>
        <div>
          <button className="btn btn-light me-2" onClick={() => toggleModal("addClient")}>
            + Client
          </button>
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
                <th>Client</th>
                <th>Adresse</th>
                <th>Site Web</th>
                <th>Secteur</th>
                <th>Contacts</th>
                <th>Détails</th>
                <th>Modifier</th>
                <th>Archiver</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.idClient}>
                  {" "}
                  {/* Added key prop */}
                  <td>{client.name}</td>
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
                  <td className="text-center">
                    <button className="btn btn-sm" onClick={() => toggleModal("editClient", client)}>
                      ✏️
                    </button>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm text-danger" onClick={() => toggleModal("archiveClient", client)}>
                      {client.archived ? "🗄️" : "🗃️"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modals */}
      {activeModalId === "addClient" && (
        <Modal title="Nouveau Client" color="#008080" onClose={() => toggleModal(null)}>
          <FormClient formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} />
        </Modal>
      )}
      {activeModalId === "editClient" && (
        <Modal title="Modifier Client" color="green" onClose={() => toggleModal(null)}>
          <FormClient formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} editMode={true} />
        </Modal>
      )}
      {activeModalId === "archiveClient" && (
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
          <ul className="list-unstyled">
            <li>
              <strong>Nom:</strong> {selectedClient?.name}
            </li>
            <li>
              <strong>Site Web:</strong> {selectedClient?.webSite || "-"}
            </li>
            <li>
              <strong>Adresse:</strong> {selectedClient?.address || "-"}
            </li>
            <li>
              <strong>Secteur:</strong> {selectedClient?.secteur || "-"}
            </li>
            <li>
              <strong>Statut:</strong> {selectedClient?.archived ? "Archivé" : "Actif"}
            </li>
          </ul>
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
