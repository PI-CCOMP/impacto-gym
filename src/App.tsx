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

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/componentes" element={<Componentes />} />
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Register />} />
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
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
