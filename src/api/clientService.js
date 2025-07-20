import axios from "axios"

const API_URL = "http://localhost:8080/api/clients"

export const getClients = (archived = false) => {
  return axios.get(`${API_URL}?archived=${archived}`)
}

export const getClientById = (id) => {
  return axios.get(`${API_URL}/${id}`)
}

export const createClient = (clientData) => {
  return axios.post(API_URL, clientData)
}

export const updateClient = (id, clientData) => {
  console.log("Sending PUT request to update client", id)
  return axios.put(`${API_URL}/${id}`, clientData)
}

export const archiveClient = (id) => {
  // This function now calls the backend endpoint that toggles the archive status
  return axios.patch(`${API_URL}/${id}/archive`)
}

export const deleteClient = (id) => {
  return axios.delete(`${API_URL}/${id}`)
}

export const createContact = (clientId, contactData) => {
  return axios.post(`${API_URL}/${clientId}/contacts`, contactData)
}
