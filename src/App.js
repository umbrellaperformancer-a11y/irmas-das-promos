import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Manutencao from "./pages/Manutencao";
import Aprovacao from "./pages/principal";
import Perfumes from "./pages/perfumes";
import Admin from "./pages/admin";

import AdminShortcut from "./components/AdminShortcut"; // ✅ IMPORTA

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ Atalho global (Ctrl+A+M / 3 dedos) */}
      <AdminShortcut />

      <Routes>
        <Route path="/" element={<Aprovacao />} />
        {/* <Route path="/aprovacao" element={<Aprovacao />} />
        <Route path="/perfumes" element={<Perfumes />} /> */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
