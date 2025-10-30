import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { ROUTES } from "../constants/routes";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
}
