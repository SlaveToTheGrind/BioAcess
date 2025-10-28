import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const fakeApi = {
  users: JSON.parse(localStorage.getItem("users")) || [],

  login: ({ email, password }) =>
    new Promise((resolve, reject) => {
      // Atualiza a lista de usuários a cada tentativa de login
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email === email && u.password === password);

      setTimeout(() => {
        user ? resolve(user) : reject("Usuário ou senha inválidos");
      }, 500);
    }),
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const user = await fakeApi.login({ email, password });
      localStorage.setItem("loggedUser", JSON.stringify(user));
      setMessageType("success");
      setMessage(`Bem-vindo, ${user.name}!`);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessageType("error");
      setMessage(err);
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
        <p
          style={{
            color: messageType === "success" ? "green" : "red",
            marginTop: "10px",
          }}
        >
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
