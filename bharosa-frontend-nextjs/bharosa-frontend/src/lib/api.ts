import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import type { Property } from "./types";
import { getMock, listMock, similarMock } from "./mock";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const USE_MOCK = String(process.env.NEXT_PUBLIC_USE_MOCK ?? "true").toLowerCase() === "true";





export const api = axios.create({ baseURL: BASE });

// attach token safely
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (t) {
    if (!config.headers) config.headers = new AxiosHeaders();
    const h = config.headers as any;
    if (typeof h.set === "function") h.set("Authorization", `Bearer ${t}`);
    else h["Authorization"] = `Bearer ${t}`;
  }
  return config;
});


function qs(params: Record<string, any>) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") s.append(k, String(v));
  });
  return s.toString();
}

/* Properties */
export async function listProperties(q?: string, filters: Record<string, any> = {}): Promise<Property[]> {
  if (USE_MOCK || !BASE) return listMock();
  const query = qs({ q, ...filters });
  const { data } = await api.get<Property[]>(`/api/properties?${query}`);
  return data;
}
export async function getProperty(id: string): Promise<Property | undefined> {
  if (USE_MOCK || !BASE) return getMock(id);
  const { data } = await api.get<Property>(`/api/properties/${id}`);
  return data;
}
export async function getSimilar(propertyId: string): Promise<Property[]> {
  if (USE_MOCK || !BASE) return similarMock(propertyId);
  const { data } = await api.get<Property[]>(`/api/recs/similar/${propertyId}`);
  return data;
}

/* Leads + Visits (already added earlier) */
export async function createLead(payload: { name?: string; email: string; phone?: string; propertyId: string; notes?: string; }) {
  const { data } = await api.post(`/api/leads`, payload);
  return data;
}
export async function createVisit(payload: { leadId: string; propertyId: string; dateTimeISO: string; meetingLocation?: string; internalNotes?: string; }) {
  const { data } = await api.post(`/api/visits`, {
    lead: { id: payload.leadId },
    property: { id: payload.propertyId },
    dateTime: payload.dateTimeISO,
    meetingLocation: payload.meetingLocation,
    internalNotes: payload.internalNotes,
  });
  return data as { id: string };
}
export function visitIcsUrl(visitId: string) { return `${BASE}/api/visits/${visitId}/ics`; }
export async function scheduleVisit(args: { propertyId: string; name?: string; email: string; phone?: string; notes?: string; dateISO: string; timeHHmm: string; meetingLocation?: string; }) {
  const leadRes = await api.post(`/api/leads`, { name: args.name, email: args.email, phone: args.phone, propertyId: args.propertyId, notes: args.notes });
  const leadId = leadRes.data.id;
  const [h, m] = args.timeHHmm.split(":").map(Number);
  const [Y, M, D] = args.dateISO.split("-").map(Number);
  const dt = new Date(Y, (M - 1), D, h, m, 0);
  const visit = await createVisit({ leadId, propertyId: args.propertyId, dateTimeISO: dt.toISOString(), meetingLocation: args.meetingLocation });
  return { visitId: visit.id, icsUrl: visitIcsUrl(visit.id) };
}

/* Saved Properties */
export interface SavedItem { id: string; property: Property; savedAt: string; }
export async function fetchSaved(): Promise<SavedItem[]> {
  const { data } = await api.get<SavedItem[]>(`/api/saved`);
  return data;
}
export async function saveProperty(propertyId: string) {
  const { data } = await api.post(`/api/saved/${propertyId}`);
  return data;
}
export async function unsaveProperty(propertyId: string) {
  const { data } = await api.delete(`/api/saved/${propertyId}`);
  return data;
}

/* Auth + Agents + Workspace */
export interface User { id: string; email: string; name: string; role: "super_admin"|"agency_admin"|"agent"|"customer"; }
export async function register(payload:{email:string; password:string; name:string; role?: User["role"]}) {
  const { data } = await api.post(`/api/auth/register`, payload); return data;
}
export async function login(payload:{email:string; password:string}) {
  const { data } = await api.post(`/api/auth/login`, payload);
  return data as { token: string; user: User };
}

export async function logContact(propertyId: string, channel: 'whatsapp'|'call'|'email') {
  await api.post(`/api/interactions/contact`, { propertyId, channel });
}


/* Agents (from earlier step) */
export interface AgentProfile {
  id: string; bio?: string; avatarUrl?: string; totalSales: number; totalRent: number; avgResponseMins: number;
  languages?: string[]; specializations?: string[]; user?: { id: string; name: string; email: string }; agency?: { id: string; name: string };
}
export interface AgentWithListings { agent: AgentProfile; listings: Property[]; }
export async function listAgents(filters: any = {}): Promise<AgentProfile[]> {
  const query = qs(filters); const { data } = await api.get<AgentProfile[]>(`/api/agents?${query}`); return data;
}
export async function getAgent(id: string): Promise<AgentWithListings> {
  const { data } = await api.get<AgentWithListings>(`/api/agents/${id}`); return data;
}

/* Agent workspace */
export type LeadStage = 'new'|'contacted'|'qualified'|'visit_scheduled'|'revisit'|'negotiation'|'won'|'lost';
export interface Lead { id: string; stage: LeadStage; notes?: string; createdAt: string; customer: { id:string; name:string; email:string }; property?: Property; }
export async function myLeads(stage?: LeadStage): Promise<Lead[]> {
  const { data } = await api.get<Lead[]>(`/api/leads/my${stage ? `?stage=${stage}` : ""}`); return data;
}
export async function updateLeadStage(id: string, stage: LeadStage, notes?: string) {
  const { data } = await api.patch(`/api/leads/${id}/stage`, { stage, notes }); return data;
}

// Agent: my listings
export async function myListings(): Promise<Property[]> {
  const { data } = await api.get<Property[]>(`/api/properties/mine`);
  return data;
}

// Admin: moderation
export async function pendingListings(): Promise<Property[]> {
  const { data } = await api.get<Property[]>(`/api/admin/listings/pending`);
  return data;
}
export async function approveListing(id: string) {
  const { data } = await api.patch(`/api/admin/listings/${id}/approve`, {});
  return data;
}


export async function createProperty(payload: Partial<Property> & {
  status: "sale"|"rent";
}) {
  const { data } = await api.post<Property>("/api/properties", payload);
  return data;
}

export async function updateProperty(id: string, payload: Partial<Property>) {
  const { data } = await api.patch<Property>(`/api/properties/${id}`, payload);
  return data;
}

export async function uploadPropertyImages(id: string, files: File[]) {
  const fd = new FormData();
  files.forEach(f => fd.append("images", f));
  const { data } = await api.post<{ imageUrls: string[] }>(`/api/properties/${id}/images`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.imageUrls;
}


export async function recsHome(filters: Record<string,any> = {}) {
  const query = new URLSearchParams(Object.entries(filters).filter(([_,v])=>v!=null && v!==""));
  const { data } = await api.get<Property[]>(`/api/recs/home?${query.toString()}`);
  return data;
}
export async function recsPopular() {
  const { data } = await api.get<Property[]>(`/api/recs/popular`);
  return data;
}

