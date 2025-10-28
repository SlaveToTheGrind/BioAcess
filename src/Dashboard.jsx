import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";

// Ícone padrão do Leaflet corrigido (sem erro de imagem quebrada)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [equipamentos, setEquipamentos] = useState([]);

  // Pega usuário logado
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!storedUser) {
      navigate("/"); // sem login, redireciona
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Gera dados simulados de equipamentos
  useEffect(() => {
    const gerarEquipamentos = () => {
      const fakeData = [
        { id: 1, nome: "Sensor Aliexpress", status: "Ativo", lat: 22.27441398053124, lng: 114.174102077177},
        { id: 2, nome: "Câmera Trump", status: "Inativo", lat: 38.897859969648124,lng: -77.0364868876297 },
        { id: 3, nome: "Módulo SP", status: "Ativo", lat: -23.558, lng: -46.63 },
      ];
      return fakeData.map((eq) => ({
        ...eq,
        status: Math.random() > 0.5 ? "Ativo" : "Inativo", // alterna o status
      }));
    };

    setEquipamentos(gerarEquipamentos());

    const interval = setInterval(() => {
      setEquipamentos(gerarEquipamentos());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function handleLogout() {
    localStorage.removeItem("loggedUser");
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div>
          <p>Bem-vindo, <strong>{user.name}</strong></p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="equip-list">
          <h2>Equipamentos</h2>
          <ul>
            {equipamentos.map((eq) => (
              <li key={eq.id}>
                <strong>{eq.nome}</strong> —{" "}
                <span
                  style={{
                    color: eq.status === "Ativo" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {eq.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="equip-map">
          <h2>Mapa de Localização</h2>
          <MapContainer
            center={[-23.653113046030906, -52.61336181534213]}
            zoom={13}
            style={{ height: "400px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {equipamentos.map((eq) => (
              <Marker key={eq.id} position={[eq.lat, eq.lng]}>
                <Popup>
                  <b>{eq.nome}</b>
                  <br />
                  Status:{" "}
                  <span style={{ color: eq.status === "Ativo" ? "green" : "red" }}>
                    {eq.status}
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </main>
    </div>
  );
}
