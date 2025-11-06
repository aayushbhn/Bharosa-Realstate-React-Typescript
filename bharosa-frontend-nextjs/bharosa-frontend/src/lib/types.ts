export type PropertyStatus = "sale" | "rent";
export type PropertyType = "apartment" | "house" | "land" | "office" | "villa";

export interface Property {
  id: string;
  title: string;
  description: string;
  status: PropertyStatus;
  type: PropertyType;
  beds: number;
  baths: number;
  areaSqft: number;
  price: number;
  city?: string;
  area?: string;
  imageUrls?: string[];
  createdAt?: string;
  isApproved?: boolean; 
}

export interface AgentProfile {
  id: string;
  bio?: string;
  avatarUrl?: string;
  totalSales: number;
  totalRent: number;
  avgResponseMins: number;
  languages?: string[];
  specializations?: string[];
  user?: { id: string; name: string; email: string };
  agency?: { id: string; name: string };
}

export interface AgentWithListings {
  agent: AgentProfile;
  listings: Property[];
}