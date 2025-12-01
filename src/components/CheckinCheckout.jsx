import React from "react";
import { useState } from "react";
import { checkoutBombona, checkinBombona } from "../services/api";

export default function CheckinCheckout({ bombonas = [], onDone }) {
  const [movement, setMovement] = useState({ bombonaId: "", location: "" });
  const [loading, setLoading] = useState(false);

  async function getDeviceLocation(timeout = 10000) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("Geolocalização não suportada"));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout }
      );
    });
  }

  async function handleAction(type) {
    if (!movement.bombonaId || !movement.location) { alert("Selecione bombona e local"); return; }
    setLoading(true);
    try {
      if (type === "checkout") {
        await checkoutBombona(movement.bombonaId, { toLocation: movement.location, latitude: movement.latitude ? Number(movement.latitude) : undefined, longitude: movement.longitude ? Number(movement.longitude) : undefined });
      } else {
        await checkinBombona(movement.bombonaId, { atLocation: movement.location, latitude: movement.latitude ? Number(movement.latitude) : undefined, longitude: movement.longitude ? Number(movement.longitude) : undefined });
      }
      alert("Operação realizada");
      setMovement({ bombonaId: "", location: "", latitude: "", longitude: "" });
      if (onDone) onDone();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Erro na operação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h3>Check-in / Check-out</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <select value={movement.bombonaId} onChange={e => setMovement(m => ({ ...m, bombonaId: e.target.value }))}>
          <option value="">-- selecione bombona --</option>
          {bombonas.map(b => <option key={b.id} value={b.id}>{b.serial} {b.label ? `(${b.label})` : ""}</option>)}
        </select>

        <input placeholder="Local" value={movement.location} onChange={e => setMovement(m => ({ ...m, location: e.target.value }))} />

        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Lat (opcional)" value={movement.latitude || ""} onChange={e => setMovement(m => ({ ...m, latitude: e.target.value }))} />
          <input placeholder="Lng (opcional)" value={movement.longitude || ""} onChange={e => setMovement(m => ({ ...m, longitude: e.target.value }))} />
          <button type="button" onClick={async () => {
            try {
              const loc = await getDeviceLocation();
              setMovement(m => ({ ...m, latitude: String(loc.latitude), longitude: String(loc.longitude) }));
            } catch (err) {
              alert("Erro ao obter localização: " + (err.message || err));
            }
          }}>Usar minha localização</button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => handleAction("checkout")} disabled={loading}>Checkout</button>
          <button onClick={() => handleAction("checkin")} disabled={loading}>Checkin</button>
        </div>
      </div>
    </section>
  );
}