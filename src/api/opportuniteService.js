import axios from "axios"

const API_URL = "http://localhost:8080/api/opportunites"

export const getOpportunites = () => {
  return axios.get(API_URL)
}

export const getOpportuniteById = (id) => {
  return axios.get(`${API_URL}/${id}`)
}

export const createOpportunite = (opportuniteData) => {
  return axios.post(API_URL, opportuniteData)
}

export const updateOpportunite = (id, opportuniteData) => {
  return axios.put(`${API_URL}/${id}`, opportuniteData)
}

export const updateOpportuniteStatus = (id, statusId, decisionExplanation) => {
  return axios.patch(`${API_URL}/${id}/status`, { statusId, decisionExplanation })
}

export const deleteOpportunite = (id) => {
  return axios.delete(`${API_URL}/${id}`)
}
