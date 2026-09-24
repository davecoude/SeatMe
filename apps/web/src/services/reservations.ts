import api from "./api"

export async function createReservation(data: { deskId: string, date: string, startTime: string, endTime: string }) {
  const response = await api.post("/reservations", data)
  return response.data
}

export async function fetchMyReservations() {
  const response =  await api.get("/reservations/my")
  return response.data
}

export async function fetchDeskReservations(deskId: string, date: string) {
  const response = await api.get(`/reservations/desk/${deskId}?date=${date}`)
  return response.data
}

export async function checkInReservation(id: string) {
  const response = await api.patch(`/reservations/${id}/check-in`)
  return response.data
}

export async function cancelReservation(id: string) {
  const response = await api.patch(`/reservations/${id}/cancel`)
  return response.data
}