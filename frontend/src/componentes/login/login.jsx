import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:7000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data && data.usuario && data.usuario.id) {
        localStorage.setItem("usuario_id", data.usuario.id);
        localStorage.setItem("usuario_nombre", data.usuario.nombre);
        localStorage.setItem("usuario_email", data.usuario.email);
        navigate("/calendario");
      } else {
        alert("Credenciales incorrectas ❌");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span>A</span>
        </div>

        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Ingresa a tu agenda personal</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="login-footer">
          ¿No tienes cuenta?{" "}
          <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
