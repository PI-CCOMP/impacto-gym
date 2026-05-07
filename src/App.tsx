import "./styles/theme.css";
import "./styles/global.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Componentes } from "./Componentes";

import { Index } from "./pages/Aluno/Index";
import { Login } from "./pages/Aluno/Login";
import { Register } from "./pages/Aluno/Register";
import { MFAVerification } from "./pages/Aluno/MFAVerification";
import { ForgotPassword } from "./pages/Aluno/ForgotPassword";
import { Home } from "./pages/Aluno/Home";
import { Training } from "./pages/Aluno/Training";
import { Exercise } from "./pages/Aluno/Exercise";
import { Help } from "./pages/Aluno/Help";
import { HelpRequest } from "./pages/Aluno/HelpRequest";
import { Alert } from "./pages/Aluno/Alert";
import { History } from "./pages/Aluno/History";
import { HistoryDetail } from "./pages/Aluno/HistoryDetail";
import { Settings } from "./pages/Aluno/Settings";
import { Profile } from "./pages/Aluno/Profile";
import { Faq } from "./pages/Aluno/Faq";
import { ChangeEmail } from "./pages/Aluno/ChangeEmail";
import { Page404 } from "./pages/Aluno/Page404";
import { Wrapper } from "./components/Wrapper";

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/componentes" element={<Componentes />} />
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="verificar-email" element={<MFAVerification />} />
      <Route path="/alterar-senha" element={<ForgotPassword />} />
      <Route path="/inicio" element={<Home />} />
      <Route
        path="/treino/:idTreino"
        element={<Training key={location.pathname} />}
      />
      <Route path="/exercicio/:idExercicio" element={<Exercise />} />
      <Route path="/ajuda" element={<Help />} />
      <Route path="/solicitacao-auxilio" element={<HelpRequest />} />
      <Route path="/aviso" element={<Alert />} />
      <Route path="/historico" element={<History />} />
      <Route path="/historico/:id" element={<HistoryDetail />} />
      <Route path="/configuracao" element={<Settings />} />
      <Route path="/configuracao/perfil" element={<Profile />} />
      <Route path="/configuracao/faq" element={<Faq />} />
      <Route path="/configuracao/alterar-senha" element={<ForgotPassword />} />
      <Route path="/configuracao/alterar-email" element={<ChangeEmail />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Wrapper>
        <AppRoutes />
      </Wrapper>
    </BrowserRouter>
  );
}
