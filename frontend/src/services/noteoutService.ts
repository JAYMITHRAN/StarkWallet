import { apiRequest } from "./apiClient";
import type { CreateNoteoutRequest, Noteout, UpdateNoteoutRequest, NoteoutListQuery } from "@stark/shared/types/index";

function buildQueryString(query: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export const noteoutService = {
  list: (query: NoteoutListQuery = {}) =>
    apiRequest<Noteout[]>(`/noteouts${buildQueryString(query as Record<string, string | number | boolean | undefined>)}`, { auth: true }),
  create: (payload: CreateNoteoutRequest) =>
    apiRequest<Noteout>("/noteouts", { method: "POST", body: payload }),
  update: (id: string, payload: UpdateNoteoutRequest) =>
    apiRequest<Noteout>(`/noteouts/${id}`, { method: "PUT", body: payload }),
  destroy: (id: string) =>
    apiRequest<Noteout>(`/noteouts/${id}`, { method: "DELETE" }),
  restore: (id: string) =>
    apiRequest<Noteout>(`/noteouts/${id}/restore`, { method: "POST" }),
  summary: () =>
    apiRequest<{
      totalNotedIn: number;
      totalNotedOut: number;
      count: number;
    }>("/noteouts/summary"),
};
