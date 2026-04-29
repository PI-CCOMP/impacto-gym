import "./styles/theme.css";
import "./styles/global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Componentes } from "./Componentes";

import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Registrar } from "./pages/Registrar";
import { MFAVerification } from "./pages/MFAVerification";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/componentes" element={<Componentes />} />
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="verificar-email" element={<MFAVerification />} />
      </Routes>
    </BrowserRouter>
  );
}
