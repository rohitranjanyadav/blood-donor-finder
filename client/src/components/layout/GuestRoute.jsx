import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";
import { roleRedirect } from "../auth/authConfig";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (user)
    return <Navigate to={roleRedirect[user.role] || "/login"} replace />;

  return children;
}
