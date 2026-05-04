import "./styles/theme.css";
import "./styles/global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Componentes } from "./Componentes";

import { Index } from "./pages/Aluno/Index";
import { Login } from "./pages/Aluno/Login";
import { Register } from "./pages/Aluno/Register";
import { MFAVerification } from "./pages/Aluno/MFAVerification";
import { ForgotPassword } from "./pages/Aluno/ForgotPassword";
import { Home } from "./pages/Aluno/Home";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/componentes" element={<Componentes />} />
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="verificar-email" element={<MFAVerification />} />
        <Route path="/alterar-senha" element={<ForgotPassword />} />
        <Route path="/inicio" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
