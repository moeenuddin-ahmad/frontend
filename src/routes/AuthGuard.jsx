import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetMeQuery } from "../redux/features/auth/authApi";

export default function AuthGuard() {
  const { isError } = useGetMeQuery();
  const location = useLocation();

  if (isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
