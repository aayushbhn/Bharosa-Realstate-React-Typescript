import { Property } from "./types";

export const MOCK_PROPS: Property[] = [
  {
    id: "p1",
    title: "Sunny Apartment in Lazimpat",
    description: "2BHK, near schools and cafes",
    status: "rent",
    type: "apartment",
    beds: 2,
    baths: 2,
    areaSqft: 900,
    price: 35000,
    city: "Kathmandu",
    area: "Lazimpat",
    imageUrls: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80&auto=format&fit=crop"],
  },
  {
    id: "p2",
    title: "Family Home in Jawalakhel",
    description: "4 bed independent house with parking",
    status: "sale",
    type: "house",
    beds: 4,
    baths: 3,
    areaSqft: 2400,
    price: 32000000,
    city: "Lalitpur",
    area: "Jawalakhel",
    imageUrls: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80&auto=format&fit=crop"],
  }
];

export async function listMock(): Promise<Property[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_PROPS;
}

export async function getMock(id: string): Promise<Property | undefined> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_PROPS.find((p) => p.id === id);
}

export async function similarMock(id: string): Promise<Property[]> {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_PROPS.filter((p) => p.id !== id);
}