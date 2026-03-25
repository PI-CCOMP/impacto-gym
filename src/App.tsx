import "./styles/theme.css";
import "./styles/global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth } from "./pages/Auth";
import { Componentes } from "./Componentes";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Componentes />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
