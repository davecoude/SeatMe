import api from "./api"

export async function fetchDesks() {
  const response = await api.get("/desks")
  return response.data
}

export async function fetchDeskAmenities(deskId: string) {
  const response = await api.get(`/desks/${deskId}/amenities`)
  return response.data
}