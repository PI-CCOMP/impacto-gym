import "./styles/theme.css";
import "./styles/global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Componentes } from "./Componentes";

import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { MFAVerification } from "./pages/MFAVerification";
import { ForgotPassword } from "./pages/ForgotPassword";

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
      </Routes>
    </BrowserRouter>
  );
}
