import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearUsuario } from "../../services/api";
import "./registro.css";

function Registro() {
  const [datos, setDatos] = useState({ nombre: "", correo: "", contrasena: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearUsuario(datos);
      alert("Usuario creado correctamente ✅");
      setDatos({ nombre: "", correo: "", contrasena: "" });
      navigate("/");
    } catch (error) {
      alert("Error al crear usuario ❌");
      console.error(error);
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-card">
        <div className="registro-logo">
          <span>A</span>
        </div>

        <h1 className="registro-title">Crear cuenta</h1>
        <p className="registro-subtitle">Completa tus datos para registrarte</p>

        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="registro-form-group">
            <label className="registro-label">Nombre</label>
            <input
              className="form-input"
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={datos.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="registro-form-group">
            <label className="registro-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              name="correo"
              placeholder="tu@correo.com"
              value={datos.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="registro-form-group">
            <label className="registro-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              name="contrasena"
              placeholder="••••••••"
              value={datos.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Crear cuenta
          </button>
        </form>

        <p className="registro-footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
