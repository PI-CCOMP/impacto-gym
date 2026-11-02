import { Navigate, Outlet } from "react-router-dom";
import { getPerfil, rotaPorPerfil } from "../services/api";

type RequireRoleProps = {
  roles: string[];
};

export function RequireRole({ roles }: RequireRoleProps) {
  const perfil = getPerfil();
  const accessToken = sessionStorage.getItem("access_token");

  if (!accessToken || !perfil) {
    return <Navigate to={roles.includes("aluno") ? "/login" : "/dashboard"} replace />;
  }
  if (!roles.includes(perfil)) {
    return <Navigate to={rotaPorPerfil(perfil)} replace />;
  }
  return <Outlet />;
}
