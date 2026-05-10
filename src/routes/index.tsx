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
import { DashboardEditTraining } from "../pages/Dashboard/DashboardEditTraining";
import { DashboardHelp } from "../pages/Dashboard/DashboardHelp";
import { DashboardAlert } from "../pages/Dashboard/DashboardAlert";
import { DashboardSettings } from "../pages/Dashboard/DashboardSettings";
import { DashboardChangeEmail } from "../pages/Dashboard/DashboardChangeEmail";

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
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/configuracoes/perfil" element={<Profile />} />
        <Route path="/configuracoes/faq" element={<Faq />} />
        <Route
          path="/configuracoes/alterar-senha"
          element={<ForgotPassword />}
        />
        <Route path="/configuracoes/alterar-email" element={<ChangeEmail />} />
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
        <Route
          path="/dashboard/treino/:id/editar"
          element={<DashboardEditTraining />}
        />
        <Route
          path="/dashboard/solicitacoes_auxilio"
          element={<DashboardHelp />}
        />
        <Route path="/dashboard/avisos" element={<DashboardAlert />} />
        <Route
          path="/dashboard/configuracoes"
          element={<DashboardSettings />}
        />
        <Route
          path="/dashboard/configuracoes/alterar-email"
          element={<DashboardChangeEmail />}
        />
      </Route>

      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
