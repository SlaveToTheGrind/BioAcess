import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getBombonas } from "../services/api";

function arraysEqualById(a = [], b = []) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]?.id !== b[i]?.id) return false;
  }
  return true;
}

export default function BombonaList({ items = null, loading = false, onSelect, refresh }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [localItems, setLocalItems] = useState(items || []);
  const [localLoading, setLocalLoading] = useState(Boolean(loading));

  useEffect(() => {
    if (items == null) return;
    if (!arraysEqualById(items, localItems)) {
      setLocalItems(items || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    setLocalLoading(Boolean(loading));
  }, [loading]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (items != null) return;
      setLocalLoading(true);
      try {
        const resp = await getBombonas();
        if (!mounted) return;
        setLocalItems(resp.data.bombonas || []);
      } catch (err) {
        console.error("Erro ao carregar bombonas:", err);
        if (mounted) setLocalItems([]);
      } finally {
        if (mounted) setLocalLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showVoltar = location?.pathname !== "/dashboard";
  const showNovo = location?.pathname !== "/dashboard";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Lista</h3>
        <div className="bombona-list-actions">
          <button
            className="small-button"
            onClick={async () => {
              if (refresh) return refresh();
              setLocalLoading(true);
              try {
                const r = await getBombonas();
                setLocalItems(r.data.bombonas || []);
              } catch (e) {
                console.error(e);
              } finally {
                setLocalLoading(false);
              }
            }}
          >
            Atualizar
          </button>

          {showNovo && <Link to="/bombonas/new"><button className="small-button" style={{ marginLeft: 8 }}>Novo</button></Link>}

          {showVoltar && (
            <button
              className="small-button"
              style={{ marginLeft: 8 }}
              onClick={() => navigate("/dashboard")}
              type="button"
            >
              Voltar
            </button>
          )}
        </div>
      </div>

      {localLoading ? <p>Carregando...</p> : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {localItems.map(b => (
            <li key={b.id} style={{ padding: 8, borderBottom: "1px solid #eee", cursor: "pointer" }} onClick={() => onSelect && onSelect(b)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{b.serial}</strong> {b.label ? `— ${b.label}` : ""}
                  <div style={{ fontSize: 12, color: "#666" }}>
                    RFID: {b.rfid ? b.rfid.uid : "-"} • Local: {b.currentLocation || "-"}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>{b.latitude != null && b.longitude != null ? "📍" : ""}</div>
              </div>
            </li>
          ))}
          {localItems.length === 0 && <li style={{ padding: 8, color: "#666" }}>Nenhuma bombona cadastrada</li>}
        </ul>
      )}
    </div>
  );
}