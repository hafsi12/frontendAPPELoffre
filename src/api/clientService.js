import api from "../services/api"

// Service pour la gestion des clients utilisant le service API centralisé
export const getClients = (archived = false) => {
  return api.get(`/clients?archived=${archived}`)
}

export const getClientById = (id) => {
  return api.get(`/clients/${id}`)
}

export const createClient = (clientData) => {
  return api.post("/clients", clientData)
}

export const updateClient = (id, clientData) => {
  return api.put(`/clients/${id}`, clientData)
}

// CORRECTION: Utiliser PATCH au lieu de DELETE pour l'archivage
export const archiveClient = (id) => {
  return api.patch(`/clients/${id}/archive`)
}

export const createContact = (clientId, contactData) => {
  return api.post(`/clients/${clientId}/contacts`, contactData)
}

export const getClientContacts = (clientId) => {
  return api.get(`/clients/${clientId}/contacts`)
}

export const updateContact = (clientId, contactId, contactData) => {
  return api.put(`/clients/${clientId}/contacts/${contactId}`, contactData)
}

export const deleteContact = (clientId, contactId) => {
  return api.delete(`/clients/${clientId}/contacts/${contactId}`)
}

// Fonction séparée pour la suppression définitive si nécessaire
export const deleteClient = (id) => {
  return api.delete(`/clients/${id}`)
}
