import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./LoginUser";
import Register from "./RegisterUser";
import Dashboard from "./Dashboard";
import BombonaList from "./components/BombonaList";
import BombonaForm from "./components/BombonaForm";
import BombonaDetails from "./components/BombonaDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bombonas" element={<BombonaList />} />
        <Route path="/bombonas/new" element={<BombonaForm />} />
        <Route path="/bombonas/:id" element={<BombonaDetails />} />
      </Routes>
    </BrowserRouter>
  );
}