// Mock client-side admin auth. Demo credentials only — not for production.
const KEY = "alpha_admin_auth";
export const ADMIN_EMAIL = "admin@alphapropiedades.cr";
export const ADMIN_PASSWORD = "admin123";

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function loginAdmin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    window.localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function logoutAdmin() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}
