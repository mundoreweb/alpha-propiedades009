// Real admin authentication backed by Lovable Cloud auth.
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAIL = "alphapropiedades009@gmail.com";
export const ADMIN_PASSWORD = "8*%A$UCF2vyeDws";

export async function isAdminAuthed(): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
}

export async function loginAdmin(email: string, password: string): Promise<boolean> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  return !error;
}

export async function logoutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}
