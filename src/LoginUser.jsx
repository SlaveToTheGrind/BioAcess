import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services/api";
import "./App.css";

export default function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setMessageType(null);

    try {
      const resp = await loginUser({ email, password });
      const { token, user } = resp.data;

      // Armazenar token e usuário (em dev: localStorage; em produção prefira cookie HttpOnly)
      localStorage.setItem("token", token);
      localStorage.setItem("loggedUser", JSON.stringify(user));

      setMessageType("success");
      setMessage(`Bem-vindo, ${user.name || user.email}`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setMessageType("error");
      setMessage(apiMessage || "Erro ao autenticar");
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>

      {message && (
        <p style={{ color: messageType === "success" ? "green" : "red", marginTop: "10px" }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: "10px" }}>
        Não tem uma conta?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/register");
          }}
        >
          Cadastrar
        </a>
      </p>
    </div>
  );
}