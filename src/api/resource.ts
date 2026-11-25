import { api } from "./client";
import type { Page } from "../types";

export type Item = {
  id: number;
  name: string;
  specialty: string;
  modality: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  availableSlots: number;
  description: string;
};

// Detalle de una mentoría
export type Detail = Item & {
  slots: { id: number; name: string; specialty: string; modality: string; availableSlots: number; description: string }[];
};

// Operación principal
export type ActionBody = {
  slotId: number;
  text: string;
};

export async function list(page: number, size = 5) {
  const { data } = await api.get<Page<Item>>(`/api/mentors`, { params: { page, size } });
  return data;
}

export async function getById(id: string | number) {
  const { data } = await api.get<Detail>(`/api/mentors/${id}`);
  return data;
}

export async function sendAction(id: string | number, body: ActionBody) {
  const { data } = await api.post(`/api/mentors/${id}/requests`, body);
  return data;
}

//

export type Booking = {
  id: number;
  resourceId: number;
  resourceName: string;
  topic: string;
  status: "ACTIVE" | "CANCELLED" | "COMPLETED";
}

export type Operations<Booking> = Booking[];

export async function myOperations() {
    const { data } = await api.get<Operations<Booking>>(`/api/me/requests`);
    return data;
}

export async function cancelBooking(id: number) {
    await api.patch(`/api/requests/${id}/cancel`);
}
