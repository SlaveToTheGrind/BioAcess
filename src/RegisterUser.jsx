import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./services/api";
import "./App.css";

export default function RegisterUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setMessageType(null);

    try {
      const resp = await registerUser({ name, email, password });
      setMessageType("success");
      setMessage("Usuário cadastrado com sucesso. Redirecionando para login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      // Log completo para debugging
      console.error("Register error:", err);
      console.error("err.response:", err?.response);
      console.error("err.response?.data:", err?.response?.data);

      // tentar mensagem amigável do backend, se existir
      const apiMessage = err?.response?.data?.message || err?.response?.data || err?.message;
      setMessageType("error");
      setMessage(apiMessage || "Erro ao cadastrar usuário");
    }
  }

  return (
    <div className="register-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Cadastrar</button>
      </form>

      {message && (
        <p style={{ color: messageType === "success" ? "green" : "red", marginTop: "10px" }}>
          {message}
        </p>
      )}

      <p style={{ marginTop: "10px" }}>
        Já tem conta?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Fazer login
        </a>
      </p>
    </div>
  );
}