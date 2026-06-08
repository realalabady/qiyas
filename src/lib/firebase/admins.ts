import { doc, getDoc } from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/services";

export type AdminRole = "admin" | "super_admin";

export interface AdminProfile {
  role: AdminRole;
  email: string;
  isActive: boolean;
}

const isAdminRole = (value: unknown): value is AdminRole =>
  value === "admin" || value === "super_admin";

export const getAdminProfileByUid = async (
  uid: string,
): Promise<AdminProfile | null> => {
  if (!uid.trim()) {
    throw new Error("Admin UID is required.");
  }

  const adminRef = doc(getFirestoreDb(), "admins", uid);
  const snapshot = await getDoc(adminRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  if (!isAdminRole(data.role)) {
    throw new Error(`Invalid admin role for uid "${uid}".`);
  }

  return {
    role: data.role,
    email: typeof data.email === "string" ? data.email : "",
    isActive: data.isActive !== false,
  };
};

export const isAdminUid = async (uid: string) => {
  const profile = await getAdminProfileByUid(uid);
  return Boolean(profile?.isActive);
};
