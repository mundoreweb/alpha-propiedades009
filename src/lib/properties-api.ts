import { supabase } from "@/integrations/supabase/client";
import type { CatalogProperty } from "@/data/properties";
import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";
import p6 from "@/assets/property-6.jpg";

const ASSET_MAP: Record<string, string> = {
  "property-1.jpg": p1,
  "property-2.jpg": p2,
  "property-3.jpg": p3,
  "property-4.jpg": p4,
  "property-5.jpg": p5,
  "property-6.jpg": p6,
};

export function resolveImage(url: string): string {
  if (!url) return p1;
  const m = url.match(/property-\d+\.jpg$/);
  if (m && ASSET_MAP[m[0]]) return ASSET_MAP[m[0]];
  return url;
}

export type PropertyRow = {
  id: string;
  title: string;
  description: string | null;
  property_code: string | null;
  price: number;
  operation: "Venta" | "Alquiler";
  rental_status: "Disponible" | "Alquilada";
  province: string;
  city: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  sqm: number;
  images: string[];
  video_url: string | null;
  is_featured: boolean;
  created_at: string;
};

export type PropertyWithDetail = CatalogProperty & {
  description?: string;
  propertyCode?: string;
  images: string[];
  videoUrl?: string | null;
};

export function rowToProperty(row: PropertyRow): PropertyWithDetail {
  const imgs = (Array.isArray(row.images) ? row.images : []).map(resolveImage);
  const primary = imgs[0] ?? p1;
  const isRental = row.operation === "Alquiler";
  const priceStr = isRental
    ? `$${Number(row.price).toLocaleString("en-US")}`
    : `$${Number(row.price).toLocaleString("en-US")}`;
  return {
    id: row.id,
    title: row.title,
    location: `${row.city ?? row.province}, ${row.province}`,
    price: priceStr,
    priceUSD: Number(row.price),
    period: isRental ? "mes" : undefined,
    type: row.operation,
    beds: row.bedrooms,
    baths: row.bathrooms,
    parking: row.parking,
    area: `${row.sqm} m²`,
    areaNum: Number(row.sqm),
    image: primary,
    images: imgs.length > 0 ? imgs : [primary],
    featured: row.is_featured,
    provincia: row.province,
    canton: row.city ?? row.province,
    rentalStatus: isRental ? (row.rental_status ?? "Disponible") : "Disponible",
    description: row.description ?? undefined,
    propertyCode: row.property_code ?? undefined,
    videoUrl: row.video_url ?? null,
  };
}

const TABLE = "properties" as never;

export async function fetchProperties(): Promise<PropertyWithDetail[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as PropertyRow[]).map(rowToProperty);
}

export async function fetchPropertyById(id: string): Promise<PropertyWithDetail | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToProperty(data as unknown as PropertyRow);
}

export type PropertyInput = {
  title: string;
  description?: string | null;
  property_code?: string | null;
  price: number;
  operation: "Venta" | "Alquiler";
  rental_status: "Disponible" | "Alquilada";
  province: string;
  city?: string | null;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  sqm: number;
  images: string[];
  video_url?: string | null;
  is_featured?: boolean;
};

export async function createProperty(input: PropertyInput): Promise<PropertyWithDetail> {
  const { data, error } = await supabase.from(TABLE).insert(input as never).select("*").single();
  if (error) throw error;
  return rowToProperty(data as unknown as PropertyRow);
}

export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>,
): Promise<PropertyWithDetail> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input as never)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToProperty(data as unknown as PropertyRow);
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

export async function toggleRentalStatus(
  id: string,
  current: "Disponible" | "Alquilada",
): Promise<PropertyWithDetail> {
  const next = current === "Alquilada" ? "Disponible" : "Alquilada";
  return updateProperty(id, { rental_status: next });
}
