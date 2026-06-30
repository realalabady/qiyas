/**
 * Admin authentication context and hooks.
 */

import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/services";
import { isAdminUid } from "@/lib/firebase/admins";
import { useQuizzesAdmin } from "@/stores/quizzes-admin-store";
import { useArticles } from "@/stores/articles-store";
import { useCategories } from "@/stores/categories-store";

/**
 * Once an admin is confirmed, pull all content (including drafts) from
 * Firestore — and on the very first run, migrate existing local content up.
 */
const syncContentForAdmin = () => {
  void useQuizzesAdmin.getState().syncOnAdmin();
  void useArticles.getState().syncOnAdmin();
  void useCategories.getState().syncOnAdmin();
};

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getFirebaseAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminStatus = await isAdminUid(firebaseUser.uid);
        setUser(firebaseUser);
        setIsAdmin(adminStatus);
        if (adminStatus) syncContentForAdmin();
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const adminStatus = await isAdminUid(result.user.uid);
    if (!adminStatus) {
      await signOut(auth);
      throw new Error("Not an admin user");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
