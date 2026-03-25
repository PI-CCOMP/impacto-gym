import "./styles/theme.css";
import "./styles/global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Index } from "./pages/Index";
import { Componentes } from "./Componentes";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Ccmponentes" element={<Componentes />} />
      </Routes>
    </BrowserRouter>
  );
}
