import { Routes, Route, useLocation } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { Componentes } from "../Componentes";

import { Index } from "../pages/Member/Index";
import { Login } from "../pages/Member/Login";
import { Register } from "../pages/Member/Register";
import { MFAVerification } from "../pages/Member/MFAVerification";
import { ForgotPassword } from "../pages/Member/ForgotPassword";
import { Home } from "../pages/Member/Home";
import { Training } from "../pages/Member/Training";
import { Exercise } from "../pages/Member/Exercise";
import { Help } from "../pages/Member/Help";
import { HelpRequest } from "../pages/Member/HelpRequest";
import { Alert } from "../pages/Member/Alert";
import { History } from "../pages/Member/History";
import { HistoryDetail } from "../pages/Member/HistoryDetail";
import { Settings } from "../pages/Member/Settings";
import { Profile } from "../pages/Member/Profile";
import { Faq } from "../pages/Member/Faq";
import { ChangeEmail } from "../pages/Member/ChangeEmail";
import { Page404 } from "../pages/Member/Page404";

import { DashboardLogin } from "../pages/Dashboard/DashboardLogin";
import { DashboardForgotPassword } from "../pages/Dashboard/DashboardForgotPassword";
import { DashboardMFAVerification } from "../pages/Dashboard/DashboardMFAVerifiacation";
import { DashboardUsers } from "../pages/Dashboard/DashboardUsers";
import { DashboardUser } from "../pages/Dashboard/DashboardUser";
import { DashboardEditUser } from "../pages/Dashboard/DashboardEditUser";
import { DashboardTraining } from "../pages/Dashboard/DashboardTraining";
import { DashboardTrainingDetail } from "../pages/Dashboard/DashboardTrainingDetail";

export function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/componentes" element={<Componentes />} />
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/verificar-email" element={<MFAVerification />} />
        <Route path="/alterar-senha" element={<ForgotPassword />} />
        <Route path="/inicio" element={<Home />} />
        <Route
          path="/treino/:idTreino"
          element={<Training key={location.pathname} />}
        />
        <Route path="/exercicio/:idExercicio" element={<Exercise />} />
        <Route path="/ajuda" element={<Help />} />
        <Route path="/solicitacao-auxilio" element={<HelpRequest />} />
        <Route path="/avisos" element={<Alert />} />
        <Route path="/historico" element={<History />} />
        <Route path="/historico/:id" element={<HistoryDetail />} />
        <Route path="/configuracao" element={<Settings />} />
        <Route path="/configuracao/perfil" element={<Profile />} />
        <Route path="/configuracao/faq" element={<Faq />} />
        <Route
          path="/configuracao/alterar-senha"
          element={<ForgotPassword />}
        />
        <Route path="/configuracao/alterar-email" element={<ChangeEmail />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardLogin />} />
        <Route
          path="/dashboard/alterar-senha"
          element={<DashboardForgotPassword />}
        />
        <Route path="/dashboard/mfa" element={<DashboardMFAVerification />} />
        <Route path="/dashboard/usuarios" element={<DashboardUsers />} />
        <Route path="/dashboard/usuario/:id" element={<DashboardUser />} />
        <Route
          path="/dashboard/usuario/:id/editar"
          element={<DashboardEditUser />}
        />
        <Route path="/dashboard/treinos" element={<DashboardTraining />} />
        <Route
          path="/dashboard/treino/:id"
          element={<DashboardTrainingDetail />}
        />
      </Route>

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
