import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBombona } from "../services/api";

export default function BombonaForm() {
  const [form, setForm] = useState({ serial: "", label: "", contents: "" });
  const navigate = useNavigate();

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createBombona(form);
      navigate("/bombonas");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Erro ao criar bombona");
    }
  }

  return (
    <div>
      <h2>Criar Bombona</h2>
      <form onSubmit={handleCreate}>
        <input placeholder="Serial" value={form.serial} onChange={e => setForm(f => ({ ...f, serial: e.target.value }))} required />
        <input placeholder="Label" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
        <input placeholder="Descrição/Conteúdo" value={form.contents} onChange={e => setForm(f => ({ ...f, contents: e.target.value }))} />
        <div style={{ marginTop: 8 }}>
          <button type="submit">Criar</button>
          <button type="button" onClick={() => navigate("/bombonas")} style={{ marginLeft: 8 }}>Cancelar</button>
        </div>
      </form>
    </div>

  );
}