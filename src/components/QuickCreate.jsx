import React from "react";
import { useState } from "react";
import { createBombona } from "../services/api";

export default function QuickCreate({ onCreated }) {
  const [form, setForm] = useState({ serial: "", label: "", contents: "" });
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createBombona(form);
      setForm({ serial: "", label: "", contents: "" });
      if (onCreated) onCreated();
      alert("Bombona criada");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Erro ao criar bombona");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h3>Criar Bombona</h3>
      <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Serial" value={form.serial} onChange={e => setForm(f => ({ ...f, serial: e.target.value }))} required />
        <input placeholder="Label" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
        <input placeholder="Descrição" value={form.contents} onChange={e => setForm(f => ({ ...f, contents: e.target.value }))} />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar"}</button>
        </div>
      </form>
    </section>
  );
}