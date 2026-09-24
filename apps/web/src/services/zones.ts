import api from "./api"

export async function fetchZones() {
  const response = await api.get("/zones")
  return response.data
} 