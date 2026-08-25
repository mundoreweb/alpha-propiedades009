import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: number;
  whatsapp_number: string;
  whatsapp_message: string;
  contact_email: string;
  office_address: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  whatsapp_number: "50661085991",
  whatsapp_message: "Hola, deseo consultar sobre una propiedad.",
  contact_email: "alphapropiedades009@gmail.com",
  office_address: "San José, Costa Rica",
};

const TABLE = "site_settings" as never;

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return { ...DEFAULT_SETTINGS, ...((data ?? {}) as unknown as Partial<SiteSettings>) };
}

export async function updateSiteSettings(
  input: Partial<Omit<SiteSettings, "id">>,
): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(input as never)
    .eq("id", 1)
    .select("*")
    .single();
  if (error) throw error;
  return data as unknown as SiteSettings;
}

export function buildWhatsAppUrl(settings: SiteSettings, message?: string): string {
  const number = (settings.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number).replace(/\D/g, "");
  const text = message?.trim() ? message : settings.whatsapp_message;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

const BUCKET = "property-images";
// 10 years — the bucket is private, so we persist long-lived signed URLs.
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadPropertyImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signErr || !data?.signedUrl) throw signErr ?? new Error("No se pudo generar la URL");
  return data.signedUrl;
}
