/**
 * Protected admin route wrapper.
 * Redirects unauthorized users to login.
 */

import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/admin-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
