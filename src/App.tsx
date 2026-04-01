import "./styles/theme.css";
import "./styles/global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Componentes } from "./Componentes";

import { Index } from "./pages/Index";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/componentes" element={<Componentes />} />
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
